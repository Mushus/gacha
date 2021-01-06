import { HStack } from "@chakra-ui/react";
import React from "react";
import { GachaPremium } from "@/interfaces";
import styled from "@emotion/styled";

interface Props {
	premiumList: GachaPremium[];
}

export default ({ premiumList }: Props) => {
	return (
		<HStack position="fixed" bottom={0} left={0} right={0} mr="70px">
			{premiumList.map(({ id, image }) => (
				<Image key={id} src={image} />
			))}
		</HStack>
	);
};

const Image = styled.div<{ src?: string }>`
	background-image: url(${({ src }) => src});
	background-repeat: no-repeat;
	background-position: center;
	background-size: contain;
	width: 100px;
	height: 100px;
	margin-right: -70px;
`;
