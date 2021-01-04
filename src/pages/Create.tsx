import Main from "@/components/layout/Main";
import { Text } from "@chakra-ui/react";
import React, { useEffect } from "react";
import firebase from "firebase";
import "firebase/firestore";
import { RouteComponentProps, useHistory } from "react-router-dom";
import { useAuth } from "@/middleware/auth/Auth";
import { Gacha } from "@/interfaces";

interface Props extends RouteComponentProps<{}> {}

export default ({ history }: Props) => {
	const { user } = useAuth();

	useEffect(() => {
		if (!user) return;

		(async (user) => {
			const data: Gacha = { user: user.uid, name: "", items: [] };
			const db = firebase.firestore();
			const document = await db.collection("gacha").add(data);
			const documentId = document.id;

			history.replace(`/edit/${documentId}`);
		})(user);
	}, []);

	return (
		<Main>
			<Text>初期化中...</Text>
		</Main>
	);
};
