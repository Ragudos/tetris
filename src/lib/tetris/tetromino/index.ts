import type { ROTATION_DIR } from "../../types";
import { modulo } from "../../utils/general-utils";
import { rotate_matrix } from "../../utils/matrix-utils";
import type { XY } from "../../xy";

export type TetrominoNames = "I" | "J" | "L" | "O" | "S" | "T" | "Z";
export type KickData = "srs";

export const max_rotations = 4;

export const tetromino_colors: {
    [Property in TetrominoNames]: string
} = {
    "I": "00ffff",
    "J": "0000ff",
    "L": "ffa500",
    "O": "ffff00",
    "S": "00ff00",
    "T": "800080",
    "Z": "ff0000",
};

const tetromino_default_rotations: {
    [Property in KickData]: {
        [Property in TetrominoNames]: number[][]
    }
} = {
    srs: {
        "I": [
            [0, 0, 0, 0],
            [1, 1, 1, 1],
            [0, 0, 0, 0],
            [0, 0, 0, 0],
        ],
        "J": [
            [1, 0, 0],
            [1, 1, 1],
            [0, 0, 0],
        ],
        "L": [
            [0, 0, 1],
            [1, 1, 1],
            [0, 0, 0],
        ],
        "O": [
            [1, 1],
            [1, 1],
        ],
        "S": [
            [0, 1, 1],
            [1, 1, 0],
            [0, 0, 0],
        ],
        "T": [
            [0, 1, 0],
            [1, 1, 1],
            [0, 0, 0],
        ],
        "Z": [
            [1, 1, 0],
            [0, 1, 1],
            [0, 0, 0],
        ],
    }   
}

export default class Tetromino {
    readonly name: TetrominoNames;
    /**
     * Readonly as we dont want to change the reference and only
     * rotate the tetromino by changing the positions of 1s and 0s.
     */
    readonly shape: number[][];
    readonly color: string;
    /**
     * Readonly as we dont want to change the reference and only
     * set the new x and y when changing posisions.
     */
    readonly position: XY;

    private __rotation: number;
    private __kick_data: KickData;

    constructor(name: TetrominoNames, kick_data: KickData, initial_position: XY, initial_rotation: number) {
        this.name = name;
        this.__kick_data = kick_data;
        this.shape = tetromino_default_rotations[kick_data][name].map((row) => row.slice());
        this.color = tetromino_colors[name];
        this.position = initial_position;
        this.__rotation = initial_rotation;
    }

    rotate(dir: ROTATION_DIR): void {
        rotate_matrix(dir, this.shape);

        const new_rotation = this.__rotation + dir;
        const abs_new_rotation = Math.abs(new_rotation);

        this.__rotation = (modulo(abs_new_rotation, max_rotations)) * dir;
    }

    clone(): Tetromino {
        return new Tetromino(this.name, this.__kick_data, this.position.clone(), this.__rotation);
    }
    
    clone_shape(): number[][] {
        return this.shape.map((row) => row.slice());
    }

    get rotation(): number {
        return this.__rotation;
    }

    get kick_data(): KickData {
        return this.__kick_data;
    }
}
