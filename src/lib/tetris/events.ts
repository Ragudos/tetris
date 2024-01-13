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
