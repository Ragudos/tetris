export class XY {
	public x: number;
	public y: number;

	constructor(x: number, y: number) {
		this.x = x;
		this.y = y;
	}

	clone(): XY {
		return new XY(this.x, this.y);
	}
}
