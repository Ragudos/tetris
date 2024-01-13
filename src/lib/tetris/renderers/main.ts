import * as PIXI from "pixi.js";
import config from "../config";
import type Tetromino from "../tetromino";
import type Screen from "../screen";
import type { TetrominoNames, tetromino_colors } from "../../../config/tetromino";
import UserSettings from "../user-settings";
import { get_time_ease_out } from "../utils/formulas";

export type Sprites = "basic" | "blocky";

export default class MainRenderer extends PIXI.Container {
	private __rows: number = config.screen.rows + 2;
	private __columns: number = config.screen.columns;

	block_size: number;
	public type_of_sprite: Sprites;
	readonly blocks: {
		name: TetrominoNames | "ghost" | null;
		sprite: PIXI.Sprite;
	}[][];

	private __time_since_flicker: number = 0;
	private __app: PIXI.Application;

	constructor(app: PIXI.Application, type_of_sprite: Sprites) {
		super();

		this.__app = app;
		this.type_of_sprite = type_of_sprite;
		this.blocks = [];
		this.position.set(app.screen.width / 2 - config.display.width / 2, app.screen.height / 2 - config.display.height / 2);
		this.block_size = config.display.width / this.__columns;

		for (let y = 0; y < this.__rows; ++y) {
			let row = [];
			for (let x = 0; x < this.__columns; ++x) {
				const sprite = new PIXI.Sprite();

				sprite.position.set(x * this.block_size, y * this.block_size);
				sprite.width = this.block_size;
				sprite.height = this.block_size;
				sprite.tint = "#fff";

				row.push({
					name: null,
					sprite,
				});
				this.addChild(sprite);
			}
			this.blocks.push(row);
		}
	}

	update_grid(
		row: number,
		column: number,
		name: null | "ghost" | TetrominoNames,
		color: (typeof tetromino_colors)[keyof typeof tetromino_colors],
		should_add_tint: boolean = false,
	): void {
		if (row < 0) {
			return;
		}

		const row_block = this.blocks[row];

		if (!row_block) {
			return;
		}

		const block = row_block[column];

		if (!block) {
			return;
		}

		if (should_add_tint) {
			block.sprite.tint = color;
		}

		if ((block.name === null || block.name === "ghost") && name !== null) {
			block.sprite.texture = PIXI.Assets.cache.get(
				`${this.type_of_sprite}_${name.toLowerCase()}`,
			) as PIXI.Texture;
		} else if (name === null) {
			block.name = null;
			block.sprite.texture = PIXI.Assets.cache.get(
				"background",
			) as PIXI.Texture;
		}
	}

	brighten_block(): void {
		this.blocks.forEach((row) => {
			row.forEach((block) => {
				block.sprite.alpha = 1;
			});
		});
	}

	reset_flicker() {
		this.__time_since_flicker = 0;
	}

	flicker_block(dt: number, tetromino: Tetromino) {
		this.__time_since_flicker += dt;

		// Since we want this to fade out, we subtract the fraction to one
		// If we don't, the initial value will be 0, and it will fade in
		// The fraction was acquired from
		/** @see https://javascript.info/js-animation */
		const fraction =
			1 - (dt - this.__time_since_flicker) / (config.lock.delay * 2);
		const new_alpha = get_time_ease_out(fraction);

		for (let y = 0; y < tetromino.shape.length; ++y) {
			const row = tetromino.shape[y];

			if (!row) {
				continue;
			}

			for (let x = 0; x < row.length; ++x) {
				const block = row[x];

				if (!block) {
					continue;
				}

				const pixi_block = this.blocks[y + tetromino.position.y];

				if (!pixi_block) {
					continue;
				}

				const b = pixi_block[x + tetromino.position.x];

				if (!b) {
					continue;
				}

				b.sprite.alpha = new_alpha;
			}
		}
	}

	update_overflow(): void {
		for (let y = 0; y < 2; ++y) {
			const row = this.blocks[y];

			if (!row) {
				continue;
			}

			for (let x = 0; x < this.__columns; ++x) {
				const block = row[x];

				if (!block) {
					continue;
				}

				block.sprite.texture = PIXI.Texture.EMPTY;
			}
		}
	}

	update_screen(screen: Screen): void {
		for (let y = 2; y < this.__rows; ++y) {
			const row = screen.grid[y];

			if (!row) {
				continue;
			}

			for (let x = 0; x < this.__columns; ++x) {
				const block = screen.grid[y]![x];

				this.update_grid(y, x, block?.name ?? null, "#fff", true);
			}
		}
	}

	update_tetromino(tetromino: Tetromino): void {
		for (let y = 0; y < tetromino.shape.length; ++y) {
			const row = tetromino.shape[y];

			if (!row) {
				continue;
			}

			for (let x = 0; x < row.length; ++x) {
				const block = row[x];

				if (!block) {
					continue;
				}

				this.update_grid(
					tetromino.position.y + y,
					tetromino.position.x + x,
					tetromino.name,
					"#fff",
					true,
				);
			}
		}
	}

	update_ghost(ghost_y: number, tetromino: Tetromino): void {
		if (!UserSettings.get_instance().ghost_piece) {
			return;
		}

		for (let y = 0; y < tetromino.shape.length; ++y) {
			const row = tetromino.shape[y];

			if (!row) {
				continue;
			}

			for (let x = 0; x < row.length; ++x) {
				const block = row[x];

				if (!block) {
					continue;
				}

				this.update_grid(
					ghost_y + y,
					tetromino.position.x + x,
					"ghost",
					"#707070",
					true,
				);
			}
		}
	}
}
