import type { XY } from "./xy";

export class ImageInfo {
	private __image_source: HTMLOrSVGImageElement;
	private __size: XY;
	private __position: XY;

	did_image_load: boolean = false;

	constructor(image_source: HTMLOrSVGImageElement, size: XY, position: XY) {
		this.__image_source = image_source;
		this.__size = size;
		this.__position = position;

		if (image_source instanceof HTMLImageElement) {
			if (image_source.complete) {
				this.did_image_load = true;
			} else {
				image_source.addEventListener("load", () => {
					this.did_image_load = true;
				}, { once: true });
			}
		} else {
			this.did_image_load = true;
		}
	}

	public change_image_source(new_image_source: HTMLOrSVGImageElement): this {
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

	clone(): ImageInfo {
		return new ImageInfo(
			this.__image_source,
			this.__size.clone(),
			this.__position.clone(),
		);
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
