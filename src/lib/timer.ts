type TimerCallback = () => void;

export class Timer {
	private readonly __delay: number;

	private __cb: undefined | TimerCallback;
	private __time_remaining: number;
	private __time_started: undefined | number;
	private __is_running: boolean;
	private __timeout: undefined | number;

	constructor(delay: number) {
		this.__cb = undefined;
		this.__delay = delay;
		this.__time_started = undefined;
		this.__time_remaining = delay;

		this.__timeout = undefined;
		this.__is_running = false;
	}

	private throw_error(err: string): void {
		throw new Error(`Timer: ${err}`);
	}

	public set_callback(cb: TimerCallback) {
		this.__cb = cb;
	}

	/**
	 * If you paused the timer, this brings the time remaining
	 * back to the original delay.
	 *
	 * Please stop the timer before resetting.
	 */
	public reset_delay(): void {
		if (this.__is_running) {
			return;
		}

		this.__time_remaining = this.__delay;
	}

	/**
	 * @throws {Error} if the timer is running, or if the callback is not set, or if the time remaining is negative.
	 * @returns
	 */
	public start(): void {
		if (!this.__cb) {
			throw this.throw_error("cannot start timer without callback");
		}

		if (this.__is_running) {
			return;
		}

		if (this.__time_remaining <= 0) {
			throw this.throw_error(
				"cannot start timer with negative time remaining",
			);
		}

		this.__time_started = Date.now();
		this.__is_running = true;
		this.__timeout = setTimeout(this.__cb, this.__time_remaining);
	}

	public stop(): void {
		if (!this.__is_running || !this.__time_started) {
			return;
		}

		this.__is_running = false;
		this.__time_remaining = Date.now() - this.__time_started;
		clearTimeout(this.__timeout);
		this.__timeout = undefined;
	}

	get delay(): number {
		return this.__delay;
	}

	get is_running(): boolean {
		return this.__is_running;
	}
}
