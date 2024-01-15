import config from "../config";

export interface KeyBindings {
	move_left: string;
	move_right: string;
	soft_drop: string;
	hard_drop: string;
	rotate_left: string;
	rotate_right: string;
	hold: string;
}

export const DEFAULT_KEYS: {
	[key in keyof KeyBindings]: string;
} = {
	move_left: "ArrowLeft",
	move_right: "ArrowRight",
	soft_drop: "ArrowDown",
	hard_drop: " ",
	rotate_left: "Control",
	rotate_right: "ArrowUp",
	hold: "Shift",
} as const;

export default class Key {
	readonly type: string;
	readonly action: string;

	private __pressed: boolean = false;
	private __did_trigger_once = false;
	private __num_of_repeats = 0;
	private __counter = 0;

	constructor(action: keyof typeof DEFAULT_KEYS, custom_key?: string) {
		this.action = action;
		this.type = custom_key || DEFAULT_KEYS[action];
	}

	is_triggered(): boolean {
		if (!this.__pressed) {
			return false;
		}

		if (
			this.action === "rotate_left" ||
			this.action === "rotate_right" ||
			this.action === "hard_drop" ||
			this.action === "hold"
		) {
			if (this.__did_trigger_once) {
				return false;
			}
		}

		if (this.__pressed) {
			this.__did_trigger_once = true;
		}

		this.__counter -= 1;

		if (this.__counter <= 0) {
			this.__counter =
				this.__num_of_repeats > 0
					? config.controls.delay
					: config.controls.initial_delay;

			this.__num_of_repeats += 1;

			return true;
		}

		return false;
	}

	press(): void {
		this.__pressed = true;
	}

	release(): void {
		this.__pressed = false;
		this.__did_trigger_once = false;
		this.__counter = 0;
		this.__num_of_repeats = 0;
	}

	is_pressed() {
		return this.__pressed;
	}

	get did_trigger_once() {
		return this.__did_trigger_once;
	}
}
