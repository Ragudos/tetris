import type { TetrominoNames } from "../../config/tetromino";

interface TetrisEventsDataMove {
    type: "left" | "right";
}

interface TetrisEventsDataRotate {
    type: "left" | "right";
}

interface TetrisEventsDataDrop {
    type: "hard" | "soft";
}

interface TetrisEventsDataHold {
    swapped_block_name: TetrominoNames;
}

interface TetrisEventsDataClear {
    lines: number;
}

interface TetrisEventsDataGameOver {}

interface TetrisEventsDataBase {}

interface Tetrisevents {
    "tetris:move": TetrisEventsDataMove;
    "tetris:rotate": TetrisEventsDataRotate;
    "tetris:drop": TetrisEventsDataDrop;
    "tetris:hold": TetrisEventsDataHold;
    "tetris:clear": TetrisEventsDataClear;
    "tetris:gameover": TetrisEventsDataGameOver;
    "tetris:lock": TetrisEventsDataBase;
}

export interface TetrisEventsMap {
    "tetris:move": CustomEvent<Tetrisevents["tetris:move"]>;
    "tetris:rotate": CustomEvent<Tetrisevents["tetris:rotate"]>;
    "tetris:drop": CustomEvent<Tetrisevents["tetris:drop"]>;
    "tetris:hold": CustomEvent<Tetrisevents["tetris:hold"]>;
    "tetris:clear": CustomEvent<Tetrisevents["tetris:clear"]>;
    "tetris:gameover": CustomEvent<Tetrisevents["tetris:gameover"]>;
    "tetris:lock": CustomEvent<Tetrisevents["tetris:lock"]>;
}

interface TetrisEvents extends EventTarget {
    addEventListener<K extends keyof TetrisEventsMap>(
        type: K,
        listener: (this: TetrisEvents, ev: TetrisEventsMap[K]) => any,
        options?: boolean | AddEventListenerOptions,
    ): void;
    addEventListener(
        type: string,
        listener: EventListenerOrEventListenerObject,
        options?: boolean | AddEventListenerOptions,
    ): void;
    removeEventListener<K extends keyof TetrisEventsMap>(
        type: K,
        listener: (this: TetrisEvents, ev: TetrisEventsMap[K]) => any,
        options?: boolean | EventListenerOptions,
    ): void;
    removeEventListener(
        type: string,
        listener: EventListenerOrEventListenerObject,
        options?: boolean | EventListenerOptions,
    ): void;
}

class TetrisEvents extends EventTarget {
    $emit<K extends keyof TetrisEventsMap>(
        type: K,
        detail: TetrisEventsMap[K]["detail"],
    ) {
        this.dispatchEvent(new CustomEvent(type, { detail }));
    }
}

export default new TetrisEvents();
