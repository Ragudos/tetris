import config from "../config";
import type Game from "../game";
import UserSettings from "../user-settings";
import { get_gravity } from "./formulas";

export default class Drop {
	private __gravity: number | null = config.gravity.initial[UserSettings.get_instance().gravity.type];
	private __gravity_limit: number = 0.2;
	private __soft_drop_gravity: number = Math.round(this.__gravity as number * 0.0075);

	private __game: Game;

	public is_hard_dropping: boolean = false;

	constructor(game: Game) {
		this.__game = game;

        UserSettings.observer.subscribe((settings) => {
            if (settings.gravity.type in config.gravity.initial) {
                const grav = config.gravity.initial[settings.gravity.type];

                if (!grav) {
                    this.__gravity = grav;
                } else {
                    this.__gravity = get_gravity(this.__game.level, grav);
                }

                this.__recalculate_soft_drop_gravity
            }
        });
	}

    /**
     * 
     * @param should_lock Whether or not to lock the block after hard dropping. Useful for static gravity
     */
	hard_drop(should_lock: boolean = true) {
		this.is_hard_dropping = should_lock;

		const block = this.__game.current_tetromino;
		const tmp_pos = block.position.clone();

		if (
			this.__game.screen.is_colliding_up(tmp_pos, block.shape, 2) &&
			this.__game.screen.is_colliding_down(tmp_pos, block.shape, 1)
		) {
			this.__game.gameover();
			return;
		}

		while (!this.__game.screen.is_colliding_down(tmp_pos, block.shape, 1)) {
			tmp_pos.y += 1;
		}

		block.position.y = tmp_pos.y;
        if (should_lock) {
            this.is_hard_dropping = false;
            this.__game.lock_current_block();
        }
	}

	soft_drop(): boolean {
		return this.__game.keys.soft_drop.is_triggered();
	}

	private __recalculate_soft_drop_gravity(): void {
        if (!this.__gravity) {
            return;
        }

		let divider;

		if (this.__gravity > 50) {
			divider = 0.0075;
		} else if (this.__gravity <= 50 && this.__gravity > 15) {
			divider = 0.0175;
		} else {
			divider = 0.25;
		}

		this.__soft_drop_gravity = Math.round(this.__gravity * divider);
	}

	get soft_drop_gravity(): number {
		return this.__soft_drop_gravity;
	}

	get gravity(): number | null {
		return this.__gravity;
	}

	set gravity(new_grav: number) {
		if (new_grav < this.__gravity_limit) {
			throw new Error(
				"Gravity cannot be less than " + this.__gravity_limit,
			);
		}

		this.__gravity = new_grav;
		this.__recalculate_soft_drop_gravity();
	}
}
