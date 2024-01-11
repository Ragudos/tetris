import config from "../config";

export interface KeyBindings {
    move_left: string;
    move_right: string;
    soft_drop: string;
    hard_drop: string;
    rotate_left: string;
    rotate_right: string;
}

export const DEFAULT_KEYS = {
    "move_left": "ArrowLeft",
    "move_right": "ArrowRight",
    "soft_drop": "ArrowDown",
    "hard_drop": " ",
    "rotate_left": "Ctrl",
    "rotate_right": "ArrowUp",
} as const;

export default class Key {
    readonly type: string;
    readonly action: string;
    
    private __pressed: boolean = false;
    private __num_of_resets: number = 0;
    private __timer: number = 0;

    constructor(action: keyof typeof DEFAULT_KEYS, custom_key?: string) {
        this.action = action;
        this.type = custom_key || DEFAULT_KEYS[action];
    }

    is_triggered(): boolean {
        if (!this.__pressed) {
            return false;
        }

        // If the key is pressed for the first time, we return true since
        // we only want to trigger these once.
        if (
            (this.action === "rotate_left" ||
            this.action === "rotate_right" ||
            this.action === "hard_drop")
        ) {
            if (this.__timer === 0) {
                this.__timer -= 1;
                return true;
            }

            return false;
        }

        this.__timer -= 1;

        if (this.__timer > 0) {
            return false;
        }

        this.__timer = (this.__num_of_resets > 0)
            ? config.controls.delay
            : config.controls.initial_delay;
        this.__num_of_resets += 1;

        return true;
    }

    press(): void {
        this.__pressed = true;
    }

    release(): void {
        this.__pressed = false;
        this.__num_of_resets = 0;
        this.__timer = 0;
    }
}
