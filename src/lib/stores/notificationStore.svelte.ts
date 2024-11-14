export type Notification = {
	message: string;
} & NotificationOptions;

type NotificationOptions = {
	icon?: 'info' | 'success' | 'warning' | 'error';
	timeout?: number;
};

function createNotificationStore() {
	let currentNotification = $state<Notification | null>(null);
	const waitingNotifications = $state<Notification[]>([]);

	const updateNotifications = () => {
		if (waitingNotifications.length > 0 && currentNotification === null) {
			currentNotification = waitingNotifications.shift()!;

			setTimeout(() => {
				currentNotification = null;
				updateNotifications();
			}, currentNotification.timeout || 5000);
		}
	};

	const notify = (message: string, options?: NotificationOptions) => {
		const notification = { message, ...options };
		waitingNotifications.push(notification);
		updateNotifications();
	};

	const info = (message: string, timeout?: number) =>
		notify(message, {
			timeout,
			icon: 'info',
		});
	const success = (message: string, timeout?: number) =>
		notify(message, {
			timeout,
			icon: 'success',
		});
	const error = (message: string, timeout?: number) =>
		notify(message, {
			timeout,
			icon: 'error',
		});
	const warn = (message: string, timeout?: number) =>
		notify(message, {
			timeout,
			icon: 'warning',
		});

	const dismiss = () => {
		currentNotification = null;
		updateNotifications();
	};

	return {
		dismiss,
		get notification() {
			return currentNotification;
		},
		info,
		success,
		warn,
		error,
	};
}

const notificationStore = createNotificationStore();

export default notificationStore;
