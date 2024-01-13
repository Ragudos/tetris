export type TimerListenerCallback<T> = (this: T, time: number) => any;

/**
 * Inspired by PIXI JS for proper event handling.
 */
class TimerListener<T = any> {
	/**
	 * To arrange listeners based on their priority, thus calling them
	 * in that order when {@link TimerListener#tick} is invoked,
	 */
	public priority: number;
	public prev: TimerListener | null;
	public next: TimerListener | null;

	public emit_once: boolean;

	private __fn: null | TimerListenerCallback<T>;
	private __context: null | T;
	private __is_destroyed: boolean;

	constructor(
		fn: null | TimerListenerCallback<T>,
		context: any = null,
		priority = 0,
		emit_once = false,
	) {
		this.prev = null;
		this.next = null;

		this.emit_once = emit_once;

		this.__is_destroyed = false;

		this.__fn = fn;
		this.__context = context;
		this.priority = priority;
	}

	compare(fn: TimerListenerCallback<T>, context: any = null): boolean {
		return this.__fn === fn && this.__context === context;
	}

	connect(prev: TimerListener): void {
		this.prev = prev;

		if (prev.next) {
			prev.next.prev = this;
		}

		this.next = prev.next;
		prev.next = this;
	}

	emit(time: number): null | TimerListener {
		if (this.__fn) {
			if (this.__context) {
				this.__fn.call(this.__context, time);
			} else {
				(this as TimerListener<any>).__fn!(time);
			}
		}

		const next = this.next;

		if (this.emit_once) {
			this.destroy(true);
		}

		if (this.__is_destroyed) {
			this.next = null;
		}

		return next;
	}

	destroy(hard = false): null | TimerListener {
		this.__is_destroyed = true;
		this.__fn = null;
		this.__context = null;

		if (this.prev) {
			this.prev.next = this.next;
		}

		if (this.next) {
			this.next.prev = this.prev;
		}

		const next = this.next;

		this.next = hard ? null : next;
		this.prev = null;

		return next;
	}
}

export default TimerListener;
