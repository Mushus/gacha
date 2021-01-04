import jimp from "jimp/browser/lib/jimp";

export async function resize(data: ArrayBuffer, w: number, h: number) {
	const original = await jimp.read(data as Buffer);
	const resized = original.contain(w, h);
	const out = await resized.getBufferAsync("image/png");
	return out;
}
