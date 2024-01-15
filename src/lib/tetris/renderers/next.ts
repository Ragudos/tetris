import * as PIXI from "pixi.js";
import config from "../config";
import type { Sprites } from "./main";
import type Game from "../game";
import type { TetrominoNames } from "../../../config/tetromino";
import { blocks } from "../../consts";

export default class NextRenderer extends PIXI.Container {
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
    ]

    private __text: PIXI.Text;

    constructor(app: PIXI.Application, type_of_sprite: Sprites, game: Game) {
        super();

        this.__game = game;
        this.__app = app;
        this.type_of_sprite = type_of_sprite;
        this.blocks = [];
        this.position.set(app.screen.width / 2 + (config.display.width / 1.5), app.screen.height / 2 - (config.display.height - config.display.height / 1.675));
        this.width = config.display.side_width * 1.5;
        this.height = config.display.side_width;

        this.__graphics = new PIXI.Graphics();
        this.addChild(this.__graphics);

        this.__graphics.beginFill("#000");
        this.__graphics.drawRect(0, 0, config.display.side_width * 1.5, config.display.side_width);

        for (const s of this.__sprites) {
            const sprite =  s.sprite;
            sprite.width = config.display.side_width / 4;
            sprite.height = config.display.side_width / 4;

            this.addChild(sprite);
        }

        this.__text = new PIXI.Text("Next", {
            fontSize: 24,
            fill: "#fff",
            fontWeight: "bold",
        });

        this.__text.position.set(
            32,
            -32
        )

        this.addChild(this.__text);
    }

        reset_positions(): void {
            for (const s of this.__sprites) {
                s.is_done = false;
            }
        }

        draw(): void {
        if (!this.__game.next_tetromino) {
            return;
        }

        const tetromino = this.__game.next_tetromino;

        const name = tetromino.name;

        const texture = PIXI.Assets.cache.get(`${this.type_of_sprite}_${name.toLowerCase()}`) as PIXI.Texture;

        for (const s of this.__sprites) {
            s.sprite.texture = texture;
        }

        let is_finished = false;

        for (let y = 0; y < blocks[tetromino.name].length; ++y) {
            for (let x = 0; x < blocks[tetromino.name]![y]!.length; ++x) {
                const item = blocks[tetromino.name][y]![x];

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

                if (tetromino.name === "I") {
                    sprite.sprite.position.set(
                        sprite.sprite.width * x + config.display.side_width / 2 - sprite.sprite.width,
                        config.display.side_width / 2 - sprite.sprite.height / 2
                    );
                } else if (tetromino.name === "O") {
                    sprite.sprite.position.set(
                        sprite.sprite.width * x + config.display.side_width * 1.5 / 2 - sprite.sprite.width,
                        sprite.sprite.height * y + config.display.side_width / 2 - sprite.sprite.height
                    );
                } else {
                    sprite.sprite.position.set(
                        sprite.sprite.width * x + config.display.side_width * 1.25 / 2 - sprite.sprite.width,
                        sprite.sprite.height * y  + config.display.side_width / 2 - sprite.sprite.height,
                    );
                }

                sprite.is_done = true;
            }

            if (is_finished) {
                break;
            }
        }
    }
}
