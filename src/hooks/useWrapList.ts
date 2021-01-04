import arrayMove from "array-move";
import { useCallback } from "react";

export default <T extends { id: number }>(
	items: T[],
	dispatch: React.Dispatch<React.SetStateAction<T[]>>
) => {
	const push = (...values: Omit<T, "id">[]) => {
		let id = Math.max(-1, ...items.map(({ id }) => id)) + 1;
		const ids: number[] = [];
		const addedItems = values.map(
			(value, index): T => {
				const newId = id + index;
				ids.push(newId);
				return {
					...value,
					id: newId,
				} as any;
			}
		);
		dispatch([...items, ...addedItems]);
		return ids;
	};

	const update = (value: T) =>
		dispatch((list) =>
			list.map((item) => (value.id === item.id ? value : item))
		);

	const remove = (id: number) =>
		dispatch((list) => list.filter((item) => item.id !== id));

	const move = (from: number, to: number) => {
		dispatch((list) => arrayMove(list, from, to));
	};

	return { push, update, remove, move };
};
