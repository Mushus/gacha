import { Gacha, GachaItem } from "@/interfaces";
import { Box, Button, Text, Image } from "@chakra-ui/react";
import { EditIcon } from "@chakra-ui/icons";
import React, { useState } from "react";
import { Link } from "react-router-dom";
import GachaGraphics from "./GachaGraphics";

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
				<GachaGraphics randomGacha={randomGacha} />
			</Box>
		</>
	);
};
