import { tetromino_config } from "../config/tetromino";
import GameCanvas from "./game/canvas/canvas";
import storage from "./game/tetromino/storage";
import { default_key_bindings, type KeyBindings } from "./keys";

(function() {
    let game: GameCanvas;
    let interval: number;
    let count = 2;

    interval = setInterval(() => {
        if (count === 0) {
            clearInterval(interval);
            start();
            const countdown = document.querySelector(".countdown-container")! as HTMLElement;
            countdown.style.display = "none";
            return;
        }

        const countdown = document.getElementById("countdown")!;
        countdown.innerText = count.toString();
        count--;
    }, 1000);

    function start() {
        if (game) {
            game.start();
        } else {
            game = new GameCanvas("tetris", storage.get_bag_with_sprite(), tetromino_config.size);
            game.start();
        }

        const saved_key_bindings = localStorage.getItem("key-bindings");

        const raw_key_bindings = saved_key_bindings
            ? JSON.parse(saved_key_bindings) as Partial<KeyBindings>
            : default_key_bindings;
        const key_bindings = { ...default_key_bindings, ...raw_key_bindings };

        let did_rotate_clockwise = false;
        let did_rotate_counterclockwise = false;
        let did_hard_drop = false;

        window.addEventListener("keydown", (event) => {
            const key = event.key;

            if (key === key_bindings.rotate_clockwise.key) {
                if (did_rotate_clockwise) {
                    return;
                }

                did_rotate_clockwise = true;
                game.rotation_engine.rotate(1);
            }

            if (key === key_bindings.rotate_counterclockwise.key) {
                if (did_rotate_counterclockwise) {
                    return;
                }

                did_rotate_counterclockwise = true;
                game.rotation_engine.rotate(-1);
            }

            if (key === key_bindings.hold.key) {
                game.swap_block();
            }

            if (key === key_bindings.move_left.key) {
                game.movement_engine.should_move_left = true;
            }

            if (key === key_bindings.move_right.key) {
                game.movement_engine.should_move_right = true;
            }

            if (key === key_bindings.soft_drop.key) {
                game.drop_engine.soft_drop();
            }

            if (key === key_bindings.hard_drop.key) {
                if (did_hard_drop) {
                    return;
                }

                did_hard_drop = true;
                game.drop_engine.hard_drop();
            }
        });

        window.addEventListener("keyup", (event) => {
            const key = event.key;

            if (key === key_bindings.rotate_clockwise.key) {
                did_rotate_clockwise = false;
            }

            if (key === key_bindings.rotate_counterclockwise.key) {
                did_rotate_counterclockwise = false;
            }

            if (key === key_bindings.hard_drop.key) {
                did_hard_drop = false;
            }

            if (key === key_bindings.move_left.key) {
                game.movement_engine.should_move_left = false;
                game.movement_engine.reset_x_pull();
            }

            if (key === key_bindings.move_right.key) {
                game.movement_engine.should_move_right = false;
                game.movement_engine.reset_x_pull();
            }

            if (key === key_bindings.soft_drop.key) {
                game.drop_engine.stop_soft_drop();
            }

            if (key === key_bindings.pause.key) {
                game.stop();
            }

            if (key === key_bindings.resume.key) {
                game.start();
            }
        });
    }
})();
