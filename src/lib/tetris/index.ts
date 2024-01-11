import * as PIXI from "pixi.js";
import config from "./config";
import Game from "./game";
import { rotate_matrix_counterclockwise } from "../utils/matrix-utils";

const container = document.querySelector(".canvas-container") as HTMLElement;
const sheet = await PIXI.Assets.load("/spritesheet/data.json") as PIXI.Spritesheet;

const tetris_app = new PIXI.Application({
    width: config.display.width,
    height: config.display.height,
    autoDensity: true,
    premultipliedAlpha: true,
    background: "#212121",
});
// @ts-ignore
container.appendChild(tetris_app.view);


function init() {
    const game = new Game(tetris_app, "blocky", "srs");

    game.start();

    let did_rotate_left = false;
    let did_rotate_right = false;
    let did_move_right = false;
    let did_move_left = false;
    let did_hard_drop = false;

    window.addEventListener("keyup", (event) => {
        const key = event.key;

        if (key === game.keys.hard_drop.type) {
            did_hard_drop = false;
            game.keys.hard_drop.release();
        } else if (key === game.keys.soft_drop.type) {
            game.keys.soft_drop.release();
        } else if (key === game.keys.move_left.type) {
            did_move_left = false;
            game.keys.move_left.release();
        } else if (key === game.keys.move_right.type) {
            did_move_right = false
            game.keys.move_right.release();
        } else if (key === game.keys.rotate_left.type) {
            did_rotate_left = false;
            game.keys.rotate_left.release();
        } else if (key === game.keys.rotate_right.type) {
            did_rotate_right = false;
            game.keys.rotate_right.release();
        }
    });

    window.addEventListener("keydown", (event) => {
        const key = event.key;

        if (key === game.keys.hard_drop.type) {
            if (did_hard_drop) {
                return;
            }          
            
            did_hard_drop = true;
            game.keys.hard_drop.press();
        } else if (key === game.keys.soft_drop.type) {
            game.keys.soft_drop.press();
        } else if (key === game.keys.move_left.type) {
            if (did_move_right) {
                did_move_right = false;
                game.keys.move_right.release();
            }

            if (did_move_left) {
                return;
            }

            did_move_left = true;
            game.keys.move_left.press();
        } else if (key === game.keys.move_right.type) {
            if (did_move_left) {
                did_move_left = false;
                game.keys.move_left.release();
            }

            if (did_move_right) {
                return;
            }

            did_move_right = true;
            game.keys.move_right.press();
        } else if (key === game.keys.rotate_left.type) {
            if (did_rotate_right) {
                did_rotate_right = false;
                game.keys.rotate_right.release();
            }

            if (did_rotate_left) {
                return;
            }

            did_rotate_left = true;
            game.keys.rotate_left.press();
        } else if (key === game.keys.rotate_right.type) {
            if (did_rotate_left) {
                did_rotate_left = false;
                game.keys.rotate_left.release();
            }

            if (did_rotate_right) {
                return;
            }

            did_rotate_right = true
            game.keys.rotate_right.press();
        }
    });
}

init();
