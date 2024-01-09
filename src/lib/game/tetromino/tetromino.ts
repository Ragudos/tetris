import type { ROTATION_DIR } from "../../types";

import { tetromino_config } from "../../../config/tetromino";
import { ImageInfo } from "../../image-info";
import { modulo, multiply_and_add_products } from "../../utils/general-utils";
import { rotate_matrix } from "../../utils/matrix-utils";
import { XY } from "../../xy";

type TetrominoNames = "I" | "J" | "L" | "O" | "S" | "T" | "Z";
type Rotations = -1 | -2 | -3 | 0 | 1 | 2 | 3;

interface TetrominoInterface {
	name: TetrominoNames;
	size: number;
	rotation: Rotations;
	position: XY;
	shape: number[][];
	clone_shape(): number[][];
	clone_position(): XY;
	rotate(dir: ROTATION_DIR): ThisType<Tetromino>;
	draw(context: CanvasRenderingContext2D): ThisType<Tetromino>;
	is_with_color(): this is TetrominoWithColorInterface;
	is_with_sprite(): this is TetrominoWithSpriteInterface;
}

interface TetrominoWithColorInterface extends Tetromino {
	clone(): TetrominoWithColor;
	color: string;
}

interface TetrominoWithSpriteInterface extends Tetromino {
	clone(): TetrominoWithSprite;
	sprite: ImageInfo;
	clone_sprite(): ImageInfo;
}

class Tetromino implements TetrominoInterface {
	name: TetrominoNames;
	size: number;
	rotation: Rotations;
	position: XY;
	shape: number[][];

	constructor(
		name: TetrominoNames,
		shape: number[][],
		position: XY,
		size: number,
		initial_rotation: Rotations,
	) {
		this.name = name;
		this.shape = shape;
		this.position = position;
		this.size = size;
		this.rotation = initial_rotation;
	}

	rotate(dir: ROTATION_DIR): ThisType<Tetromino> {
		rotate_matrix(dir, this.shape);

		const new_rotation = this.rotation + dir;
		const abs_value = Math.abs(new_rotation);

		this.rotation = (modulo(abs_value, tetromino_config.max_rotations) *
			dir) as typeof this.rotation;

		return this;
	}

	clone_shape(): number[][] {
		return this.shape.map((row) => row.slice());
	}

	clone_position(): XY {
		return this.position.clone();
	}

	draw(context: CanvasRenderingContext2D): ThisType<Tetromino> {
		if (this.is_with_color()) {
			context.fillStyle = this.color;

			for (let y = 0; y < this.shape.length; ++y) {
				const row = this.shape[y];

				if (!row) {
					continue;
				}

				for (let x = 0; x < row.length; ++x) {
					const item = row[x];

					if (!item || item === 0) {
						continue;
					}

					context.fillRect(
						multiply_and_add_products(
							this.size,
							this.position.x,
							x,
						),
						multiply_and_add_products(
							this.size,
							this.position.y,
							y,
						),
						this.size,
						this.size,
					);
				}
			}
		} else if (this.is_with_sprite()) {
			for (let y = 0; y < this.shape.length; ++y) {
				const row = this.shape[y];

				if (!row) {
					continue;
				}

				for (let x = 0; x < row.length; ++x) {
					const item = row[x];

					if (!item || item === 0) {
						continue;
					}

					context.drawImage(
						this.sprite.image_source,
						this.sprite.position.x,
						this.sprite.position.y,
						this.sprite.size.x,
						this.sprite.size.y,
						multiply_and_add_products(
							this.size,
							this.position.x,
							x,
						),
						multiply_and_add_products(
							this.size,
							this.position.y,
							y,
						),
						this.size,
						this.size,
					);
				}
			}
		}

		return this;
	}

	is_with_color(): this is TetrominoWithColorInterface {
		return "color" in this;
	}

	is_with_sprite(): this is TetrominoWithSpriteInterface {
		return "sprite" in this;
	}
}

class TetrominoWithColor extends Tetromino {
	color: string;

	constructor(
		name: TetrominoNames,
		shape: number[][],
		position: XY,
		size: number,
		initial_rotation: Rotations,
		color: string,
	) {
		super(name, shape, position, size, initial_rotation);
		this.color = color;
	}

	clone(): TetrominoWithColor {
		const copied_position = this.clone_position();
		const copied_shape = this.clone_shape();

		return new TetrominoWithColor(
			this.name,
			copied_shape,
			copied_position,
			this.size,
			this.rotation,
			this.color,
		);
	}
}

class TetrominoWithSprite extends Tetromino {
	sprite: ImageInfo;

	constructor(
		name: TetrominoNames,
		shape: number[][],
		position: XY,
		size: number,
		initial_rotation: Rotations,
		sprite: ImageInfo,
	) {
		super(name, shape, position, size, initial_rotation);
		this.sprite = sprite;
	}

	clone(): TetrominoWithSprite {
		const copied_position = this.clone_position();
		const copied_shape = this.clone_shape();
		const copied_sprite = this.clone_sprite();

		return new TetrominoWithSprite(
			this.name,
			copied_shape,
			copied_position,
			this.size,
			this.rotation,
			copied_sprite,
		);
	}

	clone_sprite(): ImageInfo {
		return new ImageInfo(
			this.sprite.image_source,
			this.sprite.position.clone(),
			this.sprite.size.clone(),
		);
	}
}

export {
	type TetrominoNames,
	Tetromino,
	TetrominoWithColor,
	TetrominoWithSprite,
};
