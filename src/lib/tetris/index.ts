import * as PIXI from "pixi.js";
import Game from "./game";
import tetris_events from "./events";
import Sound from "../sound";
import { get_gravity } from "./utils/formulas";

(await PIXI.Assets.load(
	"/spritesheet/data.json",
)) as PIXI.Spritesheet;

const points_table = {
	1: 40,
	2: 100,
	3: 300,
	4: 1200,
}

function init() {
	PIXI.settings.RESOLUTION = window.devicePixelRatio || 1;

	const tetris_app = new PIXI.Application({
		autoDensity: true,
		backgroundAlpha: 0,
		resizeTo: document.getElementById("tetris-container")!
	});

	// @ts-ignore
	document.getElementById("tetris-container")!.appendChild(tetris_app.view);

	const game = new Game(tetris_app, "blocky", "srs", {}); 

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

	let lock_sound: undefined | Sound;
	let hold_sound: undefined | Sound;

	tetris_events.addEventListener("tetris:lock", () => {
		if (lock_sound) {
			lock_sound.play();
		} else {
			lock_sound = new Sound("/sfx/lock.mp3", new AudioContext());
			lock_sound.load().then(() => {
				lock_sound?.play();
			});
		}
	});

	tetris_events.addEventListener("tetris:hold", (data) => {
		console.log(data);

		if (hold_sound) {
			hold_sound.play();
		} else {
			hold_sound = new Sound("/sfx/hold-sfx.mp3", new AudioContext());
			hold_sound.load().then(() => {
				hold_sound?.play();
			});
		}
	});

	let lines_cleared = 0;
	let level = 1;
	let tracker = 0;

	tetris_events.addEventListener("tetris:clear", (data) => {
		let  lines = data.detail.lines;

		lines_cleared += lines;
		tracker += lines;

		if (tracker >= 10) {
			level += 1;
			tracker = 0;
			document.getElementById("level")!.textContent = level.toString();
			if (game.gravity) {
				game.gravity = get_gravity(level, game.gravity);
			}
		}

		console.log(lines_cleared, lines_cleared % 10);

		let points = 0;

		if (lines === 4) {
			points = points_table[lines] * level;
		} else {
			while (lines > 0) {
				if (lines > 4) {
					points += points_table[4] * level;
				} else {
					points += points_table[lines as keyof typeof points_table] * level;
				}
				lines -= 4;
			}
		}

		const curr_score = parseInt(document.getElementById("score")!.textContent!);
		document.getElementById("score")!.textContent = (curr_score + points).toString();
	});

	tetris_events.addEventListener("tetris:game_over", () => {
		tetris_app.stop();
		tetris_app.destroy(true);
	});
}

init();
