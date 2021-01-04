import Main from "@/components/layout/Main";
import EveryoneslGachaList from "@/containers/top/EveryoneslGachaList";
import YourGachaList from "@/containers/top/YourGachaList";
import { useAuth } from "@/middleware/auth/Auth";
import { Box, Button, Heading, Text } from "@chakra-ui/react";
import React from "react";
import { RouteComponentProps } from "react-router-dom";

interface Props extends RouteComponentProps<{}> {}

const Top = ({ history }: Props) => {
	const { user } = useAuth();

	const create = () => {
		history.push("/create");
	};

	return (
		<Main>
			<Box mb={10}>
				<Text>ガチャしよう</Text>
			</Box>
			<Heading size="lg" mb={4}>
				みんなの新作ガチャ
			</Heading>
			<Box mb={10}>
				<EveryoneslGachaList />
			</Box>
			{user && (
				<>
					<Heading size="lg" mb={4}>
						新しくガチャを作る
					</Heading>
					<Box mb={10}>
						<Button colorScheme="blue" onClick={create}>
							作成
						</Button>
					</Box>
					<Heading size="lg" mb={4}>
						あなたの作ったガチャ
					</Heading>
					<Box mb={10}>
						<YourGachaList />
					</Box>
				</>
			)}
		</Main>
	);
};

export default Top;
