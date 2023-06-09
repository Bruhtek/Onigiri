import { cookieWritable } from "./cookieStore";
import { writable } from "svelte/store";

export const token = cookieWritable<String>("jnovel_token", "");

export const username = writable<String>("");