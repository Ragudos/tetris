import tetrisEvents from "../../events/tetris-events";
import type GameCanvas from "../canvas/canvas";

class StackEngine {
	private game_canvas: GameCanvas;

	constructor(game_canvas: GameCanvas) {
		this.game_canvas = game_canvas;
	}

	clear_completed_row(): void {
		if (
			!this.game_canvas.game_map.some((row) =>
				row.every((block) => block !== null),
			)
		) {
			return;
		}

		let lines = 0;

		for (let fy = 0; fy < this.game_canvas.game_map.length; ++fy) {
			const row = this.game_canvas.game_map[fy];

			if (!row) {
				continue;
			}

			if (row.every((block) => block !== null)) {
				for (let y = fy; y >= 0; --y) {
					if (this.game_canvas.game_map[y]) {
						this.game_canvas.game_map[y] =
							this.game_canvas.game_map[y - 1]!;
					}
				}

				this.game_canvas.game_map[0] = Array(
					this.game_canvas.collision_engine.square_count_x,
				).fill(null);

				lines += 1;
			}
		}

		tetrisEvents.$emit("tetris:clear", {
			canvas_id: this.game_canvas.id,
			lines,
		});
	}

	update_game_map(): void {
		const current_block = this.game_canvas.current_block;

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
}

export default StackEngine;
