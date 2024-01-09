import type { Tetromino } from "../tetromino/tetromino";
import MovementEngine from "../engine/movement-engine";
import CollisionEngine from "../engine/collision-engine";
import TetrominoBag from "../tetromino/bag";
import DropEngine from "../engine/drop-engine";
import AnimationEngine from "../engine/animation-engine";
import { Renderer } from "../../renderer";
import TimeEngine from "../engine/time-engine";

interface CanvasObject {
	canvas: HTMLCanvasElement;
	ctx: CanvasRenderingContext2D;
	block: null | Tetromino;
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
	bag: TetrominoBag;
	is_game_over: boolean;
	gravity: number;

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

	constructor(
		canvas: HTMLCanvasElement,
		ctx: CanvasRenderingContext2D,
		block: null | Tetromino,
	) {
		this.canvas = canvas;
		this.ctx = ctx;
		this.block = block;
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
	bag: TetrominoBag;
	is_game_over: boolean;
	ghost_y_pos: number;
	gravity: number;
	can_swap: boolean;

	constructor(id: string, blocks: Tetromino[]) {
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
		this.gravity = 1;
		this.bag = new TetrominoBag(blocks);
		this.main_canvas = new CanvasObject(
			main_canvas,
			main_canvas.getContext("2d") as CanvasRenderingContext2D,
			null,
		);
		this.next_canvas = new CanvasObject(
			next_canvas,
			next_canvas.getContext("2d") as CanvasRenderingContext2D,
			null,
		);
		this.swap_canvas = new CanvasObject(
			swap_canvas,
			swap_canvas.getContext("2d") as CanvasRenderingContext2D,
			null,
		);
		this.ghost_y_pos = 18;
		this.is_game_over = false;
		this.game_map = new Array(20).map(() => new Array(10).fill(null));
		this.animation_engine = new AnimationEngine(this);
		this.collision_engine = new CollisionEngine(10, 20, this);
		this.drop_engine = new DropEngine(this);
		this.movement_engine = new MovementEngine(this);
		this.time_engine = new TimeEngine(this);
		this.can_swap = true;
		this.base_x_position = 4;
	}

	private update(): void {}

	private render(time: number): void {
		if (this.is_game_over) {
			return;
		}

		this.animation_engine.animate();
		this.time_engine.tick(time);
		this.update();
	}

	swap_block(): void {
		throw new Error("Method not implemented.");
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
