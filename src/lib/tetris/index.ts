import * as PIXI from "pixi.js";
import config from "./config";
import Game from "./game";

const container = document.querySelector(".canvas-container") as HTMLElement;
const sheet = await PIXI.Assets.load("/spritesheet/data.json") as PIXI.Spritesheet;

const tetris_app = new PIXI.Application({
    width: config.display.width,
    height: config.display.height + 40,
    autoDensity: true,
    premultipliedAlpha: true,
    backgroundAlpha: 0
});
// @ts-ignore
container.appendChild(tetris_app.view);

function init() {
    const game = new Game(tetris_app, "basic", "srs");

    game.start();

    let did_move_right = false;
    let did_move_left = false;

    window.addEventListener("keyup", (event) => {
        const key = event.key;

        if (key === game.keys.hard_drop.type) {
            game.keys.hard_drop.release();
        } else if (key === game.keys.soft_drop.type) {
            game.keys.soft_drop.release();
        } else if (key === game.keys.move_left.type) {
            if (did_move_right) {
                game.keys.move_right.press();
            }

            did_move_left = false;
            game.keys.move_left.release();
        } else if (key === game.keys.move_right.type) {
            if (did_move_left) {
                game.keys.move_left.press();
            }

            did_move_right = false;
            game.keys.move_right.release();
        } else if (key === game.keys.rotate_left.type) {
            game.keys.rotate_left.release();
        } else if (key === game.keys.rotate_right.type) {
            game.keys.rotate_right.release();
        } else if (key === game.keys.hold.type) {
            game.keys.hold.release();
        }
    });

    window.addEventListener("keydown", (event) => {
        const key = event.key;

        if (key === game.keys.hard_drop.type) {
            game.keys.hard_drop.press();
        } else if (key === game.keys.soft_drop.type) {
            game.keys.soft_drop.press();
        } else if (key === game.keys.move_left.type) {
            if (game.keys.move_right.is_pressed()) {
                game.keys.move_right.release();
            }

            did_move_left = true;
            game.keys.move_left.press();
        } else if (key === game.keys.move_right.type) {
            if (game.keys.move_left.is_pressed()) {
                game.keys.move_left.release();
            }

            did_move_right = true;
            game.keys.move_right.press();
        } else if (key === game.keys.rotate_left.type) {
            game.keys.rotate_left.press();
        } else if (key === game.keys.rotate_right.type) {
            game.keys.rotate_right.press();
        } else if (key === game.keys.hold.type) {
            game.keys.hold.press();
        }
    });
}

init();
