import * as PIXI from "pixi.js";

const container = document.querySelector(
	".canvas-inner-container",
) as HTMLElement;

const tetris_app = new PIXI.Application({
	background: "#212121",
	resizeTo: container,
});

const sprite_image = PIXI.Sprite.from("/spritesheet.png");

tetris_app.stage.addChild(sprite_image);

let counter = 0;

tetris_app.ticker.add((time) => {
	sprite_image.rotation += 0.01 * time;
});

// @ts-ignore
container.appendChild(tetris_app.view);
