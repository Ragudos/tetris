import type { GameCanvasBase } from "../canvas/canvas";

class AnimationEngine {
	private game_canvas: GameCanvasBase;

	constructor(game_canvas: GameCanvasBase) {
		this.game_canvas = game_canvas;
	}

	private draw_game_map(): void {}

	private draw_current_block(): void {}

	private draw_next_block(): void {}

	private draw_swapped_block(): void {}

	private draw_ghost(): void {}

	animate(): void {
		if (this.game_canvas.is_game_over) {
			return;
		}

		const main_ctx = this.game_canvas.main_canvas.ctx;
		const next_ctx = this.game_canvas.next_canvas.ctx;
		const swap_ctx = this.game_canvas.swap_canvas.ctx;

		main_ctx.clearRect(0, 0, main_ctx.canvas.width, main_ctx.canvas.height);

		this.draw_game_map();
		this.draw_current_block();
		this.draw_ghost();

		next_ctx.clearRect(0, 0, next_ctx.canvas.width, next_ctx.canvas.height);
		this.draw_next_block();

		swap_ctx.clearRect(0, 0, swap_ctx.canvas.width, swap_ctx.canvas.height);
		this.draw_swapped_block();
	}
}

export default AnimationEngine;
