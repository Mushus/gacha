import React, { useEffect } from "react";
import { Text } from "@chakra-ui/react";
import { useAuth } from "@/middleware/auth/Auth";
import Main from "@/components/layout/Main";
import Link from "@/components/common/Link";

export default () => {
	const { logout } = useAuth();

	useEffect(() => {
		logout();
	}, []);

	return (
		<Main>
			<Text>ログアウトしました</Text>
			<Link to="/">トップページに戻る</Link>
		</Main>
	);
};
