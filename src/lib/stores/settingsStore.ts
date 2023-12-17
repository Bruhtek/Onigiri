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

type ReaderSettings = {
	fontSize: number;
	fontFamily: string;
	justify: boolean;
	marginVertical: number;
	marginHorizontal: number;
};

export const readerSettings = cookieWritable<ReaderSettings>("readerSettings", {
	fontSize: 16,
	fontFamily: "sans-serif",
	justify: false,
	marginVertical: 10,
	marginHorizontal: 10,
});
