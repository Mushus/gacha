import React from "react";
import { Box, Container, Flex, Heading, Text } from "@chakra-ui/react";
import { useAuth } from "@/middleware/auth/Auth";
import { Link, useLocation } from "react-router-dom";

export default () => {
	const { user } = useAuth();
	const location = useLocation();

	const pathname = location.pathname;
	const params = new URLSearchParams();
	params.append("redirect", pathname);

	return (
		<Box h={50} shadow="base">
			<Container maxW="3xl">
				<Flex px={4} mx="auto">
					<Heading size="md" mt={3}>
						<Link to="/">オリジナルガチャメーカー</Link>
					</Heading>
					<Box ml="auto" my={3}>
						<Text>
							{user === undefined ? null : user ? (
								<Link to="/logout">ログアウト</Link>
							) : (
								<Link to={`/login?${params.toString()}`}>
									ログイン
								</Link>
							)}
						</Text>
					</Box>
				</Flex>
			</Container>
		</Box>
	);
};
