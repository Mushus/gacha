import React, { useEffect, useState } from "react";
import Main from "@/components/layout/Main";
import { Text } from "@chakra-ui/react";
import firebase from "firebase";
import "firebase/firestore";
import "firebase/storage";
import { RouteComponentProps } from "react-router-dom";
import Editor from "@/components/edit/Editor";
import { DraftGacha } from "@/interfaces";
import {
	loadDraftGacha,
	saveDraftGacha,
	saveGachaTiny,
} from "@/apps/gacha/gacha";
import { useAuth } from "@/middleware/auth/Auth";

interface Props extends RouteComponentProps<{ id: string }> {}

export default ({ match, history }: Props) => {
	const { params } = match;
	const { id } = params;

	const [data, setData] = useState<DraftGacha | undefined>();
	const { user } = useAuth();

	useEffect(() => {
		let cancel = false;
		(async () => {
			const firestore = firebase.firestore();

			const doc = await firestore.collection("gacha").doc(id).get();
			if (cancel) return;

			const data = await doc.data();
			if (cancel) return;

			setData(loadDraftGacha(data));
		})();

		return () => {
			cancel = true;
			setData(undefined);
		};
	}, [id]);

	const save = async () => {
		if (!data) return false;

		const gachaTinyData = saveGachaTiny(data);
		const gachaData = saveDraftGacha(data);

		const firestore = firebase.firestore();

		const gachaDocRef = await firestore.collection("gacha").doc(id);
		const gachaListRef = await firestore.collection("gachaTiny").doc(id);

		firestore.runTransaction(async (tx) => {
			await tx.set(gachaDocRef, gachaData);
			await tx.set(gachaListRef, gachaTinyData);
		});

		history.push(`/gacha/${id}`);
	};

	const upload = async (hash: string, blob: Blob) => {
		if (!user) return null;

		const storage = firebase.storage().ref();
		const result = await storage
			.child("gacha")
			.child(user.uid)
			.child(id)
			.child(hash)
			.put(blob);
		const url = await result.ref.getDownloadURL();
		if (!url) return null;
		return url;
	};

	return (
		<Main>
			{data ? (
				<Editor
					id={id}
					data={data}
					setData={
						setData as React.Dispatch<
							React.SetStateAction<DraftGacha>
						>
					}
					upload={upload}
					save={save}
				/>
			) : (
				<Text>読込中...</Text>
			)}
		</Main>
	);
};
