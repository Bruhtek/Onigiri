import { z } from 'zod';

export const LoginResponseScheme = z.object({
	id: z.string(),
	ttl: z.string(),
	created: z.string().datetime(),
});

export const OTPResponseScheme = z.object({
	otp: z.string(),
	proof: z.string(),
	ttl: z.number(),
});
export type OTPResponse = z.infer<typeof OTPResponseScheme>;

export enum OTPResponseState {
	NoChanges,
	LoggedIn,
}

export const AccountInfoScheme = z.object({
	id: z.string(),
	email: z.string(),
	username: z.string(),
	country: z.string(),
	created: z.string().datetime(),
	level: z.string(),
	subscriptionStatus: z.string(),
	emailHash: z.string().optional(),
});
