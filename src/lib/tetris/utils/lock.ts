import config from "../config";
import type Game from "../game";

export default class Lock {
    private __game: Game;
    private __is_locked: boolean = false;
    private __num_of_resets: number = 0;
    public lock_delay: number = config.lock.delay;

    constructor(game: Game) {
        this.__game = game;
    }

    start_locking(): void {
        this.__is_locked = true;
    }

    /**
     * Only use once we get a new block.
     */
    stop_locking(): void { 
        this.__is_locked = false;
        this.__num_of_resets = 0;
        this.__game.time_storage.time_since_lock_delay_started = 0;
    }

    reset_lock(): void {
        if (this.__num_of_resets >= config.lock.max_resets) {
            return;
        }

        this.__game.time_storage.time_since_last_drop = 0;
        this.__is_locked = false;
        this.__num_of_resets += 1;
        this.__game.time_storage.time_since_lock_delay_started = 0;
        this.__game.renderer.reset_flicker();
        this.__game.renderer.brighten_block();
    }

    get is_locked(): boolean {
       return this.__is_locked; 
    }

    get can_reset(): boolean {
        return this.__num_of_resets < config.lock.max_resets;
    }
}
