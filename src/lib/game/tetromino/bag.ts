import type { Tetromino } from "./tetromino";

class TetrominoBag {
	private readonly __bag: Tetromino[];
	private __current_tetromino: number;

	constructor(tetrominoes: Tetromino[]) {
		// We slice since we need this to be independent of the original array.
		// We don't want to mutate the original array as we shuffle the bug.
		this.__bag = tetrominoes.slice();
		this.__current_tetromino = 0;

		this.shuffle();
	}

	private shuffle(): void {
		for (let idx = this.__bag.length - 1; idx > 0; --idx) {
			const random_idx = Math.floor(Math.random() * (idx + 1));
			// @ts-ignore
			const tmp = this.__bag[idx]!;
			this.__bag[idx] = this.__bag[random_idx]!;
			this.__bag[random_idx] = tmp;
		}
	}

	private refill(): void {
		this.__current_tetromino = 0;
		this.shuffle();
	}

	get_tetromino(): Tetromino {
		if (this.__current_tetromino === this.__bag.length - 1) {
			this.refill();
			return this.__bag[0]!;
		}

		this.__current_tetromino += 1;

		return this.__bag[this.__current_tetromino]!;
	}
}

export default TetrominoBag;
