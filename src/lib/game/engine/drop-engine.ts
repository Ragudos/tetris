import tetrisEvents from "../../events/tetris-events";
import { Timer } from "../../timer";
import { XY } from "../../xy";
import type { GameCanvasBase } from "../canvas/canvas";

class DropEngine {
	private game_canvas: GameCanvasBase;
	private lock_timer: Timer;
	private lock_delay_restarts: number;
	private max_lock_delay_restarts: number;

	constructor(game_canvas: GameCanvasBase) {
		this.game_canvas = game_canvas;

		this.lock_timer = new Timer(500);
		this.lock_timer.set_callback(this.lock_block.bind(this));
		this.lock_delay_restarts = 0;
		this.max_lock_delay_restarts = 15;
	}

	private update_game_map(): void {
		const current_block = this.game_canvas.main_canvas.block;

		if (!current_block) {
			return;
		}

		const position = current_block.position;
		const shape = current_block.shape;

		for (let y = 0; y < shape.length; y++) {
			for (let x = 0; x < shape[y]!.length; x++) {
				const block = shape[y]![x];

				if (block === 0) {
					continue;
				}

				const x_pos = position.x + x;
				const y_pos = position.y + y;

				if (
					this.game_canvas.game_map[y_pos] &&
					this.game_canvas.game_map[y_pos]![x_pos] !== null
				) {
					this.game_canvas.is_game_over = true;
					return;
				}

				this.game_canvas.game_map[y_pos]![x_pos] = current_block;
			}
		}
	}

	private clear_completed_row(): void {
		if (
			!this.game_canvas.game_map.some((row) =>
				row.every((block) => block !== null),
			)
		) {
			return;
		}

		for (let fy = 0; fy < this.game_canvas.game_map.length; ++fy) {
			const row = this.game_canvas.game_map[fy];

			if (!row) {
				continue;
			}

			if (row.every((block) => block !== null)) {
				for (let y = fy; y >= 0; --y) {
					const row_above = this.game_canvas.game_map[y - 1];

					if (!row_above) {
						continue;
					}

					this.game_canvas.game_map[y] = row_above;
				}

				this.game_canvas.game_map[0] = Array(
					this.game_canvas.collision_engine.square_count_x,
				).fill(null);
			}
		}
	}

	recalculate_ghost_y(): void {
		let y = 0;

		while (
			!this.game_canvas.collision_engine.is_colliding_down(
				1,
				new XY(this.game_canvas.main_canvas.block!.position.x, y),
			)
		) {
			y += 1;
		}

		this.game_canvas.ghost_y_pos = y - 1;
	}

	start_lock_timer(): void {
		if (this.lock_timer.is_running) {
			return;
		}

		this.lock_timer.start();
	}

	lock_block(): void {
		if (this.lock_timer.is_running) {
			this.lock_timer.stop();
			this.lock_timer.reset_delay();
		}

		this.update_game_map();
		this.clear_completed_row();
		this.game_canvas.get_new_block();

		this.lock_delay_restarts = 0;

		tetrisEvents.$emit("tetris:lock", {
			canvas_id: this.game_canvas.id,
		});
	}

	reset_lock_timer(): void {
		if (this.lock_delay_restarts >= this.max_lock_delay_restarts) {
			return;
		}

		this.lock_timer.stop();
		this.lock_timer.reset_delay();
		this.lock_delay_restarts += 1;
	}

	can_reset_timer(): boolean {
		return this.lock_delay_restarts < this.max_lock_delay_restarts;
	}

	is_lock_timer_running(): boolean {
		return this.lock_timer.is_running;
	}
}

export default DropEngine;
