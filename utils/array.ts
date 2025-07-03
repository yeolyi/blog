export function shuffled<T>(array: T[]): T[] {
	const result = [...array];
	let currentIndex = result.length;

	while (currentIndex !== 0) {
		const randomIndex = Math.floor(Math.random() * currentIndex);
		currentIndex--;

		// And swap it with the current element.
		[result[currentIndex], result[randomIndex]] = [
			result[randomIndex],
			result[currentIndex],
		];
	}

	return result;
}
