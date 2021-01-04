import { Flex, useTheme } from "@chakra-ui/react";
import { AddIcon } from "@chakra-ui/icons";
import React from "react";
import { useDropzone } from "react-dropzone";

interface Props {
	onUpload: (f: File[]) => void;
}

export default ({ onUpload }: Props) => {
	const theme = useTheme();

	const onDrop = (acceptedFiles: File[]) => {
		onUpload(acceptedFiles);
	};

	const { getRootProps, getInputProps, isDragActive } = useDropzone({
		onDrop,
		accept: "image/*",
	});

	return (
		<Flex
			{...getRootProps()}
			h={100}
			bgColor={theme.colors.blue["300"]}
			color="white"
			cursor="pointer"
			justifyContent="center"
			alignItems="center"
			_hover={{ bgColor: theme.colors.blue["500"] }}
		>
			<input {...getInputProps()} />
			<AddIcon boxSize={30} />
		</Flex>
	);
};
