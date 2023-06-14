import { cookieWritable } from "./cookieStore";

type ViewSettings = {
	showCover: boolean;
	highCoverQuality: boolean;
	// minimal column width in pixels (used for calculating the column count)
	columnSize: number;
	columnGap: number;
};

type ReaderSettings = {
	fontSize: number;
	fontFamily: string;
	justify: boolean;
	marginVertical: number;
	marginHorizontal: number;
};

export const viewSettings = cookieWritable<ViewSettings>("viewSettings", {
	showCover: true,
	highCoverQuality: false,
	columnSize: 120,
	columnGap: 10,
});

export const readerSettings = cookieWritable<ReaderSettings>("readerSettings", {
	fontSize: 16,
	fontFamily: "sans-serif",
	justify: false,
	marginVertical: 10,
	marginHorizontal: 10,
});
