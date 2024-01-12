import * as PIXI from "pixi.js";
import Renderer, { type Sprites } from "./renderer";
import Screen from "./screen";
import TetrominoBag from "./tetromino/bag";
import { XY } from "../xy";
import Time from "./utils/time";
import Key, { DEFAULT_KEYS, type KeyBindings } from "./utils/key";
import Drop from "./utils/drop";
import Lock from "./utils/lock";
import type { ROTATION_DIR } from "../types";
import { rotate_matrix } from "../utils/matrix-utils";
import { srs_kick_data, type KickData } from "../../config/tetromino";
import config from "./config";
import Tetromino from "./tetromino";
import type UserSettings from "./user-settings";

export type GameStates = "running" | "paused" | "gameover";

export default class Game {
    private __app: PIXI.Application;
    private __renderer: Renderer;

    private __bag: TetrominoBag
    private __current_tetromino: Tetromino;
    private __next_tetromino: Tetromino;
    private __swapped_tetromino: null | Tetromino = null;

    private __screen: Screen = new Screen();
    private __time_storage: Time = new Time(this);
    private __lock: Lock = new Lock(this);
    private __drop: Drop = new Drop(this);

    private __keys: {
        [key in keyof KeyBindings]: Key
    };

    public state: GameStates = "paused";

    private __can_swap: boolean;

    public ghost_y: number = 18;

    constructor(app: PIXI.Application, sprite_style: Sprites, kick_data: KickData, key_bindings?: Partial<KeyBindings>, user_setting?: UserSettings) {
        this.__app = app;
        this.__renderer = new Renderer(sprite_style);
        this.__bag = new TetrominoBag(
            [
                new Tetromino("I", kick_data, new XY(0, 0), 0),
                new Tetromino("J", kick_data, new XY(0, 0), 0),
                new Tetromino("L", kick_data, new XY(0, 0), 0),
                new Tetromino("O", kick_data, new XY(0, 0), 0),
                new Tetromino("S", kick_data, new XY(0, 0), 0),
                new Tetromino("T", kick_data, new XY(0, 0), 0),
                new Tetromino("Z", kick_data, new XY(0, 0), 0),
            ]
        );

        this.__current_tetromino = this.__bag.tetromino;
        this.__next_tetromino = this.__bag.tetromino;

        this.__current_tetromino.position.x = config.base_position.x;
        this.__current_tetromino.position.y = config.base_position.y;

        this.__keys = {
            move_left: new Key("move_left", key_bindings?.move_left || DEFAULT_KEYS.move_left),
            move_right: new Key("move_right", key_bindings?.move_right || DEFAULT_KEYS.move_right),
            rotate_left: new Key("rotate_left", key_bindings?.rotate_left || DEFAULT_KEYS.rotate_left),
            rotate_right: new Key("rotate_right", key_bindings?.rotate_right || DEFAULT_KEYS.rotate_right),
            soft_drop: new Key("soft_drop", key_bindings?.soft_drop || DEFAULT_KEYS.soft_drop),
            hard_drop: new Key("hard_drop", key_bindings?.hard_drop || DEFAULT_KEYS.hard_drop),
            hold: new Key("hold", key_bindings?.hold || DEFAULT_KEYS.hold),
        };

        this.__can_swap = true;
    }

    start() {
        if (this.state === "running" || this.state === "gameover") {
            return;
        }

        this.state = "running";

        this.__app.ticker.add(this.__update, this);
        this.__app.stage.addChild(this.__renderer);
        this.recalculate_ghost_y();
    }

    private __move_down(): void {
        if (this.__screen.is_colliding_down(
            this.__current_tetromino.position,
            this.__current_tetromino.shape,
            1
        )) {
            this.__lock.start_locking();

            return;
        }

        this.__time_storage.time_since_last_drop = 0;
        this.__current_tetromino.position.y += 1;

        if (this.__screen.is_colliding_down(
            this.__current_tetromino.position,
            this.__current_tetromino.shape,
            1
        )) {
            this.__lock.start_locking();

            return;
        }
    }

    private __move_left(): void {
        if (
            this.__screen.is_colliding_left(
                this.__current_tetromino.position,
                this.__current_tetromino.shape,
                1
            )
        ) {
            return;
        }

        this.__current_tetromino.position.x -= 1;
        this.recalculate_ghost_y();
    }

    private __move_right(): void {
        if (
            this.__screen.is_colliding_right(
                this.__current_tetromino.position,
                this.__current_tetromino.shape,
                1
            )
        ) {
            return;
        }

        this.__current_tetromino.position.x += 1;
        this.recalculate_ghost_y();
    }

    private __srs_rotation(dir: ROTATION_DIR): void {
        const tmp_shape = this.__current_tetromino.clone_shape();
        const add_8 = this.__current_tetromino.name === "I" ? 8 : 0;

        rotate_matrix(dir, tmp_shape);

        for (let y = 0; y < tmp_shape.length; ++y) {
            const row = tmp_shape[y];

            if (!row) {
                continue;
            }

            for (let x = 0; x < row.length; ++x) {
                if (!row) {
                    continue;
                }

                const abs_next_rotation = Math.abs(this.__current_tetromino.rotation + dir);

                let kick_idx: number;

                switch (dir) {
                    case -1:
                        {
                            kick_idx = add_8 + (abs_next_rotation % 4) + 4;
                        }
                        break;
                    case 1:
                        {
                            kick_idx = add_8 + (abs_next_rotation % 4);
                        }
                        break;
                }

                for (let kick = 0; kick < srs_kick_data[0]!.length; ++kick) {
                    const kick_data = srs_kick_data[kick_idx]![kick]!;
                    const new_pos_x = this.__current_tetromino.position.x + kick_data[0]!;
                    const new_pos_y = this.__current_tetromino.position.y + kick_data[1]! * -1;

                    const new_xy = new XY(new_pos_x, new_pos_y);

                    if (
                        this.__screen.is_colliding(
                            new_xy,
                            tmp_shape,
                            0, 0, 0, 0
                        )
                    ) {
                        continue;
                    }

                    if (this.__lock.is_locked) {
                        this.__lock.reset_lock();
                    }

                    this.__current_tetromino.position.x = new_pos_x;
                    this.__current_tetromino.position.y = new_pos_y;
                    this.__current_tetromino.rotate(dir);

                    break;
                }

                return;
            }
        }
    }

    private __rotate(dir: ROTATION_DIR): void {
        if (this.__current_tetromino.name === "O") {
            return;
        }

        if (!this.__lock.can_reset && this.__lock.is_locked) {
            return;
        }

        switch (this.__current_tetromino.kick_data) {
            case "srs":
                this.__srs_rotation(dir);
                break;
        }

        this.recalculate_ghost_y();

    }

    private __update_time(dt: number): void {
        this.__time_storage.tick(dt);

        if (this.__lock.is_locked) {
            this.__time_storage.time_since_lock_delay_started += dt;
        }
    }

    private __swap_block(): void {
        if (!this.__can_swap) {
            return;
        }

        if (!this.__swapped_tetromino) {
            this.__swapped_tetromino = this.__current_tetromino;
            this.__swapped_tetromino.reset_rotation();
            this.__swapped_tetromino.position.x = 0;
            this.__swapped_tetromino.position.y = 0;
        
            this.__next_tetromino.position.x = config.base_position.x;
            this.__next_tetromino.position.y = config.base_position.y;

            this.__current_tetromino = this.__next_tetromino;         

            this.__next_tetromino = this.__bag.tetromino;   
        } else {
            const tmp = this.__swapped_tetromino;
            this.__swapped_tetromino = this.__current_tetromino;
            this.__swapped_tetromino.reset_rotation();
            this.__swapped_tetromino.position.x = 0;
            this.__swapped_tetromino.position.y = 0;

            this.__current_tetromino = tmp;
            this.__current_tetromino.position.x = config.base_position.x;
            this.__current_tetromino.position.y = config.base_position.y;
        }

        this.__lock.stop_locking();
        this.recalculate_ghost_y();

        this.__can_swap = false;
    }

    private __update_tetromino(_dt: number): void {
        // Let the hard drop finish
        if (this.__drop.is_hard_dropping) {
            return;
        }

        if (this.__keys.hard_drop.is_triggered()) {
            this.__drop.hard_drop();

            return;
        }

        if (!this.__lock.is_locked) {
            if (this.__drop.soft_drop()) {
                if (this.__time_storage.time_since_last_drop >= this.__drop.soft_drop_gravity) {
                    this.__move_down();
                }
            } else if (this.__time_storage.time_since_last_drop >= this.__drop.gravity) {
                this.__move_down();
            }
        } else {
            if (this.__time_storage.time_since_lock_delay_started >= this.__lock.lock_delay) {
                if (this.__screen.is_colliding(
                    this.__current_tetromino.position,
                    this.__current_tetromino.shape,
                    0, 0, 0, 0
                )) {
                    this.state = "gameover";
                    console.log("gameover");
                    return;
                }

                if (!this.__screen.is_colliding_down(
                    this.__current_tetromino.position,
                    this.__current_tetromino.shape,
                    1
                )) {
                    this.__move_down();
                    return;
                }

                this.lock_current_block(); 

                return;
            }
        }
            
        if (this.__keys.move_left.is_triggered()) {
            if (!this.__lock.can_reset && this.__lock.is_locked) {
                return;
            }

            this.__move_left();

            if (
                this.__lock.is_locked &&
                this.__lock.can_reset
            ) {
                this.__lock.reset_lock();
            }
        }
        
        if (this.__keys.move_right.is_triggered()) {
            if (!this.__lock.can_reset && this.__lock.is_locked) {
                return;
            }

            this.__move_right();

            if (
                this.__lock.is_locked &&
                this.__lock.can_reset
            ) {
                this.__lock.reset_lock();
            }
        }
        
        if (this.__keys.rotate_left.is_triggered()) {
            this.__rotate(-1);

            if (
                this.__lock.is_locked &&
                this.__lock.can_reset
            ) {
                this.__lock.reset_lock();
            }
        } else if (this.__keys.rotate_right.is_triggered()) {
            this.__rotate(1);
            if (
                this.__lock.is_locked &&
                this.__lock.can_reset
            ) {
                this.__lock.reset_lock();
            }
        }
        
        if (this.__keys.hold.is_triggered()) {
            this.__swap_block();
        }
    }

    private __update(dt: number) {
        if (this.state !== "running") {
            return;
        }

        this.__update_time(dt);
        if (this.__current_tetromino.position.y <= 2) {
            this.__renderer.update_overflow();
        }

        this.__update_tetromino(dt);
        this.__renderer.update_screen(this.__screen);
        this.__renderer.update_ghost(this.ghost_y, this.__current_tetromino);
        this.__renderer.update_tetromino(this.__current_tetromino);

        if (this.__lock.is_locked) {
            this.__renderer.flicker_block(dt, this.__current_tetromino);
        }
    }

    recalculate_ghost_y(): void {
        const tmp_pos = this.__current_tetromino.position.clone();

        while (
            !this.__screen.is_colliding_down(
                tmp_pos,
                this.__current_tetromino.shape,
                1
            )
        ) {
            tmp_pos.y += 1;
        }

        this.ghost_y = tmp_pos.y;
    }

    spawn_new_tetromino(): void {
        this.__next_tetromino.position.x = 4;
        this.__next_tetromino.position.y = 0;
        
        this.__current_tetromino = this.__next_tetromino;
        this.__next_tetromino = this.__bag.tetromino;

        this.__can_swap = true;
    }

    lock_current_block(): void {
        this.__screen.occupy_grid(this.__current_tetromino);
        this.__renderer.reset_flicker();
        this.__renderer.brighten_block();
        this.spawn_new_tetromino();
        this.__lock.stop_locking();
        this.__screen.clear_rows();
        this.recalculate_ghost_y();
        this.__time_storage.time_since_last_drop = 0;
    }

    get renderer() {
        return this.__renderer;
    }

    get time_storage(): Time {
        return this.__time_storage;
    }

    get keys() {
        return this.__keys;
    }

    get current_tetromino() {
        return this.__current_tetromino;
    }

    get screen() {
        return this.__screen;
    }

    get lock() {
        return this.__lock;
    }
}
