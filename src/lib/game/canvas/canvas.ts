import type { Tetromino } from "../tetromino/tetromino";
import MovementEngine from "../engine/movement-engine";
import CollisionEngine from "../engine/collision-engine";
import TetrominoBag from "../tetromino/bag";
import DropEngine from "../engine/drop-engine";
import AnimationEngine from "../engine/animation-engine";
import { Renderer } from "../../renderer";
import TimeEngine from "../engine/time-engine";
import StackEngine from "../engine/stack-engine";
import RotationEngine from "../engine/rotation-engine";
import tetrisEvents from "../../events/tetris-events";

interface CanvasObject {
	canvas: HTMLCanvasElement;
	ctx: CanvasRenderingContext2D;
	block: null | Tetromino;
	size: number;
}

export interface GameCanvasBase {
	id: string;
	game_map: (null | Tetromino)[][];
	main_canvas: CanvasObject;
	next_canvas: CanvasObject;
	movement_engine: MovementEngine;
	collision_engine: CollisionEngine;
	animation_engine: AnimationEngine;
	drop_engine: DropEngine;
	time_engine: TimeEngine;
	stack_engine: StackEngine;
	bag: TetrominoBag;
	is_game_over: boolean;
	size: number;
	rotation_engine: RotationEngine;

	start(): void;
	stop(): void;
	get_new_block(): void;

	swap_block(): void;
	swap_canvas: CanvasObject;
	ghost_y_pos: number;
	can_swap: boolean;
}

class CanvasObject implements CanvasObject {
	canvas: HTMLCanvasElement;
	ctx: CanvasRenderingContext2D;
	block: null | Tetromino;
	size: number;

	constructor(
		canvas: HTMLCanvasElement,
		ctx: CanvasRenderingContext2D,
		block: null | Tetromino,
		size: number
	) {
		this.canvas = canvas;
		this.ctx = ctx;
		this.block = block;
		this.size = size;
	}
}

class GameCanvas implements GameCanvasBase {
	private renderer: Renderer;

	private base_x_position: number;

	id: string;
	game_map: (null | Tetromino)[][];
	main_canvas: CanvasObject;
	next_canvas: CanvasObject;
	swap_canvas: CanvasObject;
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
	can_swap: boolean;
	size: number;

	constructor(id: string, blocks: Tetromino[], size: number) {
		this.id = id;

		const canvases = Array.from(
			document.querySelectorAll(`canvas[data-id="${id}"]`),
		) as HTMLCanvasElement[];

		if (canvases.length === 0) {
			throw new Error(
				`No canvas found with id ${id}. Do they have an attribute of data-id?`,
			);
		}

		if (canvases.length > 3) {
			throw new Error(
				`Too many canvases found with id ${id}. There should only be 3.`,
			);
		}

		const main_canvas = canvases.find(
			(canvas) => canvas.getAttribute("data-type") === "main",
		);
		const next_canvas = canvases.find(
			(canvas) => canvas.getAttribute("data-type") === "next",
		);
		const swap_canvas = canvases.find(
			(canvas) => canvas.getAttribute("data-type") === "swap",
		);

		if (!main_canvas || !next_canvas || !swap_canvas) {
			throw new Error(
				`Not all canvases found with id ${id}. There should be 3. The types are main, next, and swap which is the value of their attribute, "data-type"`,
			);
		}

		this.renderer = new Renderer(this.render.bind(this));
		this.bag = new TetrominoBag(blocks);
		this.main_canvas = new CanvasObject(
			main_canvas,
			main_canvas.getContext("2d") as CanvasRenderingContext2D,
			this.bag.get_tetromino(),
			size
		);
		this.next_canvas = new CanvasObject(
			next_canvas,
			next_canvas.getContext("2d") as CanvasRenderingContext2D,
			this.bag.get_tetromino(),
			Math.round(next_canvas.width / 6)
		);
		this.swap_canvas = new CanvasObject(
			swap_canvas,
			swap_canvas.getContext("2d") as CanvasRenderingContext2D,
			null,
			Math.round(swap_canvas.width / 6)
		);

		console.log(this.next_canvas);
		this.ghost_y_pos = 18;
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
		this.can_swap = true;
		this.base_x_position = 4;
		this.size = size;
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

		const current_block = this.main_canvas.block;

		if (current_block === null) {
			return;
		}

		if (this.swap_canvas.block === null) {
			this.reset_block_rotation(current_block);
			current_block.position.x = 0;
			this.swap_canvas.block = current_block;
			this.get_new_block();
		} else {
			this.reset_block_rotation(current_block);
			current_block.position.x = 0;
			current_block.position.y = 0;
			const tmp_block = this.swap_canvas.block;
			this.swap_canvas.block = current_block;
			this.main_canvas.block = tmp_block;
			this.main_canvas.block.position.x = this.base_x_position;
		}

		tetrisEvents.$emit("tetris:hold", {
			canvas_id: this.id,
		});
		this.can_swap = false;
		this.drop_engine.recalculate_ghost_y();
	}

	get_new_block(): void {
		this.main_canvas.block =
			this.next_canvas.block || this.bag.get_tetromino();
		this.next_canvas.block = this.bag.get_tetromino();

		this.main_canvas.block.position.x = this.base_x_position;
		this.can_swap = true;

		this.drop_engine.recalculate_ghost_y();
	}

	start(): void {
		if (this.renderer.is_rendering) {
			return;
		}

		this.renderer.start_rendering();
	}

	stop(): void {
		if (!this.renderer.is_rendering) {
			return;
		}

		this.renderer.stop_rendering();
	}
}

export default GameCanvas;
