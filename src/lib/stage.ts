import { Renderer } from "./renderer";
import { StageCommands } from "./stage-commands";
import type { TetrominoInterface } from "./tetromino";
import { Timer } from "./timer";
import type { XY } from "./xy";

export interface StageInterface {
    canvas: HTMLCanvasElement;
}

export type StageOptions = {
    /**
     * @description The delay in milliseconds before a block's position on the floor or stack is finalized
     * and the next block is spawned. This does not apply to a hard drop.
     */
    lock_delay: number;
    /**
     * @description The maximum amount of times the lock delay can be reset. Since if a position changes or the block
     * rotates, we need to reset the lock delay/timer. Set to 0 to disable
     */
    max_lock_resets: number;
}

export type GameInfo = {
    /**
     * Usually a 10 x 20 grid for Tetris.
     */
    game_map_dimensions: XY;
    block_size: number;
}

/**
 * @class Stage
 * @implements StageInterface
 * @description Can throw an error at construction and during operations.
 */
export class Stage implements StageInterface {
    public readonly commands: StageCommands;
    private readonly game_map: (null | TetrominoInterface)[][];

    private __renderer: Renderer;
    private __canvas: HTMLCanvasElement;
    private __ctx: CanvasRenderingContext2D;

    private __block_size: number;

    private __lock_delay: number;
    private __max_lock_resets: number;
    private __lock_timer: Timer;

    constructor(canvas: HTMLCanvasElement, game_info: GameInfo,  options: StageOptions) {
        this.__renderer = new Renderer(this.render.bind(this));

        this.__canvas = canvas;
        
        const ctx = this.__canvas.getContext("2d");

        if (!ctx) {
            throw this.throw_error("Could not get 2d context");
        }

        this.__ctx = ctx;

        this.game_map = new Array(game_info.game_map_dimensions.y)
            .fill(null)
            .map(() => new Array(game_info.game_map_dimensions.x).fill(null));
        this.__block_size = game_info.block_size;

        this.__lock_delay = options.lock_delay;
        this.__max_lock_resets = options.max_lock_resets;
        this.__lock_timer = new Timer(this.__lock_delay);

        this.commands = new StageCommands();
    }

    private throw_error(err: string): void {
        throw new Error(`Stage: ${err}`);
    }

    private draw() {}

    private render(time: number) {
        
    }

    public start(): void {
        this.__renderer.start_rendering();
    }

    public stop(): void {
        this.__renderer.stop_rendering();
    }

    get canvas(): HTMLCanvasElement {
        return this.__canvas;
    }

    get lock_delay(): number {
        return this.__lock_delay;
    }

    get max_lock_resets(): number {
        return this.__max_lock_resets;
    }
}
