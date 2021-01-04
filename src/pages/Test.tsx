import GachaGraphics from "@/components/gacha/GachaGraphics";
import { GachaItem } from "@/interfaces";
import React from "react";

export default () => {
	return (
		<div>
			<GachaGraphics
				randomGacha={() => ({
					name: "test",
					weight: 1,
					image: "/test.png",
					effect: "normal",
				})}
			/>
		</div>
	);
};
