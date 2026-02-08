import { useEffect, useState } from 'preact/hooks';
import {
  notificationPermission,
  isSubscribed
} from './notificationState';

export default function PushNotificationButton() {
  const [isSupported, setIsSupported] = useState(false);

  useEffect(() => {
    // Check if browser supports notifications
    if ('Notification' in window && 'serviceWorker' in navigator) {
      setIsSupported(true);
      notificationPermission.value = Notification.permission;
      checkSubscription();
    }
  }, []);

  async function checkSubscription() {
    try {
      const registration = await navigator.serviceWorker.ready;
      const subscription = await registration.pushManager.getSubscription();
      isSubscribed.value = subscription !== null;
    } catch (error) {
      console.error('Error checking subscription:', error);
    }
  }

  async function handleClick() {
    if (isSubscribed.value) {
      // Show confirmation before disabling
      if (
        confirm(
          'Are you sure you want to disable push notifications for new episodes?'
        )
      ) {
        await unsubscribe();
      }
    } else {
      await subscribe();
    }
  }

  async function subscribe() {
    try {
      // Request notification permission
      const permission = await Notification.requestPermission();
      notificationPermission.value = permission;

      if (permission === 'granted') {
        // Register service worker
        const registration = await navigator.serviceWorker.register('/sw.js');
        await registration.update();

        // Subscribe to push notifications
        const subscription = await registration.pushManager.subscribe({
          userVisibleOnly: true,
          applicationServerKey: urlBase64ToUint8Array(
            // Using a public VAPID key - in production, this should be configured
            'BEl62iUYgUivxIkv69yViEuiBIa-Ib37J8xQmrPcBKKk6qzqsXBBEDdHDz_D8LViZvZOGSIcjKPi0xhS3IkmJnw'
          )
        });

        isSubscribed.value = true;

        // In a real app, send subscription to your server
        console.log('Push subscription:', subscription);
      }
    } catch (error) {
      console.error('Error subscribing to push notifications:', error);
      alert('Failed to enable push notifications. Please try again.');
    }
  }

  async function unsubscribe() {
    try {
      const registration = await navigator.serviceWorker.ready;
      const subscription = await registration.pushManager.getSubscription();

      if (subscription) {
        await subscription.unsubscribe();
        isSubscribed.value = false;

        // In a real app, notify your server to remove this subscription
        console.log('Unsubscribed from push notifications');
      }
    } catch (error) {
      console.error('Error unsubscribing from push notifications:', error);
      alert('Failed to disable push notifications. Please try again.');
    }
  }

  // Helper function to convert VAPID key
  function urlBase64ToUint8Array(base64String: string) {
    const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
    const base64 = (base64String + padding)
      .replace(/-/g, '+')
      .replace(/_/g, '/');

    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);

    for (let i = 0; i < rawData.length; ++i) {
      outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
  }

  if (!isSupported) {
    return null;
  }

  return (
    <button
      onClick={handleClick}
      class="flex items-center justify-center p-3 text-light-text-body transition-colors hover:text-light-text-heading dark:text-dark-text-body dark:hover:text-white"
      aria-label={
        isSubscribed.value
          ? 'Disable push notifications'
          : 'Enable push notifications'
      }
      title={
        isSubscribed.value
          ? 'Disable push notifications'
          : 'Enable push notifications'
      }
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill={isSubscribed.value ? 'currentColor' : 'none'}
        viewBox="0 0 24 24"
        stroke-width="1.5"
        stroke="currentColor"
        class="h-6 w-6"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0"
        />
      </svg>
    </button>
  );
}
