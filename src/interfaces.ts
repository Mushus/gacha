export interface DraftGachaItem {
	id: number;
	name: string;
	weight: number;
	image: string | null;
	effect: "normal" | "ssr";
}

export interface DraftGacha {
	user: string;
	name: string;
	items: DraftGachaItem[];
}

export interface GachaItem {
	name: string;
	weight: number;
	image: string;
	effect: "normal" | "ssr";
}

export interface Gacha {
	user: string;
	name: string;
	items: GachaItem[];
}

export interface GachaTiny {
	user: string;
	name: string;
}

export interface SavedGachaItem {
	name: string;
	weight: number;
	image: string;
	effect?: "normal" | "ssr";
}

export interface SavedGacha {
	user: string;
	name: string;
	items: SavedGachaItem[];
}

export interface GachaPremium {
	id: string;
	image: string;
}
