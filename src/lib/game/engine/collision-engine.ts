import type { XY } from "../../xy";
import type { GameCanvasBase } from "../canvas/canvas";

class CollisionEngine {
	private game_canvas: GameCanvasBase;

	square_count_x: number;
	square_count_y: number;

	constructor(
		square_count_x: number,
		square_count_y: number,
		game_canvas: GameCanvasBase,
	) {
		this.square_count_x = square_count_x;
		this.square_count_y = square_count_y;
		this.game_canvas = game_canvas;
	}

	is_colliding(
		offset_left: number = 0,
		offset_top: number = 0,
		offset_right: number = 0,
		offset_bottom: number = 0,
		custom_position?: XY,
		custom_shape?: number[][],
	): boolean {
		const current_block = this.game_canvas.main_canvas.block;

		if (!current_block) {
			return false;
		}

		const position = custom_position ||  current_block.position;
		const shape = custom_shape || current_block.shape;

		for (let y = 0; y < shape.length; y++) {
			for (let x = 0; x < shape[y]!.length; x++) {
				const block = shape[y]![x];

				if (block === 0) {
					continue;
				}

				const x_pos = position.x + x;
				const y_pos = position.y + y;

				if (x_pos - offset_left < 0 ||
					x_pos + offset_right >= this.square_count_x ||
					y_pos + offset_bottom >= this.square_count_y ||
					y_pos - offset_top < 0 ||
					(this.game_canvas.game_map[y_pos] &&
						this.game_canvas.game_map[y_pos]![x_pos] !== null)) {
					return true;
				}
			}
		}

		return false;
	}

	is_colliding_left(
		offset: number = 0,
		custom_position?: XY,
		custom_shape?: number[][],
	): boolean {
		const current_block = this.game_canvas.main_canvas.block;

		if (!current_block) {
			return false;
		}

		const position = custom_position ?? current_block.position;
		const shape = custom_shape ?? current_block.shape;

		for (let y = 0; y < shape.length; y++) {
			for (let x = 0; x < shape[y]!.length; x++) {
				const block = shape[y]![x];

				if (block === 0) {
					continue;
				}

				const x_pos = position.x + x - offset;

				if (x_pos < 0) {
					return true;
				}

				if (
					this.game_canvas.game_map[y + position.y] &&
					this.game_canvas.game_map[y + position.y]![x_pos] !== null
				) {
					return true;
				}
			}
		}

		return false;
	}

	is_colliding_right(
		offset: number = 0,
		custom_position?: XY,
		custom_shape?: number[][],
	): boolean {
		const current_block = this.game_canvas.main_canvas.block;

		if (!current_block) {
			return false;
		}

		const position = custom_position ?? current_block.position;
		const shape = custom_shape ?? current_block.shape;

		for (let y = 0; y < shape.length; y++) {
			for (let x = 0; x < shape[y]!.length; x++) {
				const block = shape[y]![x];

				if (block === 0) {
					continue;
				}

				const x_pos = position.x + x + offset;

				if (x_pos >= this.square_count_x) {
					return true;
				}

				if (
					this.game_canvas.game_map[y + position.y] &&
					this.game_canvas.game_map[y + position.y]![x_pos] !== null
				) {
					return true;
				}
			}
		}

		return false;
	}

	is_colliding_down(
		offset: number = 0,
		custom_position?: XY,
		custom_shape?: number[][],
	): boolean {
		const current_block = this.game_canvas.main_canvas.block;

		if (!current_block) {
			return false;
		}

		const position = custom_position ?? current_block.position;
		const shape = custom_shape ?? current_block.shape;

		for (let y = 0; y < shape.length; y++) {
			for (let x = 0; x < shape[y]!.length; x++) {
				const block = shape[y]![x];

				if (block === 0) {
					continue;
				}

				const y_pos = position.y + y + offset;

				if (y_pos >= this.square_count_y) {
					return true;
				}

				if (
					this.game_canvas.game_map[y_pos] &&
					this.game_canvas.game_map[y_pos]![x + position.x] !== null
				) {
					return true;
				}
			}
		}

		return false;
	}

	is_colliding_up(
		offset: number = 0,
		custom_position?: XY,
		custom_shape?: number[][],
	): boolean {
		const current_block = this.game_canvas.main_canvas.block;

		if (!current_block) {
			return false;
		}

		const position = custom_position ?? current_block.position;
		const shape = custom_shape ?? current_block.shape;

		for (let y = 0; y < shape.length; y++) {
			for (let x = 0; x < shape[y]!.length; x++) {
				const block = shape[y]![x];

				if (block === 0) {
					continue;
				}

				const y_pos = position.y + y - offset;

				if (y_pos < 0) {
					return true;
				}

				if (
					this.game_canvas.game_map[y_pos] &&
					this.game_canvas.game_map[y_pos]![x + position.x] !== null
				) {
					return true;
				}
			}
		}

		return false;
	}
}

export default CollisionEngine;
