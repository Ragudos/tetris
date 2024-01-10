import tetrisEvents from "../../events/tetris-events";
import { Timer } from "../../timer";
import { XY } from "../../xy";
import type { GameCanvasBase } from "../canvas/canvas";

class DropEngine {
	private game_canvas: GameCanvasBase;
	private lock_timer: Timer;
	private lock_delay_restarts: number;
	private max_lock_delay_restarts: number;

	gravity: number;
	soft_drop_gravity: number;
	is_hard_dropping: boolean;
	is_soft_dropping: boolean;

	constructor(game_canvas: GameCanvasBase) {
		this.game_canvas = game_canvas;

		this.lock_timer = new Timer(500);
		this.lock_timer.set_callback(this.lock_block.bind(this));
		this.lock_delay_restarts = 0;
		this.max_lock_delay_restarts = 15;

		this.is_hard_dropping = false;
		this.is_soft_dropping = false;
		this.gravity = 1000;
		this.soft_drop_gravity = 50;
	}

	hard_drop(): void {
		if (this.is_hard_dropping) {
			return;
		}

		const block = this.game_canvas.main_canvas.block;

		if (!block) {
			return;
		}

		this.is_hard_dropping = true;

		const pos = block.clone_position();

		while (!this.game_canvas.collision_engine.is_colliding_down(1, pos)) {
			pos.y += 1;
		}

		tetrisEvents.$emit("tetris:drop", {
			canvas_id: this.game_canvas.id,
			type: "hard",
		});
		block.position.y = pos.y;
		this.lock_block();
		this.is_hard_dropping = false;
	}

	soft_drop(): void {
		if (this.is_hard_dropping) {
			return;
		}

		this.is_soft_dropping = true;
	}

	stop_soft_drop(): void {
		this.is_soft_dropping = false;
	}

	recalculate_ghost_y(): void {
		let y = this.game_canvas.main_canvas.block!.position.y;

		while (
			!this.game_canvas.collision_engine.is_colliding_down(
				1,
				new XY(this.game_canvas.main_canvas.block!.position.x, y),
			)
		) {
			y += 1;
		}

		this.game_canvas.ghost_y_pos = y;
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

		this.game_canvas.stack_engine.update_game_map();
		this.game_canvas.stack_engine.clear_completed_row();
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
