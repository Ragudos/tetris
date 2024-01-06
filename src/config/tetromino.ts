export const tetromino_config = {
	max_rotations: 4,
} as const;

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
