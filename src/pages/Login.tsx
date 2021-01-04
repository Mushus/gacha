import React, { useEffect } from "react";
import "firebaseui/dist/firebaseui.css";
import firebase from "firebase/app";
import "firebase/auth";
import * as firebaseui from "firebaseui";
import Main from "@/components/layout/Main";
import { Heading } from "@chakra-ui/react";
import { RouteComponentProps } from "react-router-dom";

const firebaseUiId = "firebase-auth-ui";

interface Props extends RouteComponentProps<{ id: string }> {}

const Login = ({ history }: Props) => {
	useEffect(() => {
		const params = new URLSearchParams(history.location.search);
		let redirectUrl = params.get("redirect") ?? "/";

		if (!redirectUrl.match(/^\/gacha\/.+$/)) {
			redirectUrl = "/";
		}

		const ui = new firebaseui.auth.AuthUI(firebase.auth());

		ui.start(`#${firebaseUiId}`, {
			signInOptions: [
				firebase.auth.GoogleAuthProvider.PROVIDER_ID,
				firebase.auth.TwitterAuthProvider.PROVIDER_ID,
				{
					provider: firebase.auth.EmailAuthProvider.PROVIDER_ID,
					requireDisplayName: false,
				},
			],
			signInSuccessUrl: `/#${redirectUrl}`,
		});

		return () => {
			ui.delete();
		};
	}, []);

	return (
		<Main>
			<Heading id={firebaseUiId} size="xl">
				ログイン
			</Heading>
		</Main>
	);
};

export default Login;
