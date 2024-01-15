import * as PIXI from "pixi.js";
import Game from "./game";
import tetris_events, { type TetrisEventsMap } from "./events";
import Sound from "../sound";
import { get_gravity } from "./utils/formulas";
import UserSettings from "./user-settings";

(await PIXI.Assets.load(
	"/spritesheet/data.json",
)) as PIXI.Spritesheet;

const points_table = {
	1: 40,
	2: 100,
	3: 300,
	4: 1200,
}

PIXI.settings.RESOLUTION = window.devicePixelRatio || 1;

function init() {
	const saved_highscore = localStorage.getItem("tetris-highscore");
	
	if (saved_highscore) {
		const parsed_highscore = JSON.parse(saved_highscore);

		if (!isNaN(parsed_highscore.level)) {
			document.getElementById("highest-level")!.textContent = parsed_highscore.level;
		}

		if (!isNaN(parsed_highscore.score)) {
			document.getElementById("highest-score")!.textContent = parsed_highscore.score
		}
	}

	document.getElementById("game-over")!.setAttribute("hidden", "true");
	document.getElementById("score")!.textContent = "0";
	document.getElementById("level")!.textContent = "1";	
	
	const tetris_app = new PIXI.Application({
		autoDensity: true,
		backgroundAlpha: 0,
		resizeTo: document.getElementById("tetris-container")!,
		powerPreference: "high-performance",
		antialias: true,
	});

	// @ts-ignore
	document.getElementById("tetris-container")!.appendChild(tetris_app.view);

	let game: null | Game = new Game(tetris_app, UserSettings.get_instance().sprite, UserSettings.get_instance().kick, {}); 

	game.start();

	let did_move_right = false;
	let did_move_left = false;

	const line_clear_function = line_clear();
	const lock_function = lock();
	const hold_function = hold();

	tetris_app.view?.addEventListener?.("focusout", () => {
		console.log("outfocus")
	})

	window.addEventListener("keydown", keydown_handler);
	window.addEventListener("keyup", keyup_handler);
	tetris_events.addEventListener("tetris:lock", lock_function);
	tetris_events.addEventListener("tetris:hold", hold_function);
	tetris_events.addEventListener("tetris:clear", line_clear_function);
	tetris_events.addEventListener("tetris:gameover", cleanup);

	function keydown_handler(event: KeyboardEvent) {
		if (!game) {
			return;
		}

		const key = event.key;

		if (key === " " || key === "ArrowDown") {
			event.preventDefault();
		}

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
	}

	function keyup_handler(event: KeyboardEvent) {
		if (!game) {
			return;
		}

		const key = event.key;

		if (key === " " || key === "ArrowDown") {
			event.preventDefault();
		}

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
	}
	
	function lock() {
		let lock_sound: undefined | Sound;

		return function (data: TetrisEventsMap["tetris:lock"]) {
			if (lock_sound) {
				lock_sound.play();
			} else {
				lock_sound = new Sound("/sfx/lock.mp3", new AudioContext());
				lock_sound.load().then(() => {
					lock_sound?.play();
				});
			}
		}
	}

	function hold() {
		let hold_sound: undefined | Sound;

		return function (data: TetrisEventsMap["tetris:hold"]) {
			if (hold_sound) {
				hold_sound.play(0.5);
			} else {
				hold_sound = new Sound("/sfx/hold-sfx.mp3", new AudioContext());
				hold_sound.load().then(() => {
					hold_sound?.play(0.5);
				});
			}
		}
	}

	function line_clear() {
		let lines_cleared = 0;
		let level = 1;
		let tracker = 0;

		let clear_sound: undefined | Sound;
		let level_sound: undefined | Sound;

		return function(data: TetrisEventsMap["tetris:clear"]) {
			if (!game) {
				return;
			}

			if (clear_sound) {
				clear_sound.play()
			} else {
				clear_sound = new Sound("/sfx/clear.mp3", new AudioContext());
				clear_sound.load().then(() => {
					clear_sound?.play();
				});
			}

			let lines = data.detail.lines;

			lines_cleared += lines;
			tracker += lines;

			if (tracker >= 10) {
				level += 1;

				if (level_sound) {
					level_sound.play();
				} else {
					level_sound = new Sound("/sfx/Level.wav", new AudioContext());
					level_sound.load().then(() => {
						level_sound?.play();
					});
				}

				tracker = tracker - 10;
				document.getElementById("level")!.textContent = level.toString();
				if (game.gravity) {
					game.gravity = get_gravity(level, game.gravity);
				}
			}

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
		}
	}

	function cleanup() {
		if (saved_highscore) {
			const parsed_highscore = JSON.parse(saved_highscore);

			if (!isNaN(parsed_highscore.level)) {
				const curr_level = parseInt(document.getElementById("level")!.textContent!);
				if (parsed_highscore.level < curr_level) {
					parsed_highscore.level = curr_level;
				}
			}

			if (!isNaN(parsed_highscore.score)) {
				const curr_score = parseInt(document.getElementById("score")!.textContent!);
				if (parsed_highscore.score < curr_score) {
					parsed_highscore.score = curr_score;
				}
			}

			localStorage.setItem("tetris-highscore", JSON.stringify(parsed_highscore));
		} else {
			const curr_level = parseInt(document.getElementById("level")!.textContent!);
			const curr_score = parseInt(document.getElementById("score")!.textContent!);

			localStorage.setItem("tetris-highscore", JSON.stringify({
				level: curr_level,
				score: curr_score,
			}));
		}

		document.getElementById("tetris-container")!.innerHTML = "";
		document.getElementById("game-over")!.removeAttribute("hidden");

		if (game) {
			game.renderer.destroy();
			game.swap_renderer.destroy();
			game.next_renderer.destroy();

			game = null;
		}

		tetris_app.destroy();
		window.removeEventListener("keydown", keydown_handler);
		window.removeEventListener("keyup", keyup_handler);
		tetris_events.removeEventListener("tetris:hold", hold_function);
		tetris_events.removeEventListener("tetris:lock", lock_function);
		tetris_events.removeEventListener("tetris:clear", line_clear_function);
		tetris_events.removeEventListener("tetris:gameover", cleanup);
	}
}

init();

document.getElementById("restart")!.addEventListener("click", init);
