import ImageProcessorWorker from "comlink-loader!./imageProcessor.worker.ts";
import Crypto from "crypto-js";

export class ImageProcessor {
	public constructor() {}

	public async resize(
		data: ArrayBuffer,
		w: number,
		h: number
	): Promise<[string, Blob]> {
		const processor = await new ImageProcessorWorker();
		const buf = await processor.resize(data, w, h);

		const word = Crypto.lib.WordArray.create(buf);
		const hash = Crypto.MD5(word).toString(Crypto.enc.Hex);

		const blob = new Blob([buf], { type: "image/png" });
		// const url = URL.createObjectURL(blob);
		return [hash, blob];
	}
}
