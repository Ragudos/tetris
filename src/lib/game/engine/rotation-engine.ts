import type { ROTATION_DIR } from "../../types";

import { srs_kick_data } from "../../../config/tetromino";
import { XY } from "../../xy";
import { rotate_matrix } from "../../utils/matrix-utils";
import tetrisEvents from "../../events/tetris-events";
import type GameCanvas from "../canvas/canvas";

class RotationEngine {
	game_canvas: GameCanvas;

	constructor(game_canvas: GameCanvas) {
		this.game_canvas = game_canvas;
	}

	rotate(dir: ROTATION_DIR): void {
		if (
			this.game_canvas.drop_engine.can_reset_timer() === false &&
			this.game_canvas.drop_engine.is_lock_timer_running()
		) {
			return;
		}

		const block = this.game_canvas.current_block;

		if (!block) {
			return;
		}

		const tmp_shape = block.clone_shape();
		const add_8 = block.name === "I" ? 8 : 0;

		rotate_matrix(dir, tmp_shape);

		for (let y = 0; y < tmp_shape.length; ++y) {
			const row = tmp_shape[y];

			if (!row) {
				continue;
			}

			for (let x = 0; x < row.length; ++x) {
				if (row === undefined || row[x] === 0) {
					continue;
				}

				const abs_next_rotation = Math.abs(block.rotation + dir);

				let kick_idx: number;

				switch (dir) {
					case -1:
						{
							kick_idx = add_8 + (abs_next_rotation % 4) + 4;
						}
						break;
					case 1:
						{
							kick_idx = add_8 + (abs_next_rotation % 4);
						}
						break;
				}

				for (let kick = 0; kick < srs_kick_data[0]!.length; ++kick) {
					const kick_data = srs_kick_data[kick_idx]![kick]!;
					const new_pos_x = block.position.x + kick_data[0]!;
					const new_pos_y = block.position.y + kick_data[1]! * -1;

					const new_xy = new XY(new_pos_x, new_pos_y);

					if (
						this.game_canvas.collision_engine.is_colliding(
							0,
							0,
							0,
							1,
							new_xy,
							tmp_shape,
						)
					) {
						continue;
					}

					console.log("chosen data: ", kick_data);

					if (this.game_canvas.drop_engine.is_lock_timer_running()) {
						this.game_canvas.drop_engine.reset_lock_timer();
					}

					block.position.x = new_pos_x;
					block.position.y = new_pos_y;
					block.rotate(dir);
					this.game_canvas.drop_engine.recalculate_ghost_y();
					tetrisEvents.$emit("tetris:rotate", {
						canvas_id: this.game_canvas.id,
						direction: dir,
					});

					break;
				}

				return;
			}
		}
	}
}

export default RotationEngine;
