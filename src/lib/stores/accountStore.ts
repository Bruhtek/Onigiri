import { cookieWritable } from "../types/CookieStoreType";
import { writable } from "svelte/store";

export const token = cookieWritable<string>("jnovel_token", "");

export const username = writable<string>("");
export const otp = writable<string>("");
export const otp_proof = writable<string>("");