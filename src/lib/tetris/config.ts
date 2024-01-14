import { XY } from "../xy";

export default {
	display: {
		width: 200,
		side_width: 75,
		height: 400,
		block_size: 20,
	},
	screen: {
		columns: 10,
		rows: 20,
	},
	controls: {
		delay: 4,
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
			relaxed: 100,
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
