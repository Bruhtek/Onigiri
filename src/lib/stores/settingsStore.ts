import { cookieWritable } from "./cookieStore";

type ViewSettings = {
	showCover: boolean;
	columns: number;
};

type ReaderSettings = {
	fontSize: number;
	fontFamily: string;
	justify: boolean;
};

export const viewSettings = cookieWritable<ViewSettings>("viewSettings", {
	showCover: true,
	columns: 4,
});

export const readerSettings = cookieWritable<ReaderSettings>("readerSettings", {
	fontSize: 16,
	fontFamily: "sans-serif",
	justify: false,
});
