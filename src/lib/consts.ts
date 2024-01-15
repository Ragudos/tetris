import type { TetrominoNames } from "../config/tetromino";

export const blocks: {
	[Property in TetrominoNames]: number[][];
} = {
	I: [[1, 1, 1, 1]],
	O: [
		[1, 1],
		[1, 1],
	],
	T: [
		[0, 1, 0],
		[1, 1, 1],
	],
	S: [
		[0, 1, 1],
		[1, 1, 0],
	],
	Z: [
		[1, 1, 0],
		[0, 1, 1],
	],
	J: [
		[1, 0, 0],
		[1, 1, 1],
	],
	L: [
		[0, 0, 1],
		[1, 1, 1],
	],
};
