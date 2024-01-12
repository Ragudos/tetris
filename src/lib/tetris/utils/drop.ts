import type Game from "../game";

export default class Drop {
    private __gravity: number = 100;
    private __gravity_limit: number = 1;
    private __soft_drop_gravity: number = Math.round(this.__gravity * 0.0075);

    private __game: Game;

    public is_hard_dropping: boolean = false;

    constructor(game: Game) {
        this.__game = game;
    }

    hard_drop() {
        this.is_hard_dropping = true;

        const block = this.__game.current_tetromino;
        const tmp_pos = block.position.clone();

        if (this.__game.screen.is_colliding(
            block.position,
            block.shape,
            0, 1, 0, 1
        )) {
            console.log("colliding above");
        }

        while (
            !this.__game.screen.is_colliding(
                tmp_pos,
                block.shape,
                0, 0, 0, 1
            )
        ) {
            tmp_pos.y += 1;
        }

        block.position.y = tmp_pos.y;
        this.__game.lock_current_block();
        this.is_hard_dropping = false;
    }

    soft_drop(): boolean {
        return this.__game.keys.soft_drop.is_triggered();
    }

    private __recalculate_soft_drop_gravity(): void {
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
