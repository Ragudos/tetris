export const tetromino_config = {
	max_rotations: 4,
	size: 20,
	spritesheet_id: "tetromino-spritesheet",
	sprite_image_name: "spritesheet.png",
} as const;

export type TetrominoNames = "I" | "J" | "L" | "O" | "S" | "T" | "Z";
export type KickData = "srs" | "none";

export const tetromino_colors: {
	[Property in TetrominoNames]: string;
} = {
	I: "00ffff",
	L: "0000ff",
	J: "ffa500",
	O: "ffff00",
	S: "00ff00",
	T: "800080",
	Z: "ff0000",
};

export const tetromino_default_rotations: {
	[Property in KickData]: {
		[Property in TetrominoNames]: number[][];
	};
} = {
	srs: {
		I: [
			[0, 0, 0, 0],
			[1, 1, 1, 1],
			[0, 0, 0, 0],
			[0, 0, 0, 0],
		],
		L: [
			[1, 0, 0],
			[1, 1, 1],
			[0, 0, 0],
		],
		J: [
			[0, 0, 1],
			[1, 1, 1],
			[0, 0, 0],
		],
		O: [
			[1, 1],
			[1, 1],
		],
		S: [
			[0, 1, 1],
			[1, 1, 0],
			[0, 0, 0],
		],
		T: [
			[0, 1, 0],
			[1, 1, 1],
			[0, 0, 0],
		],
		Z: [
			[1, 1, 0],
			[0, 1, 1],
			[0, 0, 0],
		],
	},
	none: {
		I: [
			[0, 0, 0, 0],
			[1, 1, 1, 1],
			[0, 0, 0, 0],
			[0, 0, 0, 0],
		],
		L: [
			[1, 0, 0],
			[1, 1, 1],
			[0, 0, 0],
		],
		J: [
			[0, 0, 1],
			[1, 1, 1],
			[0, 0, 0],
		],
		O: [
			[1, 1],
			[1, 1],
		],
		S: [
			[0, 1, 1],
			[1, 1, 0],
			[0, 0, 0],
		],
		T: [
			[0, 1, 0],
			[1, 1, 1],
			[0, 0, 0],
		],
		Z: [
			[1, 1, 0],
			[0, 1, 1],
			[0, 0, 0],
		],
	},
};

/**
 * SRS KICK DATA
 * @description
 * How far the game will kick/move the tetromino when it collides with a wall or the stack.
 * @see https://tetris.wiki/Super_Rotation_System
 *
 * legend:
 *
 * - 0: Spawn state (initial state)
 * - R = Right or clockwise rotation
 * - L = Left or counterclockwise rotation
 * - 2 = 180° rotation or two successive 90° rotations
 */
export const srs_kick_data = Object.freeze([
	// JLSZT
	[
		[0, 0],
		[-1, 0],
		[-1, +1],
		[0, -2],
		[-1, -2],
	], // 0 -> R, idx 0;
	[
		[0, 0],
		[+1, 0],
		[+1, -1],
		[0, +2],
		[+1, +2],
	], // R -> 0, idx 1;
	[
		[0, 0],
		[+1, 0],
		[+1, -1],
		[0, +2],
		[+1, +2],
	], // R -> 2, idx 2;
	[
		[0, 0],
		[-1, 0],
		[-1, +1],
		[0, -2],
		[-1, -2],
	], // 2 -> R, idx 3;
	// Reverse rotation
	[
		[0, 0],
		[+1, 0],
		[+1, +1],
		[0, -2],
		[+1, -2],
	], // 2 -> L, idx 4;
	[
		[0, 0],
		[-1, 0],
		[-1, -1],
		[0, +2],
		[-1, +2],
	], // L -> 2, idx 5;
	[
		[0, 0],
		[-1, 0],
		[-1, -1],
		[0, +2],
		[-1, +2],
	], // L -> 0, idx 6;
	[
		[0, 0],
		[+1, 0],
		[+1, +1],
		[0, -2],
		[+1, -2],
	], // 0 -> L, idx 7;
	// I
	[
		[0, 0],
		[-2, 0],
		[+1, 0],
		[+1, +2],
		[-2, -1],
	], // 0 -> R, idx 0;
	[
		[0, 0],
		[+2, 0],
		[-1, 0],
		[+2, +1],
		[-1, -2],
	], // R -> 0, idx 1;
	[
		[0, 0],
		[-1, 0],
		[+2, 0],
		[-1, +2],
		[+2, -1],
	], // R -> 2, idx 2;
	[
		[0, 0],
		[-2, 0],
		[+1, 0],
		[-2, +1],
		[+1, -1],
	], // 2 -> R, idx 3;

	// Reverse rotation
	[
		[0, 0],
		[+2, 0],
		[-1, 0],
		[+2, +1],
		[-1, -1],
	], // 2 -> L, idx 4;
	[
		[0, 0],
		[+1, 0],
		[-2, 0],
		[+1, +2],
		[-2, -1],
	], // L -> 2, idx 5;
	[
		[0, 0],
		[-2, 0],
		[+1, 0],
		[-2, +1],
		[+1, -2],
	], // L -> 0, idx 6;
	[
		[0, 0],
		[+2, 0],
		[-1, 0],
		[-1, +2],
		[+2, -1],
	], // 0 -> L, idx 7;
]);
