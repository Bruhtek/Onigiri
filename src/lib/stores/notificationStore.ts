import { writable } from "svelte/store";
import type { Notification } from "../types/Notification";

const notificationStore = writable<Notification>(null);

export default notificationStore;
