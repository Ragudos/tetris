import tetrisEvents from "../../events/tetris-events";
import type { GameCanvasBase } from "../canvas/canvas";

class MovementEngine {
	private game_canvas: GameCanvasBase;
	private readonly initial_x_pull: number;

	should_move_left: boolean;
	should_move_right: boolean;

	x_pull: number;
	x_pull_limit: number;
	x_pull_multiplier: number;

	constructor(game_canvas: GameCanvasBase) {
		this.game_canvas = game_canvas;

		this.should_move_left = false;
		this.should_move_right = false;

		this.initial_x_pull = 100;

		this.x_pull = this.initial_x_pull;
		this.x_pull_limit = 20;
		this.x_pull_multiplier = 0.175;
	}

	private move_block(direction: -1 | 1) {
		const current_block = this.game_canvas.main_canvas.block;

		if (!current_block) {
			return;
		}

		if (this.game_canvas.drop_engine.is_lock_timer_running()) {
			this.game_canvas.drop_engine.reset_lock_timer();
		}

		current_block.position.x += direction;

		this.game_canvas.drop_engine.recalculate_ghost_y();

		tetrisEvents.$emit("tetris:move", {
			canvas_id: this.game_canvas.id,
			direction: current_block.position,
		});
	}

	private reset_x_pull() {
		this.x_pull = this.initial_x_pull;
	}

	move_left() {
		if (this.should_move_right && this.should_move_left) {
			this.reset_x_pull();
			this.should_move_right = false;
		}

		if (this.should_move_left) {
			if (
				this.game_canvas.time_engine.time_elapsed_since_last_move >=
				this.x_pull
			) {
				if (
					this.game_canvas.collision_engine.is_colliding_left(1) ||
					(!this.game_canvas.drop_engine.can_reset_timer() &&
						this.game_canvas.drop_engine.is_lock_timer_running())
				) {
					return;
				}

				this.game_canvas.movement_engine.move_block(-1);

				const new_x_pull =
					this.x_pull - this.x_pull_multiplier * this.x_pull;

				if (new_x_pull >= this.x_pull_limit) {
					this.x_pull = new_x_pull;
				}

				this.game_canvas.time_engine.time_elapsed_since_last_move = 0;
			}
		}
	}

	move_right() {
		if (this.should_move_left && this.should_move_right) {
			this.reset_x_pull();
			this.should_move_left = false;
		}

		if (this.should_move_right) {
			if (
				this.game_canvas.time_engine.time_elapsed_since_last_move >=
				this.x_pull
			) {
				if (
					this.game_canvas.collision_engine.is_colliding_right(1) ||
					(!this.game_canvas.drop_engine.can_reset_timer() &&
						this.game_canvas.drop_engine.is_lock_timer_running())
				) {
					return;
				}

				this.game_canvas.movement_engine.move_block(1);

				const new_x_pull =
					this.x_pull - this.x_pull_multiplier * this.x_pull;

				if (new_x_pull >= this.x_pull_limit) {
					this.x_pull = new_x_pull;
				}

				this.game_canvas.time_engine.time_elapsed_since_last_move = 0;
			}
		}
	}
}

export default MovementEngine;