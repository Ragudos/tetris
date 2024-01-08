import type { TetrominoInterface } from "./tetromino";

class TetrominoBag {
	private readonly __tetrominoes: TetrominoInterface[];
	private __bag: TetrominoInterface[];
	private __current_tetromino: number;

	constructor(tetrminoes: TetrominoInterface[]) {
		this.__tetrominoes = tetrminoes;

		this.__bag = this.__tetrominoes.slice();
		this.shuffle_bag();
		this.__current_tetromino = 0;
	}

	private refill_bag(): void {
		this.__current_tetromino = 0;
		this.shuffle_bag();
	}

	private shuffle_bag(): void {
		for (let idx = this.__bag.length - 1; idx > 0; --idx) {
			const random_idx = Math.floor(Math.random() * (idx + 1));
			// @ts-ignore
			[this.__bag[idx], this.__bag[random_idx]] = [
				this.__bag[random_idx],
				this.__bag[idx],
			];
		}
	}

	/**
	 *
	 * @returns Only use for multiplayer (showing next tetromino)
	 */
	public set_bag(bag: TetrominoInterface[]): void {
		this.__bag = bag;
	}

	public get_tetromino(): TetrominoInterface {
		if (this.__current_tetromino === this.__bag.length - 1) {
			this.refill_bag();
		}

		this.__current_tetromino += 1;

		return this.__bag[this.__current_tetromino]!;
	}
}

export default TetrominoBag;
