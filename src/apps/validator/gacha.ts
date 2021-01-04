import { Gacha, SavedGacha } from "@/interfaces";
import Ajv, { JSONSchemaType } from "ajv";

export const schema: JSONSchemaType<SavedGacha> = {
	type: "object",
	properties: {
		name: { type: "string" },
		user: { type: "string" },
		items: {
			type: "array",
			items: {
				type: "object",
				properties: {
					name: { type: "string" },
					weight: { type: "number" },
					image: { type: "string" },
					effect: {
						type: "string",
						enum: ["normal", "ssr"],
						nullable: true,
					},
				},
				required: ["name", "weight", "image"],
			},
		},
	},
	required: ["name", "user", "items"],
};

const ajv = new Ajv();
export const validate = ajv.compile(schema);
