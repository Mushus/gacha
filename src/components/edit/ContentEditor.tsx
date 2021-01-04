import React, { memo } from "react";
import {
	Image,
	Input,
	Flex,
	Square,
	Grid,
	NumberInput,
	NumberInputField,
	NumberInputStepper,
	NumberIncrementStepper,
	NumberDecrementStepper,
	FormControl,
	FormLabel,
	Select,
	Box,
	IconButton,
} from "@chakra-ui/react";
import { DeleteIcon } from "@chakra-ui/icons";
import { DraftGachaItem } from "@/interfaces";
import Loading from "../common/Loading";

interface Props {
	item: DraftGachaItem;
	update: (props: DraftGachaItem) => void;
	remove: (id: number) => void;
}

export default memo(
	({ item, update, remove }: Props) => {
		const changeName = (e: React.ChangeEvent<HTMLInputElement>) => {
			update({ ...item, name: e.target.value });
		};

		const changeWeight = (text: any, value: number) => {
			const weight = isNaN(value) ? 0 : value;
			update({ ...item, weight });
		};

		const changeEffect = (e: React.ChangeEvent<HTMLSelectElement>) => {
			update({ ...item, effect: e.target.value as any });
		};

		return (
			<Flex alignItems="start" m={4}>
				<Box>
					<IconButton
						colorScheme="red"
						aria-label="削除"
						icon={<DeleteIcon />}
						onClick={() => remove(item.id)}
					/>
				</Box>
				<Square w={100} bg="#ddd">
					{item.image == null ? (
						<Loading size={100} />
					) : (
						<Image
							boxSize={100}
							objectFit="contain"
							src={item.image}
						/>
					)}
				</Square>
				<Grid
					templateColumns="repeat(auto-fit, minmax(200px, 1fr))"
					gap={6}
					alignItems="stretch"
					marginLeft={4}
					flex="1"
				>
					<FormControl flex="1 0 300px">
						<FormLabel>名前</FormLabel>
						<Input value={item.name} onChange={changeName} />
					</FormControl>
					<FormControl flex="1 0 300px">
						<FormLabel>重み</FormLabel>
						<NumberInput
							value={item.weight}
							onChange={changeWeight}
						>
							<NumberInputField />
							<NumberInputStepper>
								<NumberIncrementStepper />
								<NumberDecrementStepper />
							</NumberInputStepper>
						</NumberInput>
					</FormControl>
					<FormControl flex="1 0 300px">
						<FormLabel>演出{item.effect}</FormLabel>
						<Select value={item.effect} onChange={changeEffect}>
							<option value="n">ノーマル</option>
							<option value="ssr">スーパースペシャルレア</option>
						</Select>
					</FormControl>
				</Grid>
			</Flex>
		);
	},
	(prev, next) => prev.item === next.item
);
