import {
	tetromino_colors,
	tetromino_default_shapes,
} from "../../../config/tetromino";
import type { ImageInfo } from "../../image-info";
import type { XY } from "../../xy";
import {
	TetrominoWithColor,
	type Tetromino,
	type TetrominoNames,
	TetrominoWithSprite,
} from "./tetromino";

//  TODO: Change .srs to a dynamic defult shape generator based on kick data the user chooses.

function tetromino_with_color_factory(
	name: TetrominoNames,
	initial_position: XY,
	size: number,
): Tetromino {
	const color = tetromino_colors[name];
	const shape = tetromino_default_shapes.srs[name];

	return new TetrominoWithColor(
		name,
		shape,
		initial_position,
		size,
		0,
		color,
	);
}

function tetromino_with_sprite_factory(
	name: TetrominoNames,
	initial_position: XY,
	size: number,
	image_info: ImageInfo,
): Tetromino {
	const shape = tetromino_default_shapes.srs[name];

	return new TetrominoWithSprite(
		name,
		shape,
		initial_position,
		size,
		0,
		image_info,
	);
}

export { tetromino_with_color_factory, tetromino_with_sprite_factory };
