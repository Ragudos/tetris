import { XY } from "../xy";

export default {
	display: {
		width: 250,
		side_width: 75,
		height: 500,
		block_size: 25,
	},
	screen: {
		columns: 10,
		rows: 20,
	},
	controls: {
		delay: 2,
		initial_delay: 10,
	},
	lock: {
		max_resets: 20,
		delay: 50,
	},
	base_position: new XY(4, 0),
	gravity: {
		initial: {
			subzero: null,
			relaxed: 60,
			engaging: 25,
			spicy: 10,
			/**
			 * 1 is the maximum speed we can get, so
			 * for 1, we will instantly make the piece
			 * go to the floor.
			 */
			static: 1,
		},
		decrement_per_level: 0.075,
	},
};
