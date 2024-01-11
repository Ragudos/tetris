import type GameCanvas from "../canvas/canvas";
import type Tetromino from "../tetromino/tetromino";

class AnimationEngine {
	private game_canvas: GameCanvas;
	
	constructor(game_canvas: GameCanvas) {
		this.game_canvas = game_canvas;
	}

	draw_game_map(game_map: (null | Tetromino)[][], context: CanvasRenderingContext2D): void {
		for (let y = 0; y < game_map.length; y++) {
			for (let x = 0; x < game_map[y]!.length; x++) {
				const block = game_map[y]![x];

				if (block === undefined || block === null) {
					continue;
				}

				if (!block.sprite.did_image_load) {
					context.fillStyle = block.color;
					context.fillRect(
						x * this.game_canvas.size,
						y * this.game_canvas.size,
						this.game_canvas.size,
						this.game_canvas.size,
					);
				} else {
					context.drawImage(
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
		const block = this.game_canvas.current_block;

		if (block === null) {
			return;
		}

		block.draw(this.game_canvas.ctx);
	}

	private draw_ghost(): void {
		if (this.game_canvas.drop_engine.is_lock_timer_running()) {
			return;
		}

		const block = this.game_canvas.current_block;

		if (block === null) {
			return;
		}

		
		if (block.sprite.did_image_load) {
			for (let y = 0; y < block.shape.length; y++) {
				for (let x = 0; x < block.shape[y]!.length; x++) {
					if (block.shape[y]![x] === 0) {
						continue;
					}

					this.game_canvas.ctx.drawImage(
						block.sprite.image_source,
						this.game_canvas.ghost_sprite_position.x,
						this.game_canvas.ghost_sprite_position.y,
						block.sprite.size.x,
						block.sprite.size.y,
						(block.position.x + x) * this.game_canvas.size,
						(this.game_canvas.ghost_y_pos + y) * this.game_canvas.size,
						this.game_canvas.size,
						this.game_canvas.size,
					);
				}
			}
		} else {
			this.game_canvas.ctx.fillStyle = "rgba(255, 255, 255, 0.2)";

			for (let y = 0; y < block.shape.length; y++) {
				for (let x = 0; x < block.shape[y]!.length; x++) {
					if (block.shape[y]![x] === 0) {
						continue;
					}

					this.game_canvas.ctx.fillRect(
						(block.position.x + x) * this.game_canvas.size,
						(this.game_canvas.ghost_y_pos + y) * this.game_canvas.size,
						this.game_canvas.size,
						this.game_canvas.size,
					);
				}
			}
		}
	}

	animate(): void {
		if (this.game_canvas.is_game_over) {
			return;
		}

		const main_ctx = this.game_canvas.ctx;

		main_ctx.clearRect(0, 0, main_ctx.canvas.width, main_ctx.canvas.height);

		this.draw_game_map(this.game_canvas.game_map, this.game_canvas.ctx);
		this.draw_ghost();
		this.draw_current_block();
	}
}

export default AnimationEngine;
