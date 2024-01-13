import * as PIXI from "pixi.js";
import config from "../config";
import type { TetrominoNames } from "../../../config/tetromino";
import type { Sprites } from "./main";
import type Game from "../game";

export default class SwapRenderer extends PIXI.Container {
    readonly block_size = config.display.block_size / 1.5;

    readonly blocks: {
        name: TetrominoNames | null;
        sprite: PIXI.Sprite;
    }[][]

    public type_of_sprite: Sprites;
    private __app: PIXI.Application;
    private __game: Game;

    private __graphics: PIXI.Graphics;
    private __sprites = [
        {
            is_done: false,
            sprite: new PIXI.Sprite(),
        },
        {
            is_done: false,
            sprite: new PIXI.Sprite(),
        },
        {
            is_done: false,
            sprite: new PIXI.Sprite(),
        },
        {
            is_done: false,
            sprite: new PIXI.Sprite(),
        }
   ];

    constructor(app: PIXI.Application, type_of_sprite: Sprites, game: Game) {
        super();

        this.__game = game;
        this.__app = app;
        this.type_of_sprite = type_of_sprite;
        this.blocks = [];
        this.position.set(app.screen.width / 2 - (config.display.width + config.display.side_width / 2), app.screen.height / 2 - (config.display.height - config.display.height / 1.675));
        this.width = config.display.side_width;
        this.height = config.display.side_width;

        this.__graphics = new PIXI.Graphics();
        this.addChild(this.__graphics);

        this.__graphics.beginFill("#000");
        this.__graphics.drawRect(0, 0, config.display.side_width, config.display.side_width);

        for (const s of this.__sprites) {
            const sprite =  s.sprite;
            sprite.width = config.display.side_width / 4;
            sprite.height = config.display.side_width / 4;

            this.addChild(sprite);
        }
    }

    reset_positions(): void {
        for (const s of this.__sprites) {
            s.is_done = false;
        }
    } 

    draw(): void {
        if (!this.__game.swapped_tetromino) {
            return;
        }

        const tetromino = this.__game.swapped_tetromino;

        const name = tetromino.name;

        const texture = PIXI.Assets.cache.get(`${this.type_of_sprite}_${name.toLowerCase()}`) as PIXI.Texture;

        for (const s of this.__sprites) {
            s.sprite.texture = texture;
        }

        let is_finished = false;

        for (let y = 0; y < tetromino.shape.length; ++y) {
            for (let x = 0; x < tetromino.shape[y]!.length; ++x) {
                const item = tetromino.shape[y]![x];

                if (!item) {
                    continue;
                }

                let sprite;

                for (const s of this.__sprites) {
                    if (!s.is_done) {
                        sprite = s;
                        break;
                    }
                }

                if (!sprite) {
                    is_finished = true;
                    break;
                }

                sprite.sprite.position.set(
                    x * sprite.sprite.width,
                    y * sprite.sprite.height
                );

                sprite.is_done = true;
            }

            if (is_finished) {
                break;
            }
        }
    }
    
}
