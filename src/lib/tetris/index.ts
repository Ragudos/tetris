import * as PIXI from "pixi.js";
import Game from "./game";

(await PIXI.Assets.load(
	"/spritesheet/data.json",
)) as PIXI.Spritesheet;

function init() {
	let resize_timeout: number | undefined;
	const resize_delay = 1000;
	
	const tetris_app = new PIXI.Application({
		autoDensity: true,
		premultipliedAlpha: true,
		backgroundAlpha: 0,
		resizeTo: window,
		antialias: true
	});
	
	// @ts-ignore
	document.body.appendChild(tetris_app.view);

	const game = new Game(tetris_app, "blocky", "srs", {}); 

	game.start();

	let did_move_right = false;
	let did_move_left = false;

	window.addEventListener("resize", () => {
		if (resize_timeout) {
			clearTimeout(resize_timeout);
		}

		// Implement soon
		resize_timeout = setTimeout(() => {}, resize_delay);
	});

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
