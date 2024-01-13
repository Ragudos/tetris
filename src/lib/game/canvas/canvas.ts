import type Tetromino from "../tetromino/tetromino";
import MovementEngine from "../engine/movement-engine";
import CollisionEngine from "../engine/collision-engine";
import TetrominoBag from "../tetromino/bag";
import DropEngine from "../engine/drop-engine";
import AnimationEngine from "../engine/animation-engine";
import TimeEngine from "../engine/time-engine";
import StackEngine from "../engine/stack-engine";
import RotationEngine from "../engine/rotation-engine";
import tetrisEvents from "../../events/tetris-events";
import Timer from "../timer";
import { get_sprite_position } from "../tetromino/sprite";
import storage from "../tetromino/storage";
import type { XY } from "../../xy";

class GameCanvas {
	private renderer: Timer;

	private base_x_position: number;

	canvas: HTMLCanvasElement;
	ctx: CanvasRenderingContext2D;

	id: string;
	game_map: (null | Tetromino)[][];

	current_block: Tetromino;
	next_block: Tetromino;
	swapped_block: null | Tetromino;

	movement_engine: MovementEngine;
	collision_engine: CollisionEngine;
	animation_engine: AnimationEngine;
	drop_engine: DropEngine;
	time_engine: TimeEngine;
	stack_engine: StackEngine;
	rotation_engine: RotationEngine;

	bag: TetrominoBag;

	is_game_over: boolean;

	ghost_y_pos: number;
	ghost_sprite_position: XY;

	can_swap: boolean;

	size: number;

	constructor(id: string, blocks: Tetromino[], size: number) {
		this.id = id;

		const canvas = document.getElementById(id) as HTMLCanvasElement;

		if (!canvas) {
			throw new Error(`Couldn't find canvas with id ${id}`);
		}

		const ctx = canvas.getContext("2d") as CanvasRenderingContext2D;

		if (!ctx) {
			throw new Error(
				`Couldn't get canvas context for canvas with id ${id}`,
			);
		}

		this.canvas = canvas;
		this.ctx = ctx;

		this.renderer = new Timer();
		this.renderer.add(this.render.bind(this));

		this.bag = new TetrominoBag(blocks);

		this.is_game_over = false;

		this.game_map = new Array(20)
			.fill(null)
			.map(() => new Array(10).fill(null));

		this.animation_engine = new AnimationEngine(this);
		this.collision_engine = new CollisionEngine(10, 20, this);
		this.drop_engine = new DropEngine(this);
		this.movement_engine = new MovementEngine(this);
		this.time_engine = new TimeEngine(this);
		this.stack_engine = new StackEngine(this);
		this.rotation_engine = new RotationEngine(this);

		this.current_block = this.bag.get_tetromino();
		this.next_block = this.bag.get_tetromino();
		this.swapped_block = null;

		this.can_swap = true;

		this.base_x_position = 4;

		this.size = size;

		this.ghost_y_pos = 18;
		this.ghost_sprite_position = get_sprite_position(
			"ghost",
			storage.sprite_type,
		);
	}

	private handle_soft_drop(): void {
		if (!this.drop_engine.is_soft_dropping) {
			return;
		}

		if (
			this.time_engine.time_elapsed_since_last_drop >=
			this.drop_engine.soft_drop_gravity
		) {
			this.movement_engine.move_down();
			this.time_engine.time_elapsed_since_last_drop = 0;
		}
	}

	private handle_gravity(): void {
		if (this.drop_engine.is_soft_dropping) {
			return;
		}

		if (
			this.time_engine.time_elapsed_since_last_drop >=
			this.drop_engine.gravity
		) {
			this.movement_engine.move_down();
			this.time_engine.time_elapsed_since_last_drop = 0;
		}
	}

	private update(): void {
		this.handle_soft_drop();
		this.handle_gravity();
		this.movement_engine.move_left();
		this.movement_engine.move_right();
	}

	private render(time: number): void {
		if (this.is_game_over) {
			return;
		}

		this.animation_engine.animate();
		this.time_engine.tick(time);
		this.update();
	}

	private reset_block_rotation(block: Tetromino): void {
		const curr_rotation = block.rotation;

		if (curr_rotation > 0) {
			for (let i = curr_rotation; i > 0; --i) {
				block.rotate(-1);
			}
		}

		if (curr_rotation < 0) {
			for (let i = curr_rotation; i < 0; ++i) {
				block.rotate(1);
			}
		}
	}

	swap_block(): void {
		if (!this.can_swap) {
			return;
		}

		const current_block = this.current_block;

		if (current_block === null) {
			return;
		}

		if (this.swapped_block === null) {
			this.reset_block_rotation(current_block);
			current_block.position.x = 0;
			this.swapped_block = current_block;
			this.get_new_block();
		} else {
			this.reset_block_rotation(current_block);
			current_block.position.x = 0;
			current_block.position.y = 0;
			const tmp_block = this.swapped_block;
			this.swapped_block = current_block;
			this.current_block = tmp_block;
			this.current_block.position.x = this.base_x_position;
		}

		tetrisEvents.$emit("tetris:hold", {
			canvas_id: this.id,
		});
		this.can_swap = false;
		this.drop_engine.recalculate_ghost_y();
	}

	get_new_block(): void {
		this.current_block = this.next_block || this.bag.get_tetromino();
		this.next_block = this.bag.get_tetromino();

		this.current_block!.position.x = this.base_x_position;
		this.can_swap = true;

		this.drop_engine.recalculate_ghost_y();
	}

	start(): void {
		this.renderer.start();
	}

	stop(): void {
		this.renderer.stop();
	}
}

export default GameCanvas;
