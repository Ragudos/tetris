import * as PIXI from 'pixi.js';
import config from './config';
import type Tetromino from './tetromino';
import type { TetrominoNames, tetromino_colors } from './tetromino';
import type Screen from './screen';

export type Sprites = "basic" | "blocky";

export default class Renderer extends PIXI.Container {
    private __rows: number = config.screen.rows;
    private __columns: number = config.screen.columns;

    readonly block_size: number = config.display.block_size;
    public type_of_sprite: Sprites;
    readonly blocks: {
        name: TetrominoNames | "ghost" | null,
        sprite: PIXI.Sprite
    }[][];

    constructor(type_of_sprite: Sprites) {
        super();

        this.type_of_sprite = type_of_sprite;

        this.blocks = [];

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
                    sprite
                });
                this.addChild(sprite);
            }
            this.blocks.push(row);
        }
    }

    update_grid(row: number, column: number, name: null | "ghost" | TetrominoNames, color: typeof tetromino_colors[keyof typeof tetromino_colors]): void {
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

        if (block.name === null && name !== null) {
            block.name = name;
            block.sprite.texture = PIXI.Assets.cache.get(`${this.type_of_sprite}_${name.toLowerCase()}`) as PIXI.Texture;
        } else if (name === null) {
            block.name = null;
            block.sprite.texture = PIXI.Assets.cache.get("background") as PIXI.Texture;
        }
    }

    update_screen(screen: Screen): void {
        for (let y = 0; y < this.__rows; ++y) {
            const row = screen.grid[y];

            if (!row) {
                continue;
            }

            for (let x = 0; x < this.__columns; ++x) {
                const block = screen.grid[y]![x];

                this.update_grid(
                    y,
                    x,
                    block?.name ?? null,
                    block?.color ?? "#212121"
                )
            }
        }
    }

    update_tetromino(tetromino: Tetromino): void {
        for (let y = 0; y < tetromino.shape.length; ++y) {
            const row = tetromino.shape[y];

            if (!row) {
                continue
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
                    tetromino.color
                );
            }
        }
    }
}
