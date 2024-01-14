import type GameCanvas from "../canvas/canvas";

class TimeEngine {
	private game_canvas: GameCanvas;

	time_elapsed_since_last_drop: number;
	time_elapsed_since_last_move: number;

	constructor(game_canvas: GameCanvas) {
		this.game_canvas = game_canvas;
		this.time_elapsed_since_last_drop = 0;
		this.time_elapsed_since_last_move = 0;
	}

	tick(time: number) {
		this.time_elapsed_since_last_drop += time;
		this.time_elapsed_since_last_move += time;
	}
}

export default TimeEngine;
