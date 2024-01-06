/**
 * @param time_elapsed Time elapsed since last render in milliseconds
 */
type CallbackPerRender = (time_elapsed: number) => void;

export interface RendererInterface {
	is_rendering: boolean;
	start_rendering(): void;
	stop_rendering(): void;
}

/**
 * @class Renderer
 * @implements {RendererInterface}
 * @description
 * This class is responsible for rendering. This will be upgraded to also optionally offload the rendering to
 * workers.
 */
export class Renderer implements RendererInterface {
	private __is_rendering: boolean;
	private __animation_frame_id: null | number;
	private __callback_per_render: (time_elapsed: number) => void;

	constructor(cb: CallbackPerRender) {
		this.__is_rendering = false;
		this.__animation_frame_id = null;
		this.__callback_per_render = cb;
	}

	private update(time: number) {
		this.__callback_per_render(time);
		this.__animation_frame_id = globalThis.requestAnimationFrame(
			this.update.bind(this),
		);
	}

	public start_rendering(): void {
		this.__is_rendering = true;
		this.__animation_frame_id = globalThis.requestAnimationFrame(
			this.update.bind(this),
		);
	}

	public stop_rendering(): void {
		this.__is_rendering = false;

		if (this.__animation_frame_id !== null) {
			globalThis.cancelAnimationFrame(this.__animation_frame_id);
		}
	}

	get is_rendering(): boolean {
		return this.__is_rendering;
	}
}
