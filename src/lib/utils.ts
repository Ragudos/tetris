import type { ROTATION_DIR } from "./types";

export function range(
	min: number,
	max: number,
): number {
	return Math.floor(Math.random() * (max - min + 1)) + min;
}

function uppercase_by_half_chance(str: string): string {
	return Math.random() < 0.5 ? str.toUpperCase() : str;
}

export function gen_random_id(): string {
	let id = "";
	const id_length = 8;
	const lower_case_start_charcode = 97;
	const lower_case_end_charcode = 122;
	const num_start_charcode = 48;
	const num_end_charcode = 57;

	for (let count = 0; count < id_length; ++count) {
		if (Math.random() < 0.5) {
			const random_char = range(lower_case_start_charcode, lower_case_end_charcode);
			id += uppercase_by_half_chance(String.fromCharCode(random_char));
		} else {
			const random_char = range(num_start_charcode, num_end_charcode);
			id += String.fromCharCode(random_char);
		}
	}

	return id;
}

new HTMLCanvasElement().getContext("2d")?.drawImage;

/**
 * Checks if a matrix is a square - Equal rows and columns.
 */
export function is_matrix_square(
	matrix: number[][]
): boolean {
	return matrix.every(row => row.length === matrix.length);	
}

/**
 * 
 * @param num 
 * @param mod 
 * @returns Modulo of num and mod
 * 
 * @example
 * 
 * ```ts
* modulo(5, 4); // 1
 * ```
 */
export function modulo(
	num: number,
	mod: number,
): number {
	return num % mod;
}

/**
 * Rotates a matrix in-place.
 * 
 * @param {ROTATION_DIR} dir
 * @param {number[][]} m - The matrix to be rotated
 * @param {number} y - current column
 * @param {number} x - current row 
 * @returns The rotated original matrix.
 */
export function rotate_matrix(
	dir: ROTATION_DIR,
	m: number[][],
	y: number,
	x: number
): number[][] {
	const last_idx = m.length - 1 - y;
	const offset = x - y;
	const last_idx_offset = last_idx - offset;

	if (!m[y]) {
		return m;
	}

	switch (dir) {
		case -1: {
			// @ts-expect-error
			const tmp = m[y][x];

			// @ts-expect-error
			m[y][x] = m[x][last_idx];
			// @ts-expect-error
			m[x][last_idx] = m[last_idx][last_idx_offset];
			// @ts-expect-error
			m[last_idx][last_idx_offset] = matrix[last_idx_offset][y];
			// @ts-expect-error
			m[last_idx_offset][y] = tmp;
		};
		break;
		case 1: {
			// @ts-expect-error
			const tmp = m[last_idx_offset][y];

			// @ts-expect-error
			m[last_idx_offset][y] = m[last_idx][last_idx_offset];
			// @ts-expect-error
			m[last_idx][last_idx_offset] = m[x][last_idx];
			// @ts-expect-error
			m[x][last_idx] = m[y][x];
			// @ts-expect-error
			m[y][x] = tmp;
		}
	}

	return m;
}

/**
 *	Adds the product of first and pivot, and the product of last and pivot. Returns the sum.
 *  
 * @example
 * 
 * ```ts
 * multiply_and_add_product(2, 3, 4); // 14
 * 
 * // Internally
 * 
 * 3 * 2 + 4 * 2; // 14
 * ```
 */
export function multiply_and_add_products(
	pivot: number,
	first: number,
	last: number
) {
	return first * pivot + last * pivot;
}

/**
 * Performs a double loop and calls the callback function per x.
 * 
 * @example:
 * 
 * ```ts
 * 	for (let y = 0; y < y_max; ++y) {
 * 		for (let x = 0; x < x_max; ++x) {
 * 			fn(y, x);
 * 	 	}
 * 	}
 * ```
 */
export function double_loop(
	fn: (x: number, y: number) => void,
	x_max: number,
	y_max: number,
) {
	for (let y = 0; y < y_max; ++y) {
		for (let x = 0; x < x_max; ++x) {
			fn(y, x);
		}
	}
}
