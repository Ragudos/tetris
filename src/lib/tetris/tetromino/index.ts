import {
	tetromino_colors,
	tetromino_default_rotations,
	type KickData,
	type TetrominoNames,
	tetromino_config,
} from "../../../config/tetromino";
import type { ROTATION_DIR } from "../../types";
import { modulo } from "../../utils/general-utils";
import { rotate_matrix } from "../../utils/matrix-utils";
import type { XY } from "../../xy";
import type UserSettings from "../user-settings";

export default class Tetromino {
	readonly name: TetrominoNames;
	/**
	 * Readonly as we dont want to change the reference and only
	 * rotate the tetromino by changing the positions of 1s and 0s.
	 */
	readonly shape: number[][];
	readonly color: string;
	/**
	 * Readonly as we dont want to change the reference and only
	 * set the new x and y when changing posisions.
	 */
	readonly position: XY;

	private __rotation: number;
	private __kick_data: UserSettings["kick"];

	constructor(
		name: TetrominoNames,
		kick_data: KickData,
		initial_position: XY,
		initial_rotation: number,
	) {
		this.name = name;
		this.__kick_data = kick_data;
		this.shape = tetromino_default_rotations[kick_data][name].map((row) =>
			row.slice(),
		);
		this.color = tetromino_colors[name];
		this.position = initial_position;
		this.__rotation = initial_rotation;
	}

	rotate(dir: ROTATION_DIR): void {
		rotate_matrix(dir, this.shape);

		const new_rotation = this.__rotation + dir;
		const abs_new_rotation = Math.abs(new_rotation);

		this.__rotation =
			modulo(abs_new_rotation, tetromino_config.max_rotations) * dir;
	}

	clone(): Tetromino {
		return new Tetromino(
			this.name,
			this.__kick_data,
			this.position.clone(),
			this.__rotation,
		);
	}

	clone_shape(): number[][] {
		return this.shape.map((row) => row.slice());
	}

	reset_rotation(): void {
		if (this.rotation === 0) {
			return;
		}

		if (this.rotation < 0) {
			const r = this.rotation;

			for (let i = r; i < 0; ++i) {
				this.rotate(1);
			}

			return;
		}

		if (this.rotation > 0) {
			const r = this.rotation;

			for (let i = r; i > 0; --i) {
				this.rotate(-1);
			}

			return;
		}
	}

	get rotation(): number {
		return this.__rotation;
	}

	get kick_data(): KickData {
		return this.__kick_data;
	}
}
