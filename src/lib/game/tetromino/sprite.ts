import { XY } from "../../xy";
import type { TetrominoNames } from "./tetromino";

export type Sprites = "shiny" | "block_like";

export const sprite_size = 20;
const spritesheet_spaces = 2;

const sprite_positions: {
    [Property in Sprites]: XY
} = {
    shiny: new XY(0, 0),
    block_like: new XY(0, 1)
}

const sprite_tetromino_positions = {
    O: 0,
    Z: 1,
    S: 2,
    I: 3,
    L: 4,
    J: 5,
    T: 6,
    ghost: 7,
};

export function get_sprite_position(name: TetrominoNames | "ghost", type: keyof typeof sprite_positions) {
    console.log({
        x: sprite_tetromino_positions[name] * (sprite_size + spritesheet_spaces),
        y: sprite_positions[type].y * (sprite_size + spritesheet_spaces),
    })
    return new XY(
        sprite_tetromino_positions[name] * (sprite_size + spritesheet_spaces), 
        sprite_positions[type].y * (sprite_size + spritesheet_spaces),
    );
};
