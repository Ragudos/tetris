import type { GameCanvasBase } from "../canvas/canvas";

class AnimationEngine {
	private game_canvas: GameCanvasBase;

	constructor(game_canvas: GameCanvasBase) {
		this.game_canvas = game_canvas;
	}

	private draw_game_map(): void {
		const main_ctx = this.game_canvas.main_canvas.ctx;

		for (let y = 0; y < this.game_canvas.game_map.length; y++) {
			for (let x = 0; x < this.game_canvas.game_map[y]!.length; x++) {
				const block = this.game_canvas.game_map[y]![x];

				if (block === undefined || block === null) {
					continue;
				}

				if (block.is_with_color()) {
					main_ctx.fillStyle = block.color;
					main_ctx.fillRect(
						x * this.game_canvas.size,
						y * this.game_canvas.size,
						this.game_canvas.size,
						this.game_canvas.size,
					);
				}

				if (block.is_with_sprite()) {
					main_ctx.drawImage(
						block.sprite.image_source,
						block.sprite.position.x,
						block.sprite.position.y,
						block.sprite.size.x,
						block.sprite.size.y,
						x * this.game_canvas.size,
						y * this.game_canvas.size,
						this.game_canvas.size,
						this.game_canvas.size,
					);
				}
			}
		}
	}

	private draw_current_block(): void {
		const block = this.game_canvas.main_canvas.block;

		if (block === null) {
			return;
		}

		block.draw(this.game_canvas.main_canvas.ctx);
	}

	private draw_next_block(): void {
		const block = this.game_canvas.next_canvas.block;

		if (block === null) {
			return;
		}

		block.draw(this.game_canvas.next_canvas.ctx);
	}

	private draw_swapped_block(): void {
		const block = this.game_canvas.swap_canvas.block;

		if (block === null) {
			return;
		}

		block.draw(this.game_canvas.swap_canvas.ctx);
	}

	private draw_ghost(): void {
		if (this.game_canvas.drop_engine.is_lock_timer_running()) {
			return;
		}

		const block = this.game_canvas.main_canvas.block;

		if (block === null) {
			return;
		}

		this.game_canvas.main_canvas.ctx.fillStyle = "rgba(255, 255, 255, 0.2)";

		for (let y = 0; y < block.shape.length; y++) {
			for (let x = 0; x < block.shape[y]!.length; x++) {
				if (block.shape[y]![x] === 0) {
					continue;
				}

				this.game_canvas.main_canvas.ctx.fillRect(
					(block.position.x + x) * this.game_canvas.size,
					(this.game_canvas.ghost_y_pos + y) *
						this.game_canvas.size,
					this.game_canvas.size,
					this.game_canvas.size,
				);
			}
		}
	}

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
