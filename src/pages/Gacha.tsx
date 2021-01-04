import React, { useEffect, useMemo, useState } from "react";
import firebase from "firebase/app";
import "firebase/auth";
import Main from "@/components/layout/Main";
import { RouteComponentProps } from "react-router-dom";
import { useAuth } from "@/middleware/auth/Auth";
import { Gacha } from "@/interfaces";
import { loadGacha } from "@/apps/gacha/gacha";
import GachaMain from "@/components/gacha/GachaMain";
import { Text } from "@chakra-ui/react";

interface Props extends RouteComponentProps<{ id: string }> {}

export default ({ match }: Props) => {
	const { params } = match;
	const { id } = params;

	const [data, setData] = useState<Gacha | null>(null);
	const { user } = useAuth();

	const [_, doc] = useMemo(() => {
		const firestore = firebase.firestore();
		const doc = firestore.collection("gacha").doc(id);
		return [firestore, doc];
	}, [id]);

	useEffect(() => {
		(async () => {
			const data = await (await doc.get()).data();
			setData(loadGacha(data));
		})();
	}, [id]);

	return (
		<Main>
			{data ? (
				<GachaMain user={user} id={id} data={data} />
			) : (
				<Text>読込中...</Text>
			)}
		</Main>
	);
};
