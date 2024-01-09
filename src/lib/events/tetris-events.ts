import type { XY } from "../xy";
import type { ROTATION_DIR } from "../types";

interface TetrisEventsDataBase {
	canvas_id: string;
}

interface TetrisEventsDataMove extends TetrisEventsDataBase {
	direction: XY;
}

interface TetrisEventsDataRotate extends TetrisEventsDataBase {
	direction: ROTATION_DIR;
}

interface TetrisEventsDataDrop extends TetrisEventsDataBase {
	type: "hard" | "soft";
}

interface TetrisEventsDataHold extends TetrisEventsDataBase {}

interface TetrisEventsDataClear extends TetrisEventsDataBase {
	lines: number;
}

interface TetrisEventsDataGameOver extends TetrisEventsDataBase {}

interface TetrisEventsData {
	"tetris:move": TetrisEventsDataMove;
	"tetris:rotate": TetrisEventsDataRotate;
	"tetris:drop": TetrisEventsDataDrop;
	"tetris:hold": TetrisEventsDataHold;
	"tetris:clear": TetrisEventsDataClear;
	"tetris:gameover": TetrisEventsDataGameOver;
	"tetris:lock": TetrisEventsDataBase;
}

interface TetrisEventsMap {
	"tetris:move": CustomEvent<TetrisEventsData["tetris:move"]>;
	"tetris:rotate": CustomEvent<TetrisEventsData["tetris:rotate"]>;
	"tetris:drop": CustomEvent<TetrisEventsData["tetris:drop"]>;
	"tetris:hold": CustomEvent<TetrisEventsData["tetris:hold"]>;
	"tetris:clear": CustomEvent<TetrisEventsData["tetris:clear"]>;
	"tetris:gameover": CustomEvent<TetrisEventsData["tetris:gameover"]>;
	"tetris:lock": CustomEvent<TetrisEventsData["tetris:lock"]>;
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
		data: TetrisEventsData[K],
	): void {
		this.dispatchEvent(new CustomEvent(type, { detail: data }));
	}
}

export default new TetrisEvents();
