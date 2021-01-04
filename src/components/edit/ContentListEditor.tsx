import React, { memo } from "react";
import {
	DragDropContext,
	Droppable,
	DropResult,
	Draggable,
} from "react-beautiful-dnd";
import { DraftGachaItem } from "@/interfaces";
import { Box, VStack } from "@chakra-ui/react";
import ContentEditor from "@/components/edit/ContentEditor";

interface Props {
	items: DraftGachaItem[];
	update: (props: DraftGachaItem) => void;
	remove: (id: number) => void;
	move: (from: number, to: number) => void;
}

export default memo(
	({ items, update, remove, move }: Props) => {
		const onDragEnd = (result: DropResult) => {
			if (!result.destination) {
				return;
			}

			if (result.destination.index === result.source.index) {
				return;
			}

			move(result.source.index, result.destination.index);
		};

		return (
			<DragDropContext onDragEnd={onDragEnd}>
				<Droppable droppableId="list">
					{(provided) => (
						<VStack
							alignItems="stretch"
							ref={provided.innerRef}
							{...provided.droppableProps}
						>
							{items.map((item, index) => (
								<Draggable
									draggableId={String(item.id)}
									index={index}
									key={item.id}
								>
									{(provided) => (
										<Box
											ref={provided.innerRef}
											{...provided.draggableProps}
											{...provided.dragHandleProps}
											_hover={{ bg: "gray.100" }}
										>
											<ContentEditor
												item={item}
												update={update}
												remove={remove}
											/>
										</Box>
									)}
								</Draggable>
							))}
							{provided.placeholder}
						</VStack>
					)}
				</Droppable>
			</DragDropContext>
		);
	},
	(prev, next) => prev.items === next.items
);
