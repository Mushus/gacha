import React, { useEffect, useState } from "react";
import { Box, Button, Flex } from "@chakra-ui/react";
import { Link as RouterLink } from "react-router-dom";
import Link from "@/components/common/Link";
import firebase from "firebase/app";
import "firebase/firestore";
import { useAuth } from "@/middleware/auth/Auth";
import { GachaTiny } from "@/interfaces";

export default () => {
	const { user } = useAuth();

	const [items, setItems] = useState<(GachaTiny & { id: string })[] | null>(
		null
	);

	useEffect(() => {
		(async () => {
			if (!user) return;
			const firestore = firebase.firestore();
			const gachaRef = firestore.collection("gachaTiny");
			const docs = await gachaRef.where("user", "==", user.uid).get();
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
					<Flex flex="1 1 auto" key={item.id}>
						<Box flex="1 1 auto">
							<Link to={`/gacha/${item.id}`}>{item.name}</Link>
						</Box>
						<Box>
							<RouterLink to={`/edit/${item.id}`}>
								<Button colorScheme="blue">編集</Button>
							</RouterLink>
						</Box>
					</Flex>
				))}
			</Flex>
		</Flex>
	);
};
