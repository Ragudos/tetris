import type { KickData } from "../../config/tetromino";
import config from "./config";
import type { Sprites } from "./renderers/main";
import Observer from "./utils/observer";

export default class UserSettings {
	ghost_piece: boolean = true;
	hold: {
		enabled?: boolean;
		infinite?: boolean;
	} = {
		enabled: true,
		infinite: false
	};
	lock: {
		enabled: boolean;
		delay: number;
		max_resets: number;
	} = {
		enabled: true,
		delay: config.lock.delay,
		max_resets: config.lock.max_resets
	};
	kick: KickData  = "srs";
	gravity: {
		type: keyof typeof config.gravity.initial;
	} = {
		type: "relaxed"
	};
	sprite: Sprites = "shiny";

	static readonly key: string = "tetris-settings";

	static observer: Observer<typeof UserSettings.__instance> = new Observer();

	private static __instance: UserSettings;
	private constructor() {
		window.addEventListener("storage", (ev) => {
			if (ev.key === UserSettings.key) {
				this.load_settings();
				UserSettings.observer.subscribers.forEach((subscriber) => {
					subscriber(this);
				});
			}
		});
	}

	static get_instance(): UserSettings {
		if (!UserSettings.__instance) {
			UserSettings.__instance = new UserSettings();
		}

		UserSettings.__instance.load_settings();

		return UserSettings.__instance;
	}

	load_settings(): void {
		const saved_settings = localStorage.getItem(UserSettings.key);
		if (saved_settings) {
			const parsed_settings = JSON.parse(saved_settings);

			for (const key in parsed_settings) {
				if (key in this) {
					let value = this[key as keyof UserSettings];

					if (is_object(value)) {
						value = {
							...value,
							...parsed_settings[key]
						};

						// @ts-ignore
						this[key] = value;
					} else {
						// @ts-ignore
						this[key] = parsed_settings[key];
					}
				}
			}
		}
	}

	update<T extends keyof typeof UserSettings.__instance>(key: T, value: Partial<typeof UserSettings.__instance[T]>): void {
		if (key in UserSettings.__instance) {
			if (key === "lock") {
				// @ts-ignore
				if (value.delay < 10) {
					return;
				}
			}

			if (is_object(this[key])) {
				// @ts-ignore
				if (is_object(value)) {
					// @ts-ignore
					this[key] = {
						// @ts-ignore
						...this[key],
						...value
					};
				}
			} else {
				// @ts-ignore
				this[key] = value
			}
			localStorage.setItem(UserSettings.key, JSON.stringify(this));
		}
	}
}

function is_object(obj: any): obj is object {
	return obj && typeof obj === "object";
}
