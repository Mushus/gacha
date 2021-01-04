import React, { useEffect, useState, ReactNode, useCallback } from "react";
import { createContainer } from "unstated-next";
import firebase from "firebase/app";
import "firebase/auth";
import { Redirect } from "react-router-dom";

export type FirebaseUser = firebase.User | null | undefined;

const useAuthInner = () => {
	const [user, setUser] = useState<FirebaseUser>(undefined);
	const logout = useCallback(() => firebase.auth().signOut(), []);
	return { user, setUser, logout };
};

const AuthContainer = createContainer(useAuthInner);

interface Props {
	children?: ReactNode;
}

const ProviderInner = ({ children }: Props) => {
	const { setUser } = AuthContainer.useContainer();

	useEffect(() => {
		const auth = firebase.auth();
		const updateAuthState = (user: firebase.User | null) => {
			setUser(user);
		};

		auth.onAuthStateChanged(updateAuthState);
	}, []);

	return <>{children}</>;
};

export const Provider = ({ children }: Props) => {
	return (
		<AuthContainer.Provider>
			<ProviderInner>{children}</ProviderInner>
		</AuthContainer.Provider>
	);
};

export const useAuth = AuthContainer.useContainer as () => {
	user: FirebaseUser;
	logout: () => Promise<void>;
};

export const AuthRequired = <P, _>(Component: React.ComponentType<P>) => {
	return (props: P) => {
		const { user } = AuthContainer.useContainer();

		switch (user) {
			case undefined:
				return null;
			case null:
				return <Redirect to="/login" />;
			default:
				return <Component {...props} />;
		}
	};
};
