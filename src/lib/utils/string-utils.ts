import { range } from "./general-utils";

function uppercase_char_by_half_chance(char: string): string {
	return Math.random() > 0.5 ? char.toUpperCase() : char;
}

/**
 * @returns A random id with a length of 8.
 */
function gen_random_id(): string {
	let id = "";
	const id_length = 8;
	const lower_case_start_charcode = 97;
	const lower_case_end_charcode = 122;
	const num_start_charcode = 48;
	const num_end_charcode = 57;

	for (let count = 0; count < id_length; ++count) {
		if (Math.random() < 0.5) {
			const random_char = range(
				lower_case_start_charcode,
				lower_case_end_charcode,
			);
			id += uppercase_char_by_half_chance(String.fromCharCode(random_char));
		} else {
			const random_char = range(num_start_charcode, num_end_charcode);
			id += String.fromCharCode(random_char);
		}
	}

	return id;
}

export {
	gen_random_id,
	uppercase_char_by_half_chance,
}
