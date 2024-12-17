export type Notification = {
	message: string;
} & NotificationOptions;

type NotificationOptions = {
	icon?: 'info' | 'success' | 'warning' | 'error';
	timeout?: number;
};

class NotificationController {
	constructor() {
	}

	private currentNotification = $state<Notification | null>(null);
	private waitingNotifications = $state<Notification[]>([]);

	public get current() {
		return this.currentNotification;
	}

	private _updateNotifications = () => {
		if (this.waitingNotifications.length > 0 && this.currentNotification === null) {
			this.currentNotification = this.waitingNotifications.shift()!;

			setTimeout(() => {
				this.currentNotification = null;
				this._updateNotifications();
			}, this.currentNotification.timeout || 5000);
		}
	};

	private _notify = (message: string, options?: NotificationOptions) => {
		const notification = { message, ...options };
		this.waitingNotifications.push(notification);
		this._updateNotifications();
	};

	public info = (message: string, timeout?: number) =>
		this._notify(message, {
			timeout,
			icon: 'info',
		});
	public success = (message: string, timeout?: number) =>
		this._notify(message, {
			timeout,
			icon: 'success',
		});
	public error = (message: string, timeout?: number) =>
		this._notify(message, {
			timeout,
			icon: 'error',
		});
	public warn = (message: string, timeout?: number) =>
		this._notify(message, {
			timeout,
			icon: 'warning',
		});

	public dismiss = () => {
		this.currentNotification = null;
		this._updateNotifications();
	};
}

const Notifications = new NotificationController();
export default Notifications;
