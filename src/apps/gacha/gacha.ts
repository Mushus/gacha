import { DraftGacha, Gacha, SavedGacha } from "@/interfaces";
import { validate } from "../validator/gacha";

export const loadGacha = (data: any): Gacha => {
	if (!validate(data)) {
		console.error("value: %o", data);
		console.error(validate.errors);
		throw new Error("validation error");
	}

	const gacha: Gacha = {
		user: data.user,
		name: data.name,
		items: data.items.map(({ name, weight, image, effect }) => ({
			name,
			weight,
			image,
			effect: effect ?? "normal",
		})),
	};

	return gacha;
};

export const loadDraftGacha = (data: any): DraftGacha => {
	const { items, user, name } = loadGacha(data);

	return {
		user,
		name,
		items: items.map(({ name, weight, image, effect }, id) => ({
			id,
			name,
			weight,
			image,
			effect: effect ?? "normal",
		})),
	};
};

export const saveDraftGacha = (data: DraftGacha) => {
	const { user, name, items } = data;
	return {
		user,
		name,
		items: items.map(({ name, weight, image, effect }) => {
			if (!image) throw new Error("validation Error");
			return {
				name,
				weight,
				image,
				effect,
			};
		}),
	};
};

export const saveGachaTiny = (data: DraftGacha) => {
	const { user, name } = data;
	return { user, name };
};
