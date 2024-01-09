import type { GameCanvasBase } from "../canvas/canvas";

class TimeEngine {
	private game_canvas: GameCanvasBase;

	time_elapsed_since_last_drop: number;
	time_elapsed_since_last_move: number;
	time_elapsed_since_start: number;

	constructor(game_canvas: GameCanvasBase) {
		this.game_canvas = game_canvas;
		this.time_elapsed_since_last_drop = 0;
		this.time_elapsed_since_last_move = 0;
		this.time_elapsed_since_start = 0;
	}

	tick(time: number) {
		const delta = Math.round(time - this.time_elapsed_since_start);

		this.time_elapsed_since_start = time;
		this.time_elapsed_since_last_drop += delta;
		this.time_elapsed_since_last_move += delta;
	}
}

export default TimeEngine;
