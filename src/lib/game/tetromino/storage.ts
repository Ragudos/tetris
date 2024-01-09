import { tetromino_config } from "../../../config/tetromino";
import { ImageInfo } from "../../image-info";
import { XY } from "../../xy";
import {
	tetromino_with_color_factory,
	tetromino_with_sprite_factory,
} from "./factory";
import { Tetromino } from "./tetromino";

class TetrominoStorage {
	private static __instance: TetrominoStorage;
	private constructor() {}

	private __tetrominoes_with_color: undefined | Tetromino[];
	private __tetrominoes_with_sprite: undefined | Tetromino[];

	static get_instance(): TetrominoStorage {
		if (!TetrominoStorage.__instance) {
			TetrominoStorage.__instance = new TetrominoStorage();
		}

		return TetrominoStorage.__instance;
	}

	get_bag_with_color(): Tetromino[] {
		if (!this.__tetrominoes_with_color) {
			this.generate_tetrominoes_with_color();
		}

		return this.__tetrominoes_with_color!;
	}

	get_bag_with_sprite(): Tetromino[] {
		if (!this.__tetrominoes_with_sprite) {
			this.generate_tetrominoes_with_sprite();
		}

		return this.__tetrominoes_with_sprite!;
	}

	private generate_tetrominoes_with_color(): void {
		this.__tetrominoes_with_color = [
			tetromino_with_color_factory(
				"I",
				new XY(0, 0),
				tetromino_config.size,
			),
			tetromino_with_color_factory(
				"O",
				new XY(0, 0),
				tetromino_config.size,
			),
			tetromino_with_color_factory(
				"T",
				new XY(0, 0),
				tetromino_config.size,
			),
			tetromino_with_color_factory(
				"S",
				new XY(0, 0),
				tetromino_config.size,
			),
			tetromino_with_color_factory(
				"Z",
				new XY(0, 0),
				tetromino_config.size,
			),
			tetromino_with_color_factory(
				"J",
				new XY(0, 0),
				tetromino_config.size,
			),
			tetromino_with_color_factory(
				"L",
				new XY(0, 0),
				tetromino_config.size,
			),
		];
	}

	private generate_tetrominoes_with_sprite(): void {
		const image = document.getElementById(tetromino_config.spritesheet_id);

		if (!image || !(image instanceof HTMLImageElement)) {
			throw new Error("Tetromino spritesheet not found.");
		}

		this.__tetrominoes_with_sprite = [
			tetromino_with_sprite_factory(
				"I",
				new XY(0, 0),
				tetromino_config.size,
				new ImageInfo(
					image,
					new XY(
						tetromino_config.sprite_block_size,
						tetromino_config.sprite_block_size,
					),
					new XY(
						tetromino_config.spritesheet_block_space,
						tetromino_config.spritesheet_block_space,
					),
				),
			),
			tetromino_with_sprite_factory(
				"O",
				new XY(0, 0),
				tetromino_config.size,
				new ImageInfo(
					image,
					new XY(
						tetromino_config.sprite_block_size,
						tetromino_config.sprite_block_size,
					),
					new XY(
						tetromino_config.spritesheet_block_space,
						tetromino_config.spritesheet_block_space,
					),
				),
			),
			tetromino_with_sprite_factory(
				"T",
				new XY(0, 0),
				tetromino_config.size,
				new ImageInfo(
					image,
					new XY(
						tetromino_config.sprite_block_size,
						tetromino_config.sprite_block_size,
					),
					new XY(
						tetromino_config.spritesheet_block_space,
						tetromino_config.spritesheet_block_space,
					),
				),
			),
			tetromino_with_sprite_factory(
				"S",
				new XY(0, 0),
				tetromino_config.size,
				new ImageInfo(
					image,
					new XY(
						tetromino_config.sprite_block_size,
						tetromino_config.sprite_block_size,
					),
					new XY(
						tetromino_config.spritesheet_block_space,
						tetromino_config.spritesheet_block_space,
					),
				),
			),
			tetromino_with_sprite_factory(
				"Z",
				new XY(0, 0),
				tetromino_config.size,
				new ImageInfo(
					image,
					new XY(
						tetromino_config.sprite_block_size,
						tetromino_config.sprite_block_size,
					),
					new XY(
						tetromino_config.spritesheet_block_space,
						tetromino_config.spritesheet_block_space,
					),
				),
			),
			tetromino_with_sprite_factory(
				"J",
				new XY(0, 0),
				tetromino_config.size,
				new ImageInfo(
					image,
					new XY(
						tetromino_config.sprite_block_size,
						tetromino_config.sprite_block_size,
					),
					new XY(
						tetromino_config.spritesheet_block_space,
						tetromino_config.spritesheet_block_space,
					),
				),
			),
			tetromino_with_sprite_factory(
				"L",
				new XY(0, 0),
				tetromino_config.size,
				new ImageInfo(
					image,
					new XY(
						tetromino_config.sprite_block_size,
						tetromino_config.sprite_block_size,
					),
					new XY(
						tetromino_config.spritesheet_block_space,
						tetromino_config.spritesheet_block_space,
					),
				),
			),
		];
	}
}

export default TetrominoStorage.get_instance();
