type ResultSuccess<T> = {
	error: false;
	data: T;
};
type ResultError = {
	error: string;
};
export type Result<T> = ResultSuccess<T> | ResultError;
