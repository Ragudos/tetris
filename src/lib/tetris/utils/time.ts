import type Game from "../game";

class Time {
	public time_since_last_drop: number = 0;
	public time_since_lock_delay_started: number = 0;
	public time_since_last_movement = 0;

	private __game: Game;

	constructor(game: Game) {
		this.__game = game;
	}

	tick(dt: number): void {
		this.time_since_last_drop += dt;
	}
}

export default Time;
