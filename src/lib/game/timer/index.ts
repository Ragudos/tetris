import { UPDATE_PRIORITY } from "../const";
import TimerListener, { type TimerListenerCallback } from "./listener";

/**
 * Inspired by PIXI JS for proper event handling.
 * A more event-driven timer to avoid coupling code.
 * This calls all listeners registered to the timer every tick.
 * @class Timer
 */
class Timer {
  public static fpms = 0.06;

	/**
	 * Start the time
	 */
	public auto_start: boolean;

	/**
	 * The time elapsed in milliseconds.
	 */
	public time_elapsed_ms: number;
  public delta_ms: number;

	public is_running: boolean;

	public time_since_last_update: number;
	public speed: number;
	public delta_time: number;

	private __request_animation_id: null | number;
	private __max_time_elapsed_ms: number;
	private __min_time_elapsed_ms: number;
	private __last_keyframe: number;
  private __listener_head: TimerListener

	private __tick: (time: number) => void;

	constructor() {
    this.time_elapsed_ms = 1 / Timer.fpms;
    this.delta_ms = 1 / Timer.fpms;
    // Infinity to always be the head.
    this.__listener_head = new TimerListener(null, null, Infinity);

		this.auto_start = false;
		this.is_running = false;

		this.speed = 1;
		this.delta_time = 1;
		this.time_since_last_update = -1;

		this.__max_time_elapsed_ms = 100;
		this.__min_time_elapsed_ms = 0;
		this.__last_keyframe = -1;;

		this.__request_animation_id = null;

		this.__tick = (time: number): void => {
			this.__request_animation_id = null;

			if (this.is_running) {
				this.update(time);

				if (this.is_running && this.__request_animation_id === null) {
					this.__request_animation_id = requestAnimationFrame(
						this.__tick,
					);
				}
			}
		};
	}

  private __request_if_possible(): void {
    if (this.__request_animation_id === null && this.__listener_head.next !== null) {
      this.time_since_last_update = performance.now();
      this.__last_keyframe = this.time_since_last_update;
      this.__request_animation_id = requestAnimationFrame(this.__tick);
    }
  }

  private __cancel_animation_if_possible(): void {
    if (this.__request_animation_id !== null) {
      cancelAnimationFrame(this.__request_animation_id);
      this.__request_animation_id = null;
    }
  }

  private __start_if_possible(): void {
    if (this.is_running) {
      this.__request_if_possible();
    } else if (this.auto_start) {
      this.start();
    }
  }

  private __add_listener<T = any>(listener: TimerListener<T>): this {
    let current = this.__listener_head.next;
    let prev = this.__listener_head;

    if (!current) {
      listener.connect(prev);
    } else {
      while (current) {
        if (listener.priority > current.priority) {
          listener.connect(prev);
          break;
        }

        prev = current;
        current = current.next;
      }

      if (!listener.prev) {
        listener.connect(prev);
      }
    }

    this.__start_if_possible();

    return this;
  }

  add<T = any>(fn: TimerListenerCallback<T>, context?: null | T, priority = UPDATE_PRIORITY.NORMAL): this {
    return this.__add_listener(new TimerListener(fn, context, priority));
  }

  add_once<T = any>(fn: TimerListenerCallback<T>, context?: null | T, priority = UPDATE_PRIORITY.NORMAL): this {
    return this.__add_listener(new TimerListener(fn, context, priority, true));
  }

  remove<T = any>(fn: TimerListenerCallback<T>, context?: null | T): this {
    let current = this.__listener_head.next;

    while (current) {
      if (current.compare(fn, context)) {
        current.destroy();
        break;
      }

      current = current.next;
    }

    if (this.__listener_head.next === null) {
      this.__cancel_animation_if_possible();
    }

    return this;
  }

  start(): void {
    if (!this.is_running) {
      this.is_running = true;
      this.__request_if_possible();
    }
  }

  stop(): void {
    if (this.is_running) {
      this.is_running = false;
      this.__cancel_animation_if_possible();
    }
  }

	update(time = performance.now()): void {
		let time_elapsed_ms: number;

		if (time > this.time_since_last_update) {
			time_elapsed_ms = this.time_elapsed_ms =
				time - this.time_since_last_update;

			if (time_elapsed_ms > this.__max_time_elapsed_ms) {
				time_elapsed_ms = this.__max_time_elapsed_ms;
			}

			time_elapsed_ms *= this.speed;

			if (this.__min_time_elapsed_ms) {
				const delta = Math.trunc(time - this.__last_keyframe);

				if (delta < this.__min_time_elapsed_ms) {
					return;
				}

				this.__last_keyframe =
					time - (delta % this.__min_time_elapsed_ms);
			}

      this.delta_ms = time_elapsed_ms;
      this.delta_time = this.delta_ms * Timer.fpms;

      const listener_head = this.__listener_head;

      let listener = listener_head.next;

      while (listener) {
        listener = listener.emit(this.delta_time);
      }

      if (listener_head.next === null) {
        this.__cancel_animation_if_possible();
      }
		} else {
      this.delta_time = this.delta_ms = this.time_elapsed_ms = 0;
    }

    this.time_since_last_update = time;
	}

  get listener_count(): number {
    if (!this.__listener_head) {
      return 0;
    }

    let count = 0;
    let current = this.__listener_head as null | TimerListener;

    while (current) {
      count++;
      current = current.next;
    }

    return count;
  }
}

export default Timer;
