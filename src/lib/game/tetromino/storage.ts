import { tetromino_config, tetromino_default_rotations } from "../../../config/tetromino";
import { ImageInfo } from "../../image-info";
import { XY } from "../../xy";
import { get_sprite_position, sprite_size, type Sprites } from "./sprite";
import Tetromino, { type TetrominoRotations } from "./tetromino";

class TetrominoStorage {
	private static __instance: TetrominoStorage;
	private constructor() {}

	private __tetrominoes: undefined | Tetromino[];
	private __default_rotation: TetrominoRotations = 0;
	private __sprite_type: Sprites = "block_like";

	static get_instance(): TetrominoStorage {
		if (!TetrominoStorage.__instance) {
			TetrominoStorage.__instance = new TetrominoStorage();
		}

		return TetrominoStorage.__instance;
	}

	change_sprite_type(new_type: Sprites): void {
		if (new_type === this.__sprite_type) {
			return;
		}

		this.__sprite_type = new_type;
		this.__reset_sprites();
	}

	private __reset_sprites(): void {
		if (!this.__tetrominoes) {
			this.__generate_tetrominoes();
			return;
		}

		for (let idx = 0; idx < this.__tetrominoes.length; ++idx) {
			const tetromino = this.__tetrominoes[idx]!;
			const new_position = get_sprite_position(tetromino.name, this.__sprite_type);

			tetromino.sprite.change_position(new_position.x, new_position.y);
		}
	}

	private __generate_tetrominoes(): void {
		const image = document.getElementById(tetromino_config.spritesheet_id) as HTMLImageElement;

		if (!image || !(image instanceof HTMLImageElement)) {
			throw new Error("Couldn't find the tetromino spritesheet.");
		}

		this.__tetrominoes = [
			new Tetromino(
				"O",
				tetromino_default_rotations.srs.O,
				new XY(0, 0),
				tetromino_config.size,
				this.__default_rotation,
				"yellow",
				new ImageInfo(
					image,
					new XY(sprite_size, sprite_size),
					get_sprite_position("O", this.__sprite_type)
				)
			),
			new Tetromino(
				"I",
				tetromino_default_rotations.srs.I,
				new XY(0, 0),
				tetromino_config.size,
				this.__default_rotation,
				"cyan",
				new ImageInfo(
					image,
					new XY(sprite_size, sprite_size),
					get_sprite_position("I", this.__sprite_type)
				)
			),
			new Tetromino(
				"S",
				tetromino_default_rotations.srs.S,
				new XY(0, 0),
				tetromino_config.size,
				this.__default_rotation,
				"green",
				new ImageInfo(
					image,
					new XY(sprite_size, sprite_size),
					get_sprite_position("S", this.__sprite_type)
				)
			),
			new Tetromino(
				"Z",
				tetromino_default_rotations.srs.Z,
				new XY(0, 0),
				tetromino_config.size,
				this.__default_rotation,
				"red",
				new ImageInfo(
					image,
					new XY(sprite_size, sprite_size),
					get_sprite_position("Z", this.__sprite_type)
				)
			),
			new Tetromino(
				"L",
				tetromino_default_rotations.srs.L,
				new XY(0, 0),
				tetromino_config.size,
				this.__default_rotation,
				"blue",
				new ImageInfo(
					image,
					new XY(sprite_size, sprite_size),
					get_sprite_position("L", this.__sprite_type)
				)
			),
			new Tetromino(
				"J",
				tetromino_default_rotations.srs.J,
				new XY(0, 0),
				tetromino_config.size,
				this.__default_rotation,
				"orange",
				new ImageInfo(
					image,
					new XY(sprite_size, sprite_size),
					get_sprite_position("J", this.__sprite_type)
				)
			),
			new Tetromino(
				"T",
				tetromino_default_rotations.srs.T,
				new XY(0, 0),
				tetromino_config.size,
				this.__default_rotation,
				"purple",
				new ImageInfo(
					image,
					new XY(sprite_size, sprite_size),
					get_sprite_position("T", this.__sprite_type)
				)
			),
		];
	}

	get sprite_type(): Sprites {
		return this.__sprite_type;
	}

	get tetrominoes(): Tetromino[] {
		if (!this.__tetrominoes) {
			this.__generate_tetrominoes();
		}

		return this.__tetrominoes!;
	}
}

export default TetrominoStorage.get_instance();
