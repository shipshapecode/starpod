import { signal } from '@preact/signals';

export const notificationPermission = signal<NotificationPermission>('default');
export const isSubscribed = signal<boolean>(false);
