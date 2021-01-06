import { Gacha, GachaItem, GachaPremium } from "@/interfaces";
import { Box, Button, Text } from "@chakra-ui/react";
import { EditIcon } from "@chakra-ui/icons";
import React, { useState } from "react";
import { Link } from "react-router-dom";
import GachaGraphics from "./GachaGraphics";
import PremiumList from "../edit/PremiumList";

interface Props {
	user: { uid: string } | undefined | null;
	id: string;
	data: Gacha;
}

export default ({ user, id, data }: Props) => {
	const editable = data && user && data.user === user.uid;

	const randomGacha = () => {
		const weights = data.items.map((item) => item.weight);
		const sumWeight = weights.reduce((prev, curr) => prev + curr, 0);
		const rand = Math.random() * sumWeight;
		let index = 0;
		let stackedWeight = 0;
		for (; index < weights.length; index++) {
			stackedWeight += weights[index];
			if (stackedWeight >= rand) break;
		}
		return data.items[index];
	};

	const [premiumList, setPremiumList] = useState<GachaPremium[]>([]);

	const addPremiumList = (image: string) =>
		setPremiumList((list) => [
			...list,
			{ id: String(list.length + 1), image },
		]);

	return (
		<>
			{editable && (
				<Box>
					<Link to={`/edit/${id}`}>
						<Button colorScheme="blue">
							<EditIcon />
							<Text ml={1}>編集</Text>
						</Button>
					</Link>
				</Box>
			)}
			<Box>
				<PremiumList premiumList={premiumList} />
				<GachaGraphics
					randomGacha={randomGacha}
					addPremium={addPremiumList}
				/>
			</Box>
		</>
	);
};
