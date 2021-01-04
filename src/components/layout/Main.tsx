import { Box, Container, useTheme } from "@chakra-ui/react";
import React, { ReactNode } from "react";

interface Props {
	children?: ReactNode;
}

export default ({ children }: Props) => {
	const theme = useTheme();

	return (
		<Container maxW="3xl">
			<Box px={4} py={6}>
				{children}
			</Box>
		</Container>
	);
};
