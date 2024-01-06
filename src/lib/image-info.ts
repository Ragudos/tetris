import type { CanvasImageSource } from "./types";
import type { XY } from "./xy";

export class ImageInfo {
	private __image_source: CanvasImageSource;
	private __size: XY;
	private __position: XY;

	constructor(image_source: CanvasImageSource, size: XY, position: XY) {
		this.__image_source = image_source;
		this.__size = size;
		this.__position = position;
	}

	public change_image_source(new_image_source: CanvasImageSource): this {
		this.__image_source = new_image_source;
		return this;
	}

	public change_size(x: number, y: number): this {
		this.__size.x = x;
		this.__size.y = y;
		return this;
	}

	public change_position(x: number, y: number): this {
		this.__position.x = x;
		this.__position.y = y;
		return this;
	}

	get image_source(): CanvasImageSource {
		return this.__image_source;
	}

	get size(): XY {
		return this.__size;
	}

	get position(): XY {
		return this.__position;
	}
}
