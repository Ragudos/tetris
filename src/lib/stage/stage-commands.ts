import type { Stage } from "./stage";
import type { ROTATION_DIR } from "../types";
import { double_loop, is_true_atleast_once, range } from "../utils/general-utils";
import type { TetrominoInterface } from "../tetromino/tetromino";
import tetrominoes from "../tetromino/tetrominoes";
import { rotate_matrix } from "../utils/matrix-utils";
import { XY } from "../xy";
import { srs_kick_data } from "../../config/tetromino";

interface StageCommandsInterface {
	rotate_block(dir: ROTATION_DIR): void;
	hard_drop(): void;
	move_block_down(): void;
	move_block_left(): void;
	move_block_right(): void;
	/**
	 * Shorthand for:
	 *
	 * ```ts
	 * if (
	 *   this.is_colliding_left() ||
	 *   this.is_colliding_right() ||
	 *   this.is_colliding_down()
	 * ) {
	 *  // Statement here...
	 * }
	 *
	 * // Instead do
	 *
	 * if (this.is_colliding()) {
	 *  // Statement here...
	 * }
	 * ```
	 *
	 * The benefit of this is that this only does one double loop.
	 *
	 * @param [offset_left=0] @default 0
	 * @param [offset_top=0] @default 0
	 * @param [offset_right=0] @default 0
	 * @param [offset_down=0] @default 0
	 * @param [custom_position] @default undefined
	 * @param [custom_shape] @default undefined
	 */
	is_colliding<T>(
		offset_left?: number,
		offset_top?: number,
		offset_right?: number,
		offset_down?: number,
		custom_position?: XY,
		custom_shape?: T[][]
	): boolean;
	/**
	 *
	 * @param [offset] @default 0
	 * @param [custom_position] @default undefined
	 * @param [custom_shape] @default undefined
	 * @returns
	 */
	is_colliding_left<T>(offset?: number, custom_position?: XY, custom_shape?: T[][]): boolean;
	/**
	 *
	 * @param offset @default 0
	 * @param [custom_position] @default undefined
	 * @param [custom_shape] @default undefined
	 * @returns
	 */
	is_colliding_right<T>(offset?: number, custom_position?: XY, custom_shape?: T[][]): boolean;
	/**
	 *
	 * @param offset @default 0
	 * @param [custom_position] @default undefined
	 * @param [custom_shape] @default undefined
	 * @returns
	 */
	is_colliding_up<T>(offset?: number, custom_position?: XY, custom_shape?: T[][]): boolean;
	/**
	 *
	 * @param offset @default 0
	 * @param [custom_position] @default undefined
	 * @param [custom_shape] @default undefined
	 * @returns
	 */
	is_colliding_down<T>(offset?: number, custom_position?: XY, custom_shape?: T[][]): boolean;
	clear_completed_row(): void;
	recalculate_ghost_y(): void;
}

export class StageCommands implements StageCommandsInterface {
	private readonly __stage: Stage;

	constructor(stage: Stage) {
		this.__stage = stage;
	}

	private  is_there_a_completed_row<T>(map: T[][]): boolean {
		return map.some((row) => row.every((item) => !item));
	}

	private kick_rotation<T>(tmp_shape: T[][], dir: ROTATION_DIR): void {
		const block = this.__stage.current_block;

		if (!block) {
			throw new Error("No block is currently active.");
		}
		
		const is_i_block = block.name === "I" || block.name === "i";
		const add_8 = is_i_block ? 8 : 0;

		// We dont use double_loop since we return early
		for (let y = 0; y < tmp_shape.length; ++y) {
			const row = tmp_shape[y];

			if (!row) {
				continue;
			}

			for (let x = 0; x < row.length; ++x) {
				if (row[x] === 0) {
					continue;
				}

				const abs_curr_rotation = Math.abs(block.rotation);

				let kick_idx: number;

				switch (dir) {
					case -1: {
						kick_idx = add_8 + (abs_curr_rotation % 4) + 4;
					};
					break;
					case 1: {
						kick_idx = add_8 + (abs_curr_rotation % 4);
					};
					break;
				}

				// We skip over 0th index since it's a normal rotation.
				// This function is called because we need to kick the tetromino,
				// so we do.
				// @ts-ignore
				for (let kick = 1; kick < srs_kick_data[0].length; ++kick) {
					// @ts-ignore
					const new_pos_x = block.position.x + srs_kick_data[kick_idx][kick][0];
					// Opposite integer value since we increase y in a Canvas when moving down.
					// @ts-ignore
					const new_pos_y = block.position.y + srs_kick_data[kick_idx][kick][1] * -1;
					const new_XY = new XY(new_pos_x, new_pos_y);

					if (this.is_colliding(0, 0, 0, 1, new_XY, tmp_shape)) {
						continue;
					}

					this.__stage.reset_lock_timer();
					block.change_position(new_pos_y, new_pos_x);
					block.rotate(dir);
					this.recalculate_ghost_y();

					break;
				}

				return;
			}
		}
	}

	public get_random_block(): TetrominoInterface {
		return this.__stage.blocks[
			range(0, tetrominoes.tetrominoes_with_sprite.length - 1)
		]!.clone();
	}

	public rotate_block(dir: ROTATION_DIR): void {
		const block = this.__stage.current_block;

		if (!block) {
			throw new Error("No block is currently active.");
		}

		if (this.is_colliding_down(1)) {
			if (
				this.__stage.lock_delay_restarts >= this.__stage.max_lock_resets
			) {
				return;
			}
		}

		if (block.name === "O" || block.name === "o") {
			return;
		}

		const tmp_shape = block.clone_shape();

		rotate_matrix(dir, tmp_shape);

		if (!this.is_colliding(0, 0, 0, 1, block.position, tmp_shape)) {
			this.__stage.reset_lock_timer();
			this.__stage.current_block.rotate(dir);
			this.recalculate_ghost_y();
			return;
		}

		this.kick_rotation(tmp_shape, dir);
	}

	public update_game_map(): void {
		const block = this.__stage.current_block;

		if (!block) {
			throw new Error("No block is currently active.");
		}

		double_loop(
			(y, x) => {
				// @ts-ignore
				if (block.shape[y][x] === 0) {
					return;
				}

				const pos_x = block.position.x + x;
				const pos_y = block.position.y + y;

				// @ts-ignore
				if (this.__stage.game_map[pos_y] && this.__stage.game_map[pos_y][pos_x] !== null) {
					this.__stage.game_over();
					return;
				} else {
					// @ts-ignore
					if (this.__stage.game_map[pos_y]) {
						// @ts-ignore
						this.__stage.game_map[pos_y][pos_x] = block;
					}
				}
			},
			//@ts-ignore
			block.shape[0].length,
			block.shape.length
		);
	}

	public hard_drop(): void {
		if (this.__stage.is_hard_dropping) {
			return;
		}	

		const block = this.__stage.current_block;

		if (!block) {
			throw new Error("No block is currently active.");
		}

		this.__stage.change_is_hard_dropping(true);

		while (!this.is_colliding_down(1)) {
			block.change_position(block.position.y + 1, block.position.x);
		}

		this.__stage.lock_block();
		this.__stage.change_is_hard_dropping(false);
	}

	public move_block_down(): void {
		const block = this.__stage.current_block;

		if (!block) {
			throw new Error("No block is currently active.");
		}

		if (this.is_colliding_down(1)) {
			if (this.__stage.is_hard_dropping) {
				this.__stage.lock_block();
			} else {
				this.__stage.start_lock_timer();
			}

			return;
		}

		block.change_position(block.position.y + 1, block.position.x);

		if (this.is_colliding_down(1)) {
			if (this.__stage.is_hard_dropping) {
				this.__stage.lock_block();
			} else {
				this.__stage.start_lock_timer();
			}
		}
	}

	public move_block_left(): void {
		const block = this.__stage.current_block;

		if (!block) {
			throw new Error("No block is currently active.");
		}

		if (this.is_colliding_left(1)) {
			return;
		}

		block.change_position(block.position.y, block.position.x - 1);
		this.__stage.reset_lock_timer();
		this.recalculate_ghost_y();
	}

	public move_block_right(): void {
		const block = this.__stage.current_block;

		if (!block) {
			throw new Error("No block is currently active.");
		}

		if (this.is_colliding_right(1)) {
			return;
		}

		block.change_position(block.position.y, block.position.x + 1);
		this.__stage.reset_lock_timer();
		this.recalculate_ghost_y();
	}

	public is_colliding<T>(
		offset_left: number = 0,
		offset_top: number = 0,
		offset_right: number = 0,
		offset_down: number = 0,
		custom_position?: XY,
		custom_shape?: T[][]
	): boolean {
		const block = this.__stage.current_block;

		if (!block) {
			throw new Error("No block is currently active.");
		}

		return is_true_atleast_once(
			(y, x) => {
				if (custom_shape) {
					// @ts-ignore
					if (custom_shape[y][x] === 0) {
						return undefined;
					}
				} else {
					// @ts-ignore
					if (block.shape[y][x] === 0) {
						return undefined;
					}
				}

				const curr_position = block.position;

				const real_x = (custom_position ? custom_position.x : curr_position.x) + x;
				const real_y = (custom_position ? custom_position.y : curr_position.y) + y;

				return (
					real_x - offset_left < 0 ||
					real_x + offset_right >= this.__stage.game_map[0]!.length ||
					real_y - offset_top < 0 ||
					real_y + offset_down >= this.__stage.game_map.length ||
					(this.__stage.game_map[real_y] &&
						// @ts-ignore
						this.__stage.game_map[real_y][real_x] !== null)
				);
			},
			custom_shape ? custom_shape.length : block.shape.length,
			// @ts-ignore
			custom_shape ? custom_shape[0].length : block.shape[0].length,
		);
	}

	public is_colliding_left<T>(offset: number = 0, custom_position?: XY, custom_shape?: T[][]): boolean {
		const block = this.__stage.current_block;

		if (!block) {
			throw new Error("No block is currently active.");
		}

		return is_true_atleast_once(
			(y, x) => {
				if (custom_shape) {
					// @ts-ignore
					if (custom_shape[y][x] === 0) {
						return undefined;
					}
				} else {
					// @ts-ignore
					if (block.shape[y][x] === 0) {
						return undefined;
					}
				}

				const curr_position = block.position;

				const real_x = (custom_position ? custom_position.x : curr_position.x) + x - offset;
				const real_y = (custom_position ? custom_position.y : curr_position.y) + y;

				return (
					// @ts-ignore
					real_x < 0 ||
					(this.__stage.game_map[real_y] &&
						// @ts-ignore
						this.__stage.game_map[real_y][real_x] !== null)
				);
			},
			block.shape.length,
			block.shape[0]!.length,
		);
	}

	public is_colliding_right<T>(offset: number = 0, custom_position?: XY, custom_shape?: T[][]): boolean {
		const block = this.__stage.current_block;

		if (!block) {
			throw new Error("No block is currently active.");
		}

		return is_true_atleast_once(
			(y, x) => {
				if (custom_shape) {
					// @ts-ignore
					if (custom_shape[y][x] === 0) {
						return undefined;
					}
				} else {
					// @ts-ignore
					if (block.shape[y][x] === 0) {
						return undefined;
					}
				}

				const curr_position = block.position;

				const real_x = (custom_position ? custom_position.x : curr_position.x) + x + offset;
				const real_y = (custom_position ? custom_position.y : curr_position.y) + y;

				return (
					real_x < 0 ||
					(this.__stage.game_map[real_y] &&
						// @ts-ignore
						this.__stage.game_map[real_y][real_x] !== null)
				);
			},
			block.shape.length,
			block.shape[0]!.length,
		);
	}

	public is_colliding_up<T>(offset: number = 0, custom_position?: XY, custom_shape?: T[][]): boolean {
		const block = this.__stage.current_block;

		if (!block) {
			throw new Error("No block is currently active.");
		}

		return is_true_atleast_once(
			(y, x) => {
				if (custom_shape) {
					// @ts-ignore
					if (custom_shape[y][x] === 0) {
						return undefined;
					}
				} else {
					// @ts-ignore
					if (block.shape[y][x] === 0) {
						return undefined;
					}
				}

				const curr_position = block.position;

				const real_x = (custom_position ? custom_position.x : curr_position.x) + x;
				const real_y = (custom_position ? custom_position.y : curr_position.y) + y - offset;

				return (
					real_y < 0 ||
					(this.__stage.game_map[real_y] &&
						// @ts-ignore
						this.__stage.game_map[real_y][real_x] !== null)
				);
			},
			block.shape.length,
			block.shape[0]!.length,
		);
	}

	public is_colliding_down<T>(offset: number = 0, custom_position?: XY, custom_shape?: T[][]): boolean {
		const block = this.__stage.current_block;

		if (!block) {
			throw new Error("No block is currently active.");
		}

		return is_true_atleast_once(
			(y, x) => {

				if (custom_shape) {
					// @ts-ignore
					if (custom_shape[y][x] === 0) {
						return undefined;
					}
				} else {
					// @ts-ignore
					if (block.shape[y][x] === 0) {
						return undefined;
					}
				}

				const curr_position = block.position;

				const real_x = (custom_position ? custom_position.x : curr_position.x) + x;
				const real_y = (custom_position ? custom_position.y : curr_position.y) + y + offset;

				return (
					real_y >= this.__stage.game_map.length ||
					(this.__stage.game_map[real_y] &&
						// @ts-ignore
						this.__stage.game_map[real_y][real_x] !== null)
				);
			},
			block.shape.length,
			block.shape[0]!.length,
		);
	}
	
	public clear_completed_row(): void {
		if (!this.is_there_a_completed_row(this.__stage.game_map)) {
			return;
		}

		for (let fy = 0; fy < this.__stage.game_map.length; ++fy) {
			const row = this.__stage.game_map[fy];

			if (
				row?.every((item) => item !== null) 
			) {
				for (let y = fy; y >= 0; --y)  {
					if (this.__stage.game_map[y]) {
						// @ts-ignore
						this.__stage.game_map[y] = this.__stage.game_map[y - 1];
					}
				}

				this.__stage.game_map[0] = new Array(this.__stage.square_count_x).fill(null);
			}
		}
	}

	public recalculate_ghost_y(): void {
		let y = 0;

		while (!this.is_colliding_down(1, new XY(this.__stage.current_block!.position.x, y))) {
			y += 1;
		}

		this.__stage.change_ghost_y(y);
	}
}
