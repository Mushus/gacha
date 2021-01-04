import React from "react";
import styled from "@emotion/styled";
import ScaleLoader from "react-spinners/ScaleLoader";
import { Flex } from "@chakra-ui/react";

interface Props {
	size?: number;
	color?: string;
}

export default ({ size = 50, color = "#444" }: Props) => {
	return (
		<Flex w={size} h={size} justifyContent="center" alignItems="center">
			<ScaleLoader width={2} height={20} color={color}>
				Loading...
			</ScaleLoader>
		</Flex>
	);
};
