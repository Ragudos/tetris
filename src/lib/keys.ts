interface Key {
	key: string;
}

export interface KeyBindings {
	rotate_clockwise: Key;
	rotate_counterclockwise: Key;
	hold: Key;
	move_left: Key;
	move_right: Key;
	soft_drop: Key;
	hard_drop: Key;
	pause: Key;
	resume: Key;
}

export const default_key_bindings = {
	rotate_clockwise: { key: "ArrowUp" },
	rotate_counterclockwise: { key: "Ctrl" },
	hold: { key: "Shift" },
	move_left: { key: "ArrowLeft" },
	move_right: { key: "ArrowRight" },
	soft_drop: { key: "ArrowDown" },
	hard_drop: { key: " " },
	pause: { key: "Escape" },
	resume: { key: "Enter" },
} satisfies KeyBindings;
