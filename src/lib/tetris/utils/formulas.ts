import config from "../config";

export function get_gravity(level: number, current_gravity: number): number {
	return Math.round(
		current_gravity -
			level * config.gravity.decrement_per_level * current_gravity,
	);
}

export function get_time_ease_out(t: number) {
	return t * t * (3 - 2 * t);
}
