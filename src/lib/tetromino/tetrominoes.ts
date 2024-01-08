import { tetromino_config } from "../../config/tetromino";
import { ImageInfo } from "../image-info";
import { XY } from "../xy";
import {
	TetrominoWithoutSprite,
	type TetrominoInterface,
	TetrominoWithSprite,
} from "./tetromino";

export class Tetrominoes {
	private static __instance: Tetrominoes;
	private constructor() {}

	private __tetrominoes_without_sprite: undefined | TetrominoInterface[];
	private __tetrominoes_with_sprite: undefined | TetrominoInterface[];

	public static get_instance(): Tetrominoes {
		if (!Tetrominoes.__instance) {
			Tetrominoes.__instance = new Tetrominoes();
		}

		return Tetrominoes.__instance;
	}

	private generate_tetrominoes_without_sprite(): void {
		this.__tetrominoes_without_sprite = [
			new TetrominoWithoutSprite(
				"I",
				"#00FFFF",
				0,
				new XY(0, 0),
				[
					[0, 0, 0, 0],
					[1, 1, 1, 1],
					[0, 0, 0, 0],
					[0, 0, 0, 0],
				],
				tetromino_config.size,
			),
			new TetrominoWithoutSprite(
				"O",
				"#FFFF00",
				0,
				new XY(0, 0),
				[
					[1, 1],
					[1, 1],
				],
				tetromino_config.size,
			),
			new TetrominoWithoutSprite(
				"T",
				"#800080",
				0,
				new XY(0, 0),
				[
					[0, 1, 0],
					[1, 1, 1],
					[0, 0, 0],
				],
				tetromino_config.size,
			),
			new TetrominoWithoutSprite(
				"S",
				"#00FF00",
				0,
				new XY(0, 0),
				[
					[0, 1, 1],
					[1, 1, 0],
					[0, 0, 0],
				],
				tetromino_config.size,
			),
			new TetrominoWithoutSprite(
				"Z",
				"#FF0000",
				0,
				new XY(0, 0),
				[
					[1, 1, 0],
					[0, 1, 1],
					[0, 0, 0],
				],
				tetromino_config.size,
			),
			new TetrominoWithoutSprite(
				"J",
				"#0000FF",
				0,
				new XY(0, 0),
				[
					[1, 0, 0],
					[1, 1, 1],
					[0, 0, 0],
				],
				tetromino_config.size,
			),
			new TetrominoWithoutSprite(
				"L",
				"#FFA500",
				0,
				new XY(0, 0),
				[
					[0, 0, 1],
					[1, 1, 1],
					[0, 0, 0],
				],
				tetromino_config.size,
			),
		];
	}

	private generate_tetrominoes_with_sprite(): void {
		const image = document.getElementById("tetromino-spritesheet");

		if (!(image instanceof HTMLImageElement)) {
			throw new Error(
				"Cannot find tetromino spritesheet or it's not an image element.",
			);
		}

		this.__tetrominoes_with_sprite = [
			new TetrominoWithSprite(
				"I",
				"#00FFFF",
				0,
				new XY(0, 0),
				[
					[0, 0, 0, 0],
					[1, 1, 1, 1],
					[0, 0, 0, 0],
					[0, 0, 0, 0],
				],
				tetromino_config.size,
				new ImageInfo(
					image,
					new XY(
						tetromino_config.sprite_block_size,
						tetromino_config.sprite_block_size,
					),
					new XY(
						tetromino_config.spritesheet_margin_x,
						tetromino_config.spritesheet_margin_y * 6 + 2,
					),
				),
			),
			new TetrominoWithSprite(
				"O",
				"#FFFF00",
				0,
				new XY(0, 0),
				[
					[1, 1],
					[1, 1],
				],
				tetromino_config.size,
				new ImageInfo(
					image,
					new XY(
						tetromino_config.sprite_block_size,
						tetromino_config.sprite_block_size,
					),
					new XY(
						tetromino_config.spritesheet_margin_x,
						tetromino_config.spritesheet_margin_y * 5 + 3,
					),
				),
			),
			new TetrominoWithSprite(
				"T",
				"#800080",
				0,
				new XY(0, 0),
				[
					[0, 1, 0],
					[1, 1, 1],
					[0, 0, 0],
				],
				tetromino_config.size,
				new ImageInfo(
					image,
					new XY(
						tetromino_config.sprite_block_size,
						tetromino_config.sprite_block_size,
					),
					new XY(
						tetromino_config.spritesheet_margin_x,
						tetromino_config.spritesheet_margin_y * 10 + 6,
					),
				),
			),
			new TetrominoWithSprite(
				"S",
				"#00FF00",
				0,
				new XY(0, 0),
				[
					[0, 1, 1],
					[1, 1, 0],
					[0, 0, 0],
				],
				tetromino_config.size,
				new ImageInfo(
					image,
					new XY(
						tetromino_config.sprite_block_size,
						tetromino_config.sprite_block_size,
					),
					new XY(
						tetromino_config.spritesheet_margin_x,
						tetromino_config.spritesheet_margin_y * 2 - 2,
					),
				),
			),
			new TetrominoWithSprite(
				"Z",
				"#FF0000",
				0,
				new XY(0, 0),
				[
					[1, 1, 0],
					[0, 1, 1],
					[0, 0, 0],
				],
				tetromino_config.size,
				new ImageInfo(
					image,
					new XY(
						tetromino_config.sprite_block_size,
						tetromino_config.sprite_block_size,
					),
					new XY(
						tetromino_config.spritesheet_margin_x * 2,
						tetromino_config.spritesheet_margin_y * 6 + 10,
					),
				),
			),
			new TetrominoWithSprite(
				"J",
				"#0000FF",
				0,
				new XY(0, 0),
				[
					[1, 0, 0],
					[1, 1, 1],
					[0, 0, 0],
				],
				tetromino_config.size,
				new ImageInfo(
					image,
					new XY(
						tetromino_config.sprite_block_size,
						tetromino_config.sprite_block_size,
					),
					new XY(
						tetromino_config.spritesheet_margin_x,
						tetromino_config.spritesheet_margin_y - 1,
					),
				),
			),
			new TetrominoWithSprite(
				"L",
				"#FFA500",
				0,
				new XY(0, 0),
				[
					[0, 0, 1],
					[1, 1, 1],
					[0, 0, 0],
				],
				tetromino_config.size,
				new ImageInfo(
					image,
					new XY(
						tetromino_config.sprite_block_size,
						tetromino_config.sprite_block_size,
					),
					new XY(
						tetromino_config.spritesheet_margin_x,
						tetromino_config.spritesheet_margin_y * 9 - 1,
					),
				),
			),
		];
	}

	get tetrominoes_with_sprite(): TetrominoInterface[] {
		if (!this.__tetrominoes_with_sprite) {
			this.generate_tetrominoes_with_sprite();
		}

		return this.__tetrominoes_with_sprite as TetrominoInterface[];
	}

	get tetrominoes_without_sprite(): TetrominoInterface[] {
		if (!this.__tetrominoes_without_sprite) {
			this.generate_tetrominoes_without_sprite();
		}

		return this.__tetrominoes_without_sprite as TetrominoInterface[];
	}
}

export default Tetrominoes.get_instance();
