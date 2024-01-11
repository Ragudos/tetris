import type Game from "../game";

export default class Drop {
    private __gravity: number = 10;
    private __gravity_limit: number = 10;
    private __soft_drop_gravity: number = Math.round(this.__gravity * 0.25);

    private __game: Game;

    public is_hard_dropping: boolean = false;

    constructor(game: Game) {
        this.__game = game;
    }

    hard_drop() {
    }

    soft_drop(): boolean {
        return this.__game.keys.soft_drop.is_triggered();
    }

    private __recalculate_soft_drop_gravity(): void {
        this.__soft_drop_gravity = Math.round(this.__gravity * 0.25);
    }

    get soft_drop_gravity(): number {
        return this.__soft_drop_gravity;
    }

    get gravity(): number {
        return this.__gravity;;
    }

    set gravity(new_grav: number) {
        if (new_grav < this.__gravity_limit) {
            throw new Error("Gravity cannot be less than " + this.__gravity_limit);
        }

        this.__gravity = new_grav;
        this.__recalculate_soft_drop_gravity();
    }
}
