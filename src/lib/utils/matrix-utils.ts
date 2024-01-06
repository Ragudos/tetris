import type { ROTATION_DIR } from "../types";

/**
 * @param matrix - The matrix to check.
 * @returns True if the matrix has equal columns and rows, false otherwise.
 */
function is_square_matrix<T>(matrix: T[][]): boolean {
	return matrix.every((row) => row.length === matrix.length);
}

/**
 * Rotates a matrix in-place and returns it.
 *
 * @param dir The direction which to rotate. -1 for left, 1 for right.
 * @param m The matrix to rotate.
 * @returns The rotated matrix.
 * @throws {Error} If the matrix is not square, dir is neither -1 nor 1, or a column does not exist.
 *
 * Calls either {@link rotate_matrix_counterclockwise} or {@link rotate_matrix_clockwise} depending on the direction.
 */
function rotate_matrix<T>(dir: ROTATION_DIR, m: T[][]): T[][] {
	if (!is_square_matrix(m)) {
		throw new Error("RotateMatrix: matrix must be square");
	}

	if (dir !== -1 && dir !== 1) {
		throw new Error("RotateMatrix: direction must be -1 or 1");
	}

	for (let y = 0; y < m.length / 2; ++y) {
		// Last idx is the last index of the current row.
		const last_idx = m.length - 1 - y;

		for (let x = y; x < last_idx; ++x) {
			const offset = x - y;
			const last_idx_offset = last_idx - offset;

			if (!m[y]) {
				throw new Error(
					`RotateMatrix: column index of ${y} does not exist`,
				);
			}

			switch (dir) {
				case -1:
					{
						rotate_matrix_counterclockwise(
							m,
							last_idx,
							last_idx_offset,
                            x,
                            y
						);
					}
					break;
				case 1: {
					rotate_matrix_clockwise(
						m,
						last_idx,
						last_idx_offset,
                        x,
                        y
					);
				}
			}
		}
	}

	return m;
}

/**
 * Rotates a matrix in-place clockwise and returns it.
 *
 * If you meant to rotate a matrix without worrying about the other arguments of this function, please use
 * {@link rotate_matrix}.
 *
 * @param m The matrix to rotate.
 * @param last_idx The last index of the current row.
 * @param last_idx_offset The offset between the last index of the current row and offset.
 * @param x The current row.
 * @param y The current column.
 * @returns The matrix rotated clockwise.
 */
function rotate_matrix_clockwise<T>(
	m: T[][],
	last_idx: number,
	last_idx_offset: number,
    x: number,
    y: number,
): T[][] {
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

	return m;
}

/**
 * Rotates a matrix in-place counterclockwise and returns it.
 *
 * If you meant to rotate a matrix without worrying about the other arguments of this function, please use
 * {@link rotate_matrix}.
 *
 * @param m The matrix to rotate.
 * @param last_idx The last index of the current row.
 * @param last_idx_offset The offset between the last index of the current row and offset.
 * @param x The current row.
 * @param y The current column.
 * @returns The matrix rotated counterclockwise.
 */
function rotate_matrix_counterclockwise<T>(
	m: T[][],
	last_idx: number,
	last_idx_offset: number,
    x: number,
    y: number,
): T[][] {
	// @ts-expect-error
	const tmp = m[y][x];

	// @ts-expect-error
	m[y][x] = m[x][last_idx];
	// @ts-expect-error
	m[x][last_idx] = m[last_idx][last_idx_offset];
	// @ts-expect-error
	m[last_idx][last_idx_offset] = m[last_idx_offset][y];
	// @ts-expect-error
	m[last_idx_offset][y] = tmp;

	return m;
}

export {
    is_square_matrix,
    rotate_matrix,
    rotate_matrix_clockwise,
    rotate_matrix_counterclockwise,
}
