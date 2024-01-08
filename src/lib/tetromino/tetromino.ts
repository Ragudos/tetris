import type { ROTATION_DIR } from "../types";

import { is_square_matrix, rotate_matrix } from "../utils/matrix-utils";

import {
	double_loop,
	multiply_and_add_products,
	modulo,
} from "../utils/general-utils";

import { tetromino_config } from "../../config/tetromino";
import { ImageInfo } from "../image-info";
import { XY } from "../xy";

interface BaseDrawOptions {
	should_loop: boolean;
	custom_x?: number;
	custom_y?: number;
}

interface DrawOptionsWithLoop extends BaseDrawOptions {
	should_loop: true;
}

interface DrawOptionsWithoutLoop extends BaseDrawOptions {
	should_loop: false;
	custom_x: number;
	custom_y: number;
}

type DrawOptions = DrawOptionsWithLoop | DrawOptionsWithoutLoop;

export interface TetrominoInterface {
	name: string;
	rotation: number;
	position: XY;
	shape: number[][];
	size: number;
	color: string;
	draw(
		context: CanvasRenderingContext2D,
		options: DrawOptions,
	): ThisParameterType<TetrominoInterface>;
	rotate(dir: ROTATION_DIR): ThisParameterType<TetrominoInterface>;
	clone(): TetrominoInterface;
	clone_shape(): number[][];
	clone_position(): XY;
	change_position(
		y: number,
		x: number,
	): ThisParameterType<TetrominoInterface>;
	change_size(size: number): ThisParameterType<TetrominoInterface>;
}

const max_rotations = tetromino_config.max_rotations;

/**
 * @class Tetromino
 * @implements TetrominoInterface
 * @description Can throw an error at construction if one of the criterias are not met:
 *
 * - shape is not a square
 * - size is less than or equal to 0
 * - initial_rotation is not between 0 and max_rotations (4)
 */
abstract class Tetromino implements TetrominoInterface {
	private __name: string;
	private __current_rotation: number;
	private __current_position: XY;
	private __current_shape: number[][];
	private __color: string;
	private __size: number;

	constructor(
		name: string,
		color: string,
		initial_rotation: number,
		initial_position: XY,
		initial_shape: number[][],
		initial_size: number,
	) {
		if (initial_rotation < 0 || initial_rotation > max_rotations) {
			throw this.throw_error(
				`initial_rotation must be between 0 and ${max_rotations}`,
			);
		}

		if (!is_square_matrix(initial_shape)) {
			throw this.throw_error("initial_shape must be a square matrix");
		}

		if (initial_size <= 0) {
			throw this.throw_error("initial_size must be greater than 0");
		}

		this.__name = name;
		this.__color = color;
		this.__current_rotation = initial_rotation;
		this.__current_position = initial_position;
		this.__current_shape = initial_shape;
		this.__size = initial_size;
	}

	private throw_error(err: string) {
		throw new Error(`Tetromino: ${err}`);
	}

	/**
	 *
	 * @param context
	 * @param options If should_loop is false, custom_x and custom_y must be provided.
	 * @returns The tetromino instance.
	 * @throws Error thrown by {@link double_loop} and if should_loop is true
	 */
	public abstract draw(
		context: CanvasRenderingContext2D,
		options: DrawOptions,
	): ThisParameterType<TetrominoInterface>;

	/**
	 * Clones the tetromino.
	 * @returns The tetromino instance.
	 */
	public abstract clone(): TetrominoInterface;

	/**
	 * Rotates the tetromino.
	 * @param dir Direction to rotate the tetromino.
	 * @returns The tetromino instance.
	 * @throws Error thrown by {@link rotate_matrix}
	 */
	public rotate(dir: ROTATION_DIR): ThisParameterType<TetrominoInterface> {
		rotate_matrix(dir, this.__current_shape);

		const new_rotation = this.__current_rotation + dir;
		const abs_value = Math.abs(new_rotation);

		if (abs_value > max_rotations) {
			this.__current_rotation = 0;
			return this;
		}

		this.__current_rotation = modulo(abs_value, max_rotations) * dir;

		return this;
	}

	/**
	 * Clones the shape of the tetromino.
	 * @returns The shape of the tetromino.
	 */
	public clone_shape(): number[][] {
		return this.__current_shape.map((row) => row.slice());
	}

	/**
	 * Clones the position of the tetromino.
	 * @returns The position of the tetromino.
	 */
	public clone_position(): XY {
		return new XY(this.__current_position.x, this.__current_position.y);
	}

	/**
	 * Changes the position of the tetromino.
	 * @param y New y position.
	 * @param x New x position.
	 * @returns The tetromino instance.
	 */
	public change_position(
		y: number,
		x: number,
	): ThisParameterType<TetrominoInterface> {
		this.__current_position.x = x;
		this.__current_position.y = y;

		return this;
	}

	/**
	 * Changes the size of the tetromino.
	 * @param size New size.
	 * @returns The tetromino instance.
	 */
	public change_size(size: number): ThisParameterType<TetrominoInterface> {
		this.__size = size;

		return this;
	}

	get name(): string {
		return this.__name;
	}

	/**
	 * Current rotation of the tetromino.
	 * 0 means the default state of the tetromino.
	 * @default 0
	 */
	get rotation(): number {
		return this.__current_rotation;
	}

	/**
	 * Current position of the tetromino in x and y.
	 */
	get position(): XY {
		return this.__current_position;
	}

	/**
	 * Current shape of the tetromino.
	 * For example, an "O" tetromino would be:
	 *
	 * ```ts
	 * const O = [
	 *  [1, 1],
	 *  [1, 1]
	 * ];
	 * ```
	 */
	get shape(): number[][] {
		return this.__current_shape;
	}

	/**
	 * Current size of the tetromino.
	 * We don't need its x and y since it's a square.
	 */
	get size(): number {
		return this.__size;
	}

	get color(): string {
		return this.__color;
	}
}

class TetrominoWithoutSprite extends Tetromino {
	constructor(
		name: string,
		color: string,
		initial_rotation: number,
		initial_position: XY,
		initial_shape: number[][],
		initial_size: number,
	) {
		super(
			name,
			color,
			initial_rotation,
			initial_position,
			initial_shape,
			initial_size,
		);
	}

	public override draw(
		context: CanvasRenderingContext2D,
		options: DrawOptions,
	): ThisParameterType<TetrominoInterface> {
		const should_loop = options.should_loop;

		const s = this.shape;
		const p = this.position;
		const size = this.size;

		if (!should_loop) {
			context.fillStyle = this.color;
			context.fillRect(options.custom_x, options.custom_y, size, size);
		} else {
			double_loop(
				(y, x) => {
					// @ts-expect-error s[y][x] gives an error of undefined
					if (!s[y] || s[y][x] === 0) {
						return;
					}

					context.fillStyle = this.color;
					context.fillRect(
						multiply_and_add_products(size, p.x, x),
						multiply_and_add_products(size, p.y, y),
						size,
						size,
					);
				},
				s.length,
				s.length,
			);
		}

		return this;
	}

	public override clone(): TetrominoInterface {
		const copied_position = this.clone_position();
		const copied_shape = this.clone_shape();

		return new TetrominoWithoutSprite(
			this.name,
			this.color,
			this.rotation,
			copied_position,
			copied_shape,
			this.size,
		);
	}
}

class TetrominoWithSprite extends Tetromino {
	private __image_info: ImageInfo;

	constructor(
		name: string,
		color: string,
		initial_rotation: number,
		initial_position: XY,
		initial_shape: number[][],
		initial_size: number,
		initial_image_info: ImageInfo,
	) {
		super(
			name,
			color,
			initial_rotation,
			initial_position,
			initial_shape,
			initial_size,
		);
		this.__image_info = initial_image_info;
	}

	public override draw(
		context: CanvasRenderingContext2D,
		options: DrawOptions,
	): ThisParameterType<TetrominoInterface> {
		const should_loop = options.should_loop;
		const s = this.shape;
		const p = this.position;
		const i = this.__image_info;
		const size = this.size;

		if (!should_loop) {
			context.drawImage(
				i.image_source,
				i.position.x,
				i.position.y,
				i.size.x,
				i.size.y,
				options.custom_x,
				options.custom_y,
				size,
				size,
			);
		} else {
			double_loop(
				(y, x) => {
					// @ts-expect-error s[y][x] gives an error of undefined
					if (!s[y] || s[y][x] === 0) {
						return;
					}

					context.drawImage(
						i.image_source,
						i.position.x,
						i.position.y,
						i.size.x,
						i.size.y,
						multiply_and_add_products(size, p.x, x),
						multiply_and_add_products(size, p.y, y),
						size,
						size,
					);
				},
				s.length,
				s.length,
			);
		}

		return this;
	}

	public override clone(): TetrominoInterface {
		const copied_position = this.clone_position();
		const copied_shape = this.clone_shape();
		const img = this.__image_info;

		return new TetrominoWithSprite(
			this.name,
			this.color,
			this.rotation,
			copied_position,
			copied_shape,
			this.size,
			new ImageInfo(
				img.image_source,
				new XY(img.size.x, img.size.y),
				new XY(img.position.x, img.position.y),
			),
		);
	}

	get image_info() {
		return this.__image_info;
	}
}

export { TetrominoWithoutSprite, TetrominoWithSprite };
