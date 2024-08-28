export type Notification = {
	title: string;
	message: string;
	icon?: string;
	timeout?: number;
}

function createNotificationStore() {
	let currentNotification = $state<Notification | null>(null);
	const waitingNotifications = $state<Notification[]>([]);

	const updateNotifications = () => {
		if(waitingNotifications.length > 0 && currentNotification === null) {
			currentNotification = waitingNotifications.shift()!;
			console.log("New notification", currentNotification);

			setTimeout(() => {
				currentNotification = null;
				updateNotifications();
			}, currentNotification.timeout || 5000);
		}
	}

	const notify = (notification: Notification) => {
		waitingNotifications.push(notification);
		updateNotifications();
	}

	const dismiss = () => {
		currentNotification = null;
		updateNotifications();
	}

	return {
		notify,
		dismiss,
		get notification() {
			return currentNotification;
		}
	}
}

const notificationStore = createNotificationStore();

export default notificationStore;
