import type { XY } from "../xy";
import config from "./config";
import type Tetromino from "./tetromino";

class Screen {
    private __rows: number = config.screen.rows;
    private __columns: number = config.screen.columns;

    /**
     * The overall grid.
     */
    readonly grid: (null | Tetromino)[][];

    constructor() {
        this.grid = new Array(this.__rows).fill(null).map(() => new Array(this.__columns).fill(null));
    }

    /**
     * 
     * @param position The position to check for collision.
     * @param shape The shape of a tetromino to check for collision.
     * @param offset_left The offset to check for collision.
     * @default 0
     * @param offset_top The offset to check for collision.
     * @default 0
     * @param offset_right The offset to check for collision.
     * @default 0
     * @param offset_bottom The offset to check for collision.
     * @default 0
     */
    is_colliding(position: XY, shape: number[][],  offset_left: number = 0, offset_top: number = 0, offset_right: number = 0, offset_bottom: number = 0): boolean {
        for (let y = 0; y < shape.length; ++y) {
            const row = shape[y];
            
            if (!row) {
                continue;
            }

            for (let x = 0; x < row.length; ++x) {
                const item = row[x];
                
                if (!item) {
                    continue;
                }

                const real_y = position.y + y;
                const real_x = position.x + x;

                // -4 for more allowance in rotating blocks
                if (
                    real_x - offset_left < 0 ||
                    real_x + offset_right >= this.__columns ||
                    real_y + offset_bottom >= this.__rows ||
                    real_y - offset_top < -4 ||
                    (this.grid[real_y + offset_bottom] && (
                        this.grid[real_y + offset_bottom]![real_x] !== null) ||
                    (this.grid[real_y - offset_top] && (
                        this.grid[real_y - offset_top]![real_x] !== null) 
                    ))
                ) {
                    return true;
                }
            }
        }

        return false;
    }

    is_colliding_down(position: XY, shape: number[][], offset: number = 0): boolean {
        for (let y = 0; y < shape.length; ++y) {
            const row = shape[y];
            
            if (!row) {
                continue;
            }

            for (let x = 0; x < row.length; ++x) {
                const item = row[x];
                
                if (!item) {
                    continue;
                }

                const real_y = position.y + y;

                if (
                    real_y + offset  >= this.__rows ||
                    (this.grid[real_y + offset] && 
                        this.grid[real_y + offset]![position.x + x] !== null)
                ) {
                    return true;
                }
            }
        }

        return false;
    }

    is_colliding_left(position: XY, shape: number[][], offset: number = 0): boolean {
        for (let y = 0; y < shape.length; ++y) {
            const row = shape[y];
            
            if (!row) {
                continue;
            }

            for (let x = 0; x < row.length; ++x) {
                const item = row[x];
                
                if (!item) {
                    continue;
                }

                const real_x = position.x + x;

                const grid_block = this.grid[position.y + y];

                if (
                    real_x - offset < 0 ||
                    (grid_block && grid_block[real_x - offset] !== null)
                ) {
                    return true;
                }
            }
        }

        return false;
    }

    is_colliding_right(position: XY, shape: number[][], offset: number = 0): boolean {
        for (let y = 0; y < shape.length; ++y) {
            const row = shape[y];
            
            if (!row) {
                continue;
            }

            for (let x = 0; x < row.length; ++x) {
                const item = row[x];
                
                if (!item) {
                    continue;
                }

                const real_x = position.x + x;

                const grid_block = this.grid[position.y + y];

                if (
                    real_x + offset >= this.__columns ||
                    (grid_block && grid_block[real_x + offset] !== null)
                ) {
                    return true;
                }
            }
        }

        return false;
    }

    is_colliding_up(position: XY, shape: number[][], offset: number = 0): boolean {
        for (let y = 0; y < shape.length; ++y) {
            const row = shape[y];
            
            if (!row) {
                continue;
            }

            for (let x = 0; x < row.length; ++x) {
                const item = row[x];
                
                if (!item) {
                    continue;
                }

                const real_y = position.y + y;

                if (
                    real_y - offset < -4 ||
                    (this.grid[real_y - offset] &&
                        this.grid[real_y - offset]![position.x + x] !== null)
                ) {
                    return true;
                }
            }
        }

        return false;
    }

    /**
     * 
     * @param column Which column to check whether a row is full or not.
     * @returns 
     */
    is_row_full(column: number): boolean {
        const row = this.grid[column];

        if (!row) {
            return false;
        }

        return row.every((block) => block !== null);
    }

    occupy_grid(tetromino: Tetromino): void {
        for (let y = 0; y < tetromino.shape.length; ++y) {
            const row = tetromino.shape[y];

            if (!row) {
                continue
            }

            if (!this.grid[tetromino.position.y + y]) {
                    continue;
            }

            for (let x = 0; x < row.length; ++x) {
                const block = row[x];

                if (!block) {
                    continue;
                }

                if (!this.grid[tetromino.position.y + y]![tetromino.position.x + x]) {
                    this.grid[tetromino.position.y + y]![tetromino.position.x + x] = tetromino;
                }
            }
        }
    }

    clear_rows(): void {
        let lines = 0;

        for (let y = 0; y < this.__rows; ++y) {
            const row = this.grid[y];

            if (!row) {
                continue;
            }

            if (this.is_row_full(y)) {
                for (let sy = y; sy >= 0; --sy) {
                    if (this.grid[sy]) {
                        this.grid[sy] = this.grid[sy - 1]!;
                    }
                }

                this.grid[0] = Array(this.__columns).fill(null);

                lines += 1;
            }
        }

        console.log(lines);
    }
}

export default Screen;
