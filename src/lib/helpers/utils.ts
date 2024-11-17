export const toProperCase = (text: string) => {
	return text[0].toUpperCase() + text.slice(1).toLowerCase();
};

export const waitMS = (ms: number) => {
	return new Promise((resolve) => setTimeout(resolve, ms));
};
