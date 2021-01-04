import { Text } from "@chakra-ui/react";
import React, { ReactNode } from "react";
import { Link, LinkProps } from "react-router-dom";

interface Props extends LinkProps {
	children?: ReactNode;
}

export default ({ children, ...linkProps }: Props) => {
	return (
		<Link {...linkProps}>
			<Text as="span" decoration="underline" colorScheme="blue">
				{children}
			</Text>
		</Link>
	);
};
