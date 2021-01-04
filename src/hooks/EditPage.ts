import { ImageProcessor } from "@/apps/ImageProcessor";

export const useImageConverter = () => {
	const resize = async (file: File) => {
		const imageProcessor = new ImageProcessor();
		let data: ArrayBuffer;
		if (file.arrayBuffer) {
			data = await file.arrayBuffer();
		} else {
			data = await new Promise((resolve, reject) => {
				const fr = new FileReader();
				fr.onload = () => {
					resolve(fr.result as ArrayBuffer);
				};
				fr.onerror = (ev) => {
					reject(ev);
				};
				fr.readAsArrayBuffer(file);
			});
		}
		const result = await imageProcessor.resize(data, 400, 400);
		return result;
	};

	return { resize };
};
