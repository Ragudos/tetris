import type Tetromino from ".";

export default class TetrominoBag {
	private __bag: Tetromino[];
	private __counter: number = 0;

	constructor(tetrominoes: Tetromino[]) {
		this.__bag = tetrominoes.slice();
		this.__shuffle();
	}

	private __shuffle(): void {
		for (let i = 0; i < this.__bag.length; ++i) {
			const j = Math.floor(Math.random() * (i + 1));
			// @ts-ignore
			[this.__bag[i], this.__bag[j]] = [this.__bag[j], this.__bag[i]];
		}
	}

	get tetromino(): Tetromino {
		if (this.__counter === this.__bag.length - 1) {
			this.__counter = 1;
			this.__shuffle();

			return this.__bag[0]!.clone();
		}

		this.__counter += 1;

		return this.__bag[this.__counter]!.clone();
	}
}
