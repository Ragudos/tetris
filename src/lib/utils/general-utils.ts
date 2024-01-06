type DoubleLoopCallback = (y: number, x: number) => void;
type IsTrueAtleastOnceCallback = (y: number, x: number) => boolean;

/**
 * Performs a double loop and calls the callback per x. If either x_max or y_max is less than or equal to 0, then this
 * function might not be the one you're looking for.
 *
 * @throws If either x_max or y_max is less than or equal to 0.
 *
 * @example
 *
 * ```ts
 * for (let y = 0; y < y_max; ++y) {
 *    for (let x = 0; x < x_max; ++x) {
 *       fn(y, x);
 *   }
 * }
 * ```
 */
function double_loop(
	fn: DoubleLoopCallback,
	x_max: number,
	y_max: number,
): void {
	if (x_max <= 0 || y_max <= 0) {
		throw new Error("DoubleLoop: x_max and y_max must be greater than 0");
	}

	for (let y = 0; y < y_max; ++y) {
		for (let x = 0; x < x_max; ++x) {
			fn(y, x);
		}
	}
}

/**
 * Performs a double loop and calls the callback per x. Returns early if the callback returns true.
 *
 * @throws If either x_max or y_max is less than or equal to 0.
 */
function is_true_atleast_once(
	fn: IsTrueAtleastOnceCallback,
	x_max: number,
	y_max: number,
): boolean {
	if (x_max <= 0 || y_max <= 0) {
		throw new Error(
			"IsTrueAtleastOnce: x_max and y_max must be greater than 0",
		);
	}

	for (let y = 0; y < y_max; ++y) {
		for (let x = 0; x < x_max; ++x) {
			if (fn(y, x)) {
				return true;
			}
		}
	}

	return false;
}

/**
 * Adds the product of first and pivot, and the product of last and pivot. Returns the sum.
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
function multiply_and_add_products(
	pivot: number,
	first: number,
	last: number,
): number {
	return first * pivot + last * pivot;
}

/**
 * @returns A random value between start end end
 */
function range(start: number, end: number): number {
	return Math.floor(Math.random() * (end - start + 1)) + start;
}

/**
 * @returns Remainder when n is divided by m
 */
function modulo(n: number, m: number): number {
	return n % m;
}

export {
	modulo,
	range,
	multiply_and_add_products,
	is_true_atleast_once,
	double_loop,
};
