import { useImageConverter } from "@/hooks/EditPage";
import { DraftGacha, DraftGachaItem } from "@/interfaces";
import {
	Box,
	Button,
	FormControl,
	FormLabel,
	Heading,
	Input,
	Text,
} from "@chakra-ui/react";
import ContentListEditor from "./ContentListEditor";
import ImageUploader from "./ImageUploader";
import React from "react";
import useWrapList from "@/hooks/useWrapList";

interface Props {
	id: string;
	data: DraftGacha;
	setData: React.Dispatch<React.SetStateAction<DraftGacha>>;
	save: () => Promise<any>;
	upload: (hash: string, blob: Blob) => Promise<string | null>;
}

export default ({ data, setData, save, upload }: Props) => {
	const handleUpdateName = (e: React.ChangeEvent<HTMLInputElement>) => {
		setData((data) => ({ ...data, name: e.target.value }));
	};

	const setItems = (value: React.SetStateAction<DraftGachaItem[]>) => {
		if (value instanceof Function) {
			setData(({ items, ...other }) => ({
				items: value(items),
				...other,
			}));
		} else {
			setData((prevState) => ({ ...prevState, items: value }));
		}
	};

	const { push, update, move, remove } = useWrapList(data.items, setItems);

	const addEmpties = (count: number) =>
		push(
			...new Array(count).fill(null).map(() => ({
				name: "",
				weight: 10,
				image: null,
				effect: "normal" as const,
			}))
		);

	const updateImage = (id: number, image: string) =>
		setItems((list) => {
			return list.map((item) =>
				item.id === id ? { ...item, image } : item
			);
		});

	const { resize } = useImageConverter();

	const processImage = async (files: File[]) => {
		const ids = addEmpties(files.length);
		await Promise.all(
			files.map(async (file, i) => {
				const id = ids[i];
				const image = await resize(file);
				const url = await upload(...image);
				if (!url) return;
				updateImage(id, url);
			})
		);
	};

	return (
		<>
			<Heading size="lg" mb={10}>
				ガチャ編集
			</Heading>
			<Box mb={6}>
				<FormControl>
					<FormLabel>ガチャの名称</FormLabel>
					<Input value={data.name} onChange={handleUpdateName} />
				</FormControl>
			</Box>
			<Box mb={6}>
				<Text mb={2}>景品</Text>
				<Box
					borderRadius={4}
					shadow="lg"
					border="1px solid rgba(1,1,1,0.1)"
					overflow="hidden"
				>
					<ContentListEditor
						items={data.items}
						update={update}
						remove={remove}
						move={move}
					/>
					<ImageUploader onUpload={processImage} />
				</Box>
			</Box>
			<Box>
				<Button colorScheme="blue" onClick={() => save()}>
					保存
				</Button>
			</Box>
		</>
	);
};
