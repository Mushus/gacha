export default class Uploader {
	async upload(buffer: ArrayBuffer) {
		const blob = new Blob([buffer], { type: "image/png" });
		const url = URL.createObjectURL(blob);
		return url;
	}
}
