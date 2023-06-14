import { cookieWritable } from "../types/CookieStoreType";
import { writable } from "svelte/store";

export const token = cookieWritable<String>("jnovel_token", "");

export const username = writable<String>("");
