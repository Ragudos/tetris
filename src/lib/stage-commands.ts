import type { ROTATION_DIR } from "./types";

export class StageCommands {
    public rotate_block(dir: ROTATION_DIR): void {}

    public move_block_down(): void {}
    public move_block_left(): void {}
    public move_block_right(): void {}

    /**
     * Shorthand for:
     * 
     * ```ts
     * if (
     *   this.is_colliding_left() ||
     *   this.is_colliding_right() ||
     *   this.is_colliding_down()
     * ) {
     *  // Statement here...
     * }
     * 
     * // Instead do
     * 
     * if (this.is_colliding()) {
     *  // Statement here...
     * }
     * ```
     */
    public is_colliding(): boolean {}
    public is_colliding_left(): boolean {}
    public is_colliding_right(): boolean {}
    public is_colliding_down(): boolean {}

    public is_there_a_completed_row<T>(map: T[][]): boolean {
        return map.some((row) => row.every((item) => !item));
    }
}
