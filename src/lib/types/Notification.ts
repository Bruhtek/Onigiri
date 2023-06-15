export type Notification = {
	type: "success" | "error" | "warning" | "info";
	message: string;
	duration?: number;
};
