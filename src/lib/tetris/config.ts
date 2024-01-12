import { XY } from "../xy";

export default {
    display: {
        width: 201,
        height: 401,
        block_size: 20,
    },
    screen: {
        columns: 10,
        rows: 20,
    },
    controls: {
        delay: 4,
        initial_delay: 10
    },
    lock: {
        max_resets: 20,
        delay: 50
    },
    base_position: new XY(4, 0)
}
