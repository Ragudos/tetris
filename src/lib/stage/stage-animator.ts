import type { Stage } from "./stage";
import { double_loop } from "../utils/general-utils";

class StageAnimator {
	private readonly __stage: Stage;

	constructor(stage: Stage) {
		this.__stage = stage;
	}

	private draw_main_canvas(): void {
		const c = this.__stage.main_ctx;
		const white_line_thickness = 1;

		c.fillStyle = "#f5f5f5";

		for (let y = 0; y < this.__stage.game_map.length; ++y) {
			c.fillRect(
				0,
				this.__stage.block_size * y - white_line_thickness,
				c.canvas.width,
				white_line_thickness,
			);
		}

		for (let x = 0; x < this.__stage.game_map[0]!.length; ++x) {
			c.fillRect(
				this.__stage.block_size * x - white_line_thickness,
				0,
				white_line_thickness,
				c.canvas.height,
			);
		}
	}

	private draw_swapped_block(): void {
		const c = this.__stage.swapped_block_ctx;
		const swapped_block = this.__stage.swapped_block;

		if (!swapped_block) {
			return;
		}

		swapped_block.draw(c, { should_loop: true });
	}

	private draw_current_block(): void {
		const c = this.__stage.main_ctx;
		const current_block = this.__stage.current_block;

		if (!current_block) {
			return;
		}

		current_block.draw(c, { should_loop: true });
	}

	private draw_next_block(): void {
		const c = this.__stage.next_block_ctx;
		const next_block = this.__stage.next_block;

		if (!next_block) {
			return;
		}

		next_block.draw(c, { should_loop: true });
	}

	private draw_game_map(): void {
		const c = this.__stage.main_ctx;
		const game_map = this.__stage.game_map;

		double_loop(
			(y, x) => {
				// @ts-expect-error game_map[y][x] gives possibly undefined
				if (game_map[y][x] === null) {
					return;
				}

				// @ts-expect-error
				const block = game_map[y][x];

				if (!block) {
					return;
				}

				block.draw(c, {
					should_loop: false,
					custom_x: x * this.__stage.block_size,
					custom_y: y * this.__stage.block_size,
				});
			},
			game_map[0]!.length,
			game_map.length,
		);
	}

	private draw_ghost(): void {
		const block = this.__stage.current_block;

		if (!block) {
			throw new Error("No current block");
		}

		if (this.__stage.lock_timer.is_running) {
			return;
		}

		if (this.__stage.commands.is_colliding_down(1)) {
			return;
		}

		this.__stage.main_ctx.fillStyle = "hsl(0 0% 50% / 0.75)";

		for (let y = 0; y < block.shape.length; ++y) {
			const row = block.shape[y]!;

			for (let x = 0; x < row.length; ++x) {
				// @ts-ignore
				if (block.shape[y][x] === 0) {
					continue;
				}

				this.__stage.main_ctx.fillRect(
					(block.position.x + x) * this.__stage.block_size,
					(this.__stage.ghost_y + y) * this.__stage.block_size,
					this.__stage.block_size,
					this.__stage.block_size,
				);
			}
		}
	}

	public animate(): void {
		if (this.__stage.is_game_over) {
			return;
		}

		const c = this.__stage.main_ctx;
		const sc = this.__stage.swapped_block_ctx;
		const nbc = this.__stage.next_block_ctx;

		c.clearRect(0, 0, c.canvas.width, c.canvas.height);
		sc.clearRect(0, 0, sc.canvas.width, sc.canvas.height);
		nbc.clearRect(0, 0, nbc.canvas.width, nbc.canvas.height);

		this.draw_main_canvas();
		this.draw_game_map();
		this.draw_ghost();
		this.draw_swapped_block();
		this.draw_current_block();
		this.draw_next_block();
	}
}

export default StageAnimator;
