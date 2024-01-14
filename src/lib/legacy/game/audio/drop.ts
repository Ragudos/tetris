import tetrisEvents from "../../events/tetris-events";
import Sound from "../../../sound";

let drop_sound: undefined | Sound;

tetrisEvents.addEventListener("tetris:drop", (_ev) => {
	if (drop_sound) {
		drop_sound.play();
	} else {
		drop_sound = new Sound("/sfx/lock.mp3", new AudioContext());
		drop_sound.load().then(() => {
			drop_sound?.play();
		});
	}
});
