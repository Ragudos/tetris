import { Renderer } from "../renderer";
import StageAnimator from "./stage-animator";
import { StageCommands } from "./stage-commands";
import type { TetrominoInterface } from "../tetromino/tetromino";
import { Timer } from "../timer";
import type { XY } from "../xy";
import TetrominoBag from "../tetromino/bag";

export interface StageCanvas {
	main_canvas: HTMLCanvasElement;
	swapped_block_canvas: HTMLCanvasElement;
	next_block_canvas: HTMLCanvasElement;
}

// TODO:
// - Implement a game over state
// - Implement a pause state
// - Implement a restart state
// - Implement a game over screen
// - Implement a pause screen
// - Implement a restart screen
// - Implement a score system
// - Implement a level system
// - Implement a line clear system
// - Have an extensible stage for player canvas, mini canvas, and non-player canvas since we only
// need a few functions for a non-player canvas as we will rely on websockets and main events sent from
// it like hard drop, move, rotate, etc

export interface StageInterface {
	main_canvas: HTMLCanvasElement;
	swapped_block_canvas: HTMLCanvasElement;
	next_block_canvas: HTMLCanvasElement;
	commands: StageCommands;
	block_size: number;
	game_map: GameMap;
	/**
	 * A number to be divided from 1000 milliseconds
	 */
	gravity: number;
	/**
	 * A number to be divided from 1000 milliseconds. Twice the gravity.
	 */
	soft_drop_gravity: number;
	lock_delay: number;
	max_lock_resets: number;
	is_soft_dropping: boolean;
	is_game_over: boolean;
	current_block: null | TetrominoInterface;
	id: string;
	square_count_x: number;
	square_count_y: number;
	ghost_y: number;

	swap_blocks(): void;
	lock_block(): void;
	get_new_block(): void;
	start_lock_timer(): void;
	reset_lock_timer(): void;
	change_is_soft_dropping(state: boolean): ThisParameterType<StageInterface>;
	change_is_hard_dropping(state: boolean): ThisParameterType<StageInterface>;
	change_can_swap(state: boolean): ThisParameterType<StageInterface>;
}

export type GameMap = (null | TetrominoInterface)[][];

export type StageOptions = {
	/**
	 * @description The delay in milliseconds before a block's position on the floor or stack is finalized
	 * and the next block is spawned. This does not apply to a hard drop.
	 */
	lock_delay: number;
	/**
	 * @description The maximum amount of times the lock delay can be reset. Since if a position changes or the block
	 * rotates, we need to reset the lock delay/timer. Set to 0 to disable
	 */
	max_lock_resets: number;

	/**
	 * @description The gravity of the game. This is how fast the block moves down.
	 * Divided by 1000
	 */
	gravity: number;
};

export type GameInfo = {
	/**
	 * Usually a 10 x 20 grid for Tetris.
	 */
	game_map_dimensions: XY;
	block_size: number;
	blocks: TetrominoInterface[];
};

/**
 * @class Stage
 * @implements StageInterface
 * @description Can throw an error at construction and during operations.
 */
export class Stage implements StageInterface {
	public readonly commands: StageCommands;
	public readonly animator: StageAnimator;
	public readonly id: string;
	public readonly game_map: GameMap;

	private __renderer: Renderer;
	private __main_canvas: HTMLCanvasElement;
	private __swapped_block_canvas: HTMLCanvasElement;
	private __next_block_canvas: HTMLCanvasElement;
	private __main_ctx: CanvasRenderingContext2D;
	private __swapped_block_ctx: CanvasRenderingContext2D;
	private __next_block_ctx: CanvasRenderingContext2D;

	private __square_count_x: number;
	private __square_count_y: number;
	private __block_size: number;

	private __max_lock_resets: number;
	private __lock_timer: Timer;
	private __lock_delay_restarts: number;

	private __current_block: null | TetrominoInterface;
	private __next_block: null | TetrominoInterface;
	private __swapped_block: null | TetrominoInterface;

	private __gravity: number;
	private __x_pull_limit: number;
	private __x_pull: number;
	private __soft_drop_gravity: number;
	private __gravity_in_milliseconds: number;
	private __soft_drop_gravity_in_milliseconds: number;

	private __time_elapsed_since_start: number;
	private __time_elapsed_since_last_drop: number;
	private __time_elapsed_since_last_movement: number;

	private __is_game_over: boolean;

	private __is_soft_dropping: boolean;
	private __is_hard_dropping: boolean;
	private __is_moving_right: boolean;
	private __is_moving_left: boolean;

	private __can_swap: boolean;
	// Y position of ghost
	private __ghost_y: number;

	private __bag: TetrominoBag;

	constructor(
		canvas: StageCanvas,
		game_info: GameInfo,
		options: StageOptions,
	) {
		this.__main_canvas = canvas.main_canvas;
		this.__swapped_block_canvas = canvas.swapped_block_canvas;
		this.__next_block_canvas = canvas.next_block_canvas;

		const main_ctx = this.__main_canvas.getContext("2d");
		const swapped_block_ctx = this.__swapped_block_canvas.getContext("2d");
		const next_block_ctx = this.__next_block_canvas.getContext("2d");

		if (!main_ctx || !swapped_block_ctx || !next_block_ctx) {
			throw this.throw_error("Could not get 2d context");
		}

		this.__main_ctx = main_ctx;
		this.__swapped_block_ctx = swapped_block_ctx;
		this.__next_block_ctx = next_block_ctx;

		const id = this.__main_canvas.getAttribute("data-id");

		if (!id) {
			throw this.throw_error(
				"Could not get data-id attribute value of main canvas",
			);
		}

		this.id = id;

		this.game_map = new Array(game_info.game_map_dimensions.y)
			.fill(null)
			.map(() => new Array(game_info.game_map_dimensions.x).fill(null));
		this.__square_count_x = game_info.game_map_dimensions.x;
		this.__square_count_y = game_info.game_map_dimensions.y;
		this.__block_size = game_info.block_size;

		this.__max_lock_resets = options.max_lock_resets;
		this.__lock_timer = new Timer(options.lock_delay);
		this.__lock_delay_restarts = 0;

		this.__current_block = null;
		this.__next_block = null;
		this.__swapped_block = null;

		this.__gravity = options.gravity;
		this.__x_pull_limit = 20;
		this.__x_pull = 200;
		this.__soft_drop_gravity = Math.trunc(30 * this.__gravity);
		this.__gravity_in_milliseconds = Math.trunc(1000 / this.__gravity);
		this.__soft_drop_gravity_in_milliseconds = Math.trunc(
			1000 / this.__soft_drop_gravity,
		);

		this.__time_elapsed_since_start = 0;
		this.__time_elapsed_since_last_drop = 0;
		this.__time_elapsed_since_last_movement = 0;

		this.__is_soft_dropping = false;
		this.__is_hard_dropping = false;
		this.__is_moving_right = false;
		this.__is_moving_left = false;

		this.__can_swap = true;
		this.__is_game_over = false;
		this.__ghost_y = this.__square_count_y;

		this.__bag = new TetrominoBag(game_info.blocks);

		this.commands = new StageCommands(this);
		this.animator = new StageAnimator(this);
		this.__renderer = new Renderer(this.render.bind(this));
		this.__lock_timer.set_callback(this.lock_block.bind(this));
	}

	private throw_error(err: string): void {
		throw new Error(`Stage: ${err}`);
	}

	private reset_block(block: TetrominoInterface): void {
		block.change_position(0, 4);

		if (block.rotation < 0) {
			for (let i = block.rotation; i < 0; ++i) {
				block.rotate(1);
			}
		}

		if (block.rotation > 0) {
			for (let i = 0; i < block.rotation; ++i) {
				block.rotate(-1);
			}
		}
	}

	private handle_soft_drop(): void {
		if (this.__is_soft_dropping) {
			if (
				this.__time_elapsed_since_last_drop >=
				this.__soft_drop_gravity_in_milliseconds
			) {
				this.commands.move_block_down();
				this.__time_elapsed_since_last_drop = 0;
			}
		}
	}

	private handle_move_block_down(): void {
		if (this.__is_soft_dropping) {
			return;
		}

		if (
			this.__time_elapsed_since_last_drop >=
			this.__gravity_in_milliseconds
		) {
			this.commands.move_block_down();

			this.__time_elapsed_since_last_drop = 0;
		}
	}

	private handle_move_right(): void {
		if (this.__is_moving_right) {
			if (this.__time_elapsed_since_last_movement >= this.__x_pull) {
				this.commands.move_block_right();
				const new_x_pull =
					this.__x_pull - Math.ceil(this.__x_pull * 0.175);

				if (new_x_pull > this.__x_pull_limit) {
					this.__x_pull = new_x_pull;
				}

				this.__time_elapsed_since_last_movement = 0;
			}
		}
	}

	private handle_move_left(): void {
		if (this.__is_moving_left) {
			if (this.__time_elapsed_since_last_movement >= this.__x_pull) {
				this.commands.move_block_left();

				const new_x_pull =
					this.__x_pull - Math.ceil(this.__x_pull * 0.175);

				if (new_x_pull > this.__x_pull_limit) {
					this.__x_pull = new_x_pull;
				}

				this.__time_elapsed_since_last_movement = 0;
			}
		}
	}

	private render(time: number): void {
		if (this.__is_game_over) {
			return;
		}

		this.animator.animate();

		const delta_time = Math.trunc(time - this.__time_elapsed_since_start);

		this.__time_elapsed_since_last_drop += delta_time;
		this.__time_elapsed_since_last_movement += delta_time;

		this.handle_soft_drop();
		this.handle_move_block_down();
		this.handle_move_right();
		this.handle_move_left();

		this.__time_elapsed_since_start = time;
	}

	public reset_x_pull(): void {
		this.__x_pull = 100;
	}

	public lock_block(): void {
		if (!this.commands.is_colliding_down(1)) {
			return;
		}

		// In case we hard drop whilst the lock timer is running
		if (this.__lock_timer.is_running) {
			this.__lock_timer.stop();
			this.lock_timer.reset_delay();
		}

		this.commands.update_game_map();
		this.commands.clear_completed_row();
		this.get_new_block();
		this.commands.recalculate_ghost_y();

		this.__lock_delay_restarts = 0;
	}

	public change_is_soft_dropping(state: boolean): ThisParameterType<Stage> {
		this.__is_soft_dropping = state;

		return this;
	}

	public change_is_hard_dropping(state: boolean): ThisParameterType<Stage> {
		this.__is_hard_dropping = state;

		return this;
	}

	public change_is_moving_right(state: boolean): ThisParameterType<Stage> {
		if (state && this.__is_moving_left) {
			this.change_is_moving_left(false);
			this.reset_x_pull();
		}

		this.__is_moving_right = state;

		return this;
	}

	public change_is_moving_left(state: boolean): ThisParameterType<Stage> {
		if (state && this.__is_moving_right) {
			this.change_is_moving_right(false);
			this.reset_x_pull();
		}

		this.__is_moving_left = state;

		return this;
	}

	public change_ghost_y(num: number): ThisParameterType<Stage> {
		this.__ghost_y = num;

		return this;
	}

	public change_can_swap(state: boolean): ThisParameterType<Stage> {
		this.__can_swap = state;

		return this;
	}

	public swap_blocks(): void {
		if (!this.__can_swap) {
			return;
		}

		this.reset_lock_timer();
		this.__lock_delay_restarts = 0;

		if (!this.__swapped_block) {
			this.reset_block(this.__current_block!);
			this.__swapped_block = this.__current_block;
			this.__swapped_block?.change_position(0, 0);
			this.__current_block = this.__next_block;
			this.reset_block(this.__current_block!);
			this.__next_block = this.commands.get_random_block();
		} else {
			this.reset_block(this.__current_block!);
			const temp = this.__current_block;
			this.__current_block = this.__swapped_block;
			this.__swapped_block = temp;
			this.__swapped_block?.change_position(0, 0);
			this.reset_block(this.__current_block!);
		}

		this.__can_swap = false;
		this.commands.recalculate_ghost_y();
	}

	public get_new_block(): void {
		this.__current_block =
			this.__next_block || this.commands.get_random_block();
		this.__next_block = this.commands.get_random_block();
		this.__current_block.change_position(0, 4);
		this.__can_swap = true;

		this.commands.recalculate_ghost_y();
	}

	public start_lock_timer(): void {
		this.__lock_timer.start();
	}

	public reset_lock_timer(): void {
		if (this.__lock_delay_restarts >= this.__max_lock_resets) {
			return;
		}

		this.__lock_timer.stop();
		this.__lock_timer.reset_delay();
		this.__lock_delay_restarts += 1;
	}

	public start(): void {
		if (this.__renderer.is_rendering) {
			return;
		}

		this.__current_block = this.commands.get_random_block();
		this.__next_block = this.commands.get_random_block();

		this.__current_block.change_position(0, 4);
		this.commands.recalculate_ghost_y();
		this.__renderer.start_rendering();
	}

	public stop(): void {
		this.__renderer.stop_rendering();
	}

	public game_over(): void {
		this.stop();
		this.__is_game_over = true;
	}

	get bag(): TetrominoBag {
		return this.__bag;
	}

	get ghost_y(): number {
		return this.__ghost_y;
	}

	get is_moving_right(): boolean {
		return this.__is_moving_right;
	}

	get is_moving_left(): boolean {
		return this.__is_moving_left;
	}

	get square_count_x(): number {
		return this.__square_count_x;
	}

	get square_count_y(): number {
		return this.__square_count_y;
	}

	get can_swap(): boolean {
		return this.__can_swap;
	}

	get lock_delay_restarts(): number {
		return this.__lock_delay_restarts;
	}

	get lock_timer(): Timer {
		return this.__lock_timer;
	}

	get next_block(): null | TetrominoInterface {
		return this.__next_block;
	}

	get swapped_block(): null | TetrominoInterface {
		return this.__swapped_block;
	}

	get current_block(): null | TetrominoInterface {
		return this.__current_block;
	}

	get is_game_over(): boolean {
		return this.__is_game_over;
	}

	get is_soft_dropping(): boolean {
		return this.__is_soft_dropping;
	}

	get is_hard_dropping(): boolean {
		return this.__is_hard_dropping;
	}

	get soft_drop_gravity(): number {
		return this.__soft_drop_gravity;
	}

	get gravity(): number {
		return this.__gravity;
	}

	get block_size(): number {
		return this.__block_size;
	}

	get main_canvas(): HTMLCanvasElement {
		return this.__main_canvas;
	}

	get swapped_block_canvas(): HTMLCanvasElement {
		return this.__swapped_block_canvas;
	}

	get next_block_canvas(): HTMLCanvasElement {
		return this.__next_block_canvas;
	}

	get main_ctx(): CanvasRenderingContext2D {
		return this.__main_ctx;
	}

	get swapped_block_ctx(): CanvasRenderingContext2D {
		return this.__swapped_block_ctx;
	}

	get next_block_ctx(): CanvasRenderingContext2D {
		return this.__next_block_ctx;
	}

	get lock_delay(): number {
		return this.__lock_timer.delay;
	}

	get max_lock_resets(): number {
		return this.__max_lock_resets;
	}
}
