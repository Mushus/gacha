import React, { useEffect, useState } from "react";
import { Box, Flex } from "@chakra-ui/react";
import Link from "@/components/common/Link";
import firebase from "firebase/app";
import "firebase/firestore";
import { useAuth } from "@/middleware/auth/Auth";
import { GachaTiny } from "@/interfaces";

export default () => {
	const [items, setItems] = useState<(GachaTiny & { id: string })[] | null>(
		null
	);

	useEffect(() => {
		(async () => {
			const firestore = firebase.firestore();
			const gachaRef = firestore.collection("gachaTiny");
			const docs = await gachaRef.limit(30).get();
			const gachaList: (GachaTiny & { id: string })[] = [];
			docs.forEach((doc) =>
				gachaList.push({ id: doc.id, ...(doc.data() as GachaTiny) })
			); // TODO:
			setItems(gachaList);
		})();
	}, []);

	if (!items) return null;

	return (
		<Flex direction="row">
			<Flex direction="column" flex="1 1 auto">
				{items.map((item) => (
					<Box flex="1 1 auto" key={item.id}>
						<Link to={`/gacha/${item.id}`}>{item.name}</Link>
					</Box>
				))}
			</Flex>
		</Flex>
	);
};
