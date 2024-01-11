import { tetromino_config } from "../../../config/tetromino";
import type { ImageInfo } from "../../image-info";
import type { ROTATION_DIR } from "../../types";
import { modulo, multiply_and_add_products } from "../../utils/general-utils";
import { rotate_matrix } from "../../utils/matrix-utils";
import type { XY } from "../../xy";

export type TetrominoNames = "I" | "J" | "L" | "O" | "S" | "T" | "Z";
export type TetrominoRotations = -1 | -2 | -3 | 0 | 1 | 2 | 3;
export type TetrominoColors = "cyan" | "blue" | "orange" | "yellow" | "green" | "purple" | "red";

class Tetromino {
    name: TetrominoNames;
    size: number;
    rotation: TetrominoRotations;
    position: XY;
    shape: number[][];
    color: TetrominoColors;
    sprite: ImageInfo;

    constructor(
        name: TetrominoNames,
        shape: number[][],
        position: XY,
        size: number,
        rotation: TetrominoRotations,
        color: TetrominoColors,
        sprite: ImageInfo,
    ) {
        this.name = name;
        this.shape = shape;
        this.position = position;
        this.size = size;
        this.rotation = rotation;
        this.color = color;
        this.sprite = sprite;
    }

    clone_shape(): number[][] {
        return this.shape.map((row) => row.slice());
    }

    clone(): Tetromino {
        return new Tetromino(
            this.name,
            this.clone_shape(),
            this.position.clone(),
            this.size,
            this.rotation,
            this.color,
            this.sprite.clone(),
        );
    }

    rotate(dir: ROTATION_DIR): ThisType<Tetromino> {
        rotate_matrix(dir, this.shape);

        const new_rotation = this.rotation + dir;
        const abs_new_rotation = Math.abs(new_rotation);

        this.rotation = (modulo(abs_new_rotation, tetromino_config.max_rotations) * dir) as TetrominoRotations;

        return this;
    }

    draw(context: CanvasRenderingContext2D): ThisType<Tetromino> {
        if (this.sprite.did_image_load) {
            for (let y = 0; y < this.shape.length; ++y) {
                const row = this.shape[y];

                if (!row) {
                    continue;
                }

                for (let x = 0; x < row.length; ++x) {
                    const num = row[x];

                    if (!num) {
                        continue;
                    }

                    const pos_x = multiply_and_add_products(
                        this.size,
                        this.position.x,
                        x,
                    );
                    const pos_y = multiply_and_add_products(
                        this.size,
                        this.position.y,
                        y,
                    );

                    context.drawImage(
                        this.sprite.image_source,
                        this.sprite.position.x,
                        this.sprite.position.y,
                        this.sprite.size.x,
                        this.sprite.size.y,
                        pos_x,
                        pos_y,
                        this.size,
                        this.size,
                    );
                }
            }
        } else {
            context.fillStyle = this.color;

            for (let y = 0; y < this.shape.length; ++y) {
                const row = this.shape[y];

                if (!row) {
                    continue;
                }

                for (let x = 0; x < row.length; ++x) {
                    const num = row[x];

                    if (!num) {
                        continue;
                    }

                    const pos_x = multiply_and_add_products(
                        this.size,
                        this.position.x,
                        x,
                    );
                    const pos_y = multiply_and_add_products(
                        this.size,
                        this.position.y,
                        y,
                    );


                    context.fillRect(
                        pos_x,
                        pos_y,
                        this.size,
                        this.size,
                    );
                }
            }
        }   
        
        return this;
    }
}

export default Tetromino;
