export interface Otp4appGenerate {
	/// 6 - otp length
	otp: string;
	/// 6 - otp length
	proof: string;
	/// 600 - 10 minutes - otp timeout
	ttl: number;
}

export interface Otp4appCheck {
	/// The generated token
	id: string;
	/// ttl - a number with s at the end
	ttl: string;
	/// iso string
	created: string;
}

export interface Login {
	/// The generated token
	id: string;
	/// a number with s at the end, probably the token validity time
	ttl: string;
	/// iso string
	created: string;
}
