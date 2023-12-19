import { cookieWritable } from "../types/CookieStoreType";

type ViewSettings = {
	showCover: boolean;
	highCoverQuality: boolean;
	columnCount: number;
	rowHeight: number;
	hideMangas: boolean;
};

export const viewSettings = cookieWritable<ViewSettings>("viewSettings", {
	showCover: true,
	highCoverQuality: false,
	columnCount: 5,
	rowHeight: 200,
	hideMangas: false,
});

export const fontFamilies = {
	"noto-sans": ["Noto Sans", "\"Noto Sans\", sans-serif"],
	"source-sans-3": ["Source Sans 3", "\"Source Sans 3\", sans-serif"],
	"source-serif-4": ["Source Serif 4", "\"Source Serif 4\", serif"],
	"vollkorn": ["Vollkorn", "\"Vollkorn\", serif"],
	"roboto": ["Roboto", "\"Roboto\", sans-serif"],
	"roboto-slab": ["Roboto Slab", "\"Roboto Slab\", serif"],
	"lato": ["Lato", "\"Lato\", sans-serif"],
	"lora": ["Lora", "\"Lora\", serif"],
}

export type FontOptions = keyof typeof fontFamilies;

// @ts-ignore - we assign the needed values in the loop below
export const fontOptions: { [key in FontOptions ]: string } = {};
for (const [key, value] of Object.entries(fontFamilies)) {
	fontOptions[key as FontOptions] = value[0];
}

type ReaderSettings = {
	fontSize: number;
	fontFamily: FontOptions;
	justify: boolean;
	marginVertical: number;
	marginHorizontal: number;
};

export const readerSettings = cookieWritable<ReaderSettings>("readerSettings", {
	fontSize: 16,
	fontFamily: "source-sans-3",
	justify: false,
	marginVertical: 10,
	marginHorizontal: 10,
});
