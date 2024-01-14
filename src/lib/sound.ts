export default class Sound {
	public url: string;
	context: AudioContext;
	buffer: AudioBuffer | null = null;
	sources: AudioBufferSourceNode[] = [];

	constructor(url: string, context: AudioContext) {
		this.url = url;
		this.context = context;
	}

	load() {
		if (!this.url) {
			return Promise.reject(
				new Error("Please provide a url to load the sound from"),
			);
		}

		if (this.buffer) {
			return Promise.resolve(this.buffer);
		}

		return new Promise<AudioBuffer>((resolve, reject) => {
			const req = new XMLHttpRequest();

			req.open("GET", this.url, true);
			req.responseType = "arraybuffer";

			req.onload = () => {
				this.context.decodeAudioData(req.response, (buffer) => {
					if (!buffer) {
						reject(new Error("Couldn't decode audio data"));
						return;
					}

					this.buffer = buffer;
					resolve(buffer);
				});
			};

			req.onerror = () => {
				reject(new Error("Couldn't load sound at " + this.url));
			};

			req.send();
		});
	}

	play(volume = 1, time = 0) {
		if (!this.buffer) {
			return;
		}

		const source = this.context.createBufferSource();
		source.buffer = this.buffer;
		const inserted_at = this.sources.push(source);

		source.onended = () => {
			source.stop(0);

			this.sources.splice(inserted_at, 1);
		};

		const gain_node = this.context.createGain();

		gain_node.gain.value = volume;

		source.connect(gain_node).connect(this.context.destination);

		source.start(time);
	}

	stop() {
		this.sources.forEach((source) => {
			source.stop(0);
		});

		this.sources = [];
	}
}
