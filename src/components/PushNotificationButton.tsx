import { useEffect, useState } from 'preact/hooks';
import {
  notificationPermission,
  isSubscribed
} from './notificationState';

interface PushNotificationButtonProps {
  showTitle?: string;
}

export default function PushNotificationButton({
  showTitle = 'Whiskey Web and Whatnot'
}: PushNotificationButtonProps) {
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

        // TODO: Configure VAPID key via environment variable in production
        // For now, using a placeholder VAPID key for demonstration
        const vapidKey =
          'BEl62iUYgUivxIkv69yViEuiBIa-Ib37J8xQmrPcBKKk6qzqsXBBEDdHDz_D8LViZvZOGSIcjKPi0xhS3IkmJnw';

        // Subscribe to push notifications
        const subscription = await registration.pushManager.subscribe({
          userVisibleOnly: true,
          applicationServerKey: urlBase64ToUint8Array(vapidKey)
        });

        isSubscribed.value = true;

        // TODO: Send subscription to server endpoint for storing
        // This will enable triggering notifications when new episodes are published
        // Example: await fetch('/api/subscribe', { method: 'POST', body: JSON.stringify(subscription) })
        console.log('Push subscription created (not yet sent to server)');

        // Send welcome notification
        await sendWelcomeNotification(registration);
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

        // TODO: Notify server to remove this subscription from the database
        // Example: await fetch('/api/unsubscribe', { method: 'POST', body: JSON.stringify({ endpoint: subscription.endpoint }) })
        console.log('Unsubscribed from push notifications');
      }
    } catch (error) {
      console.error('Error unsubscribing from push notifications:', error);
      alert('Failed to disable push notifications. Please try again.');
    }
  }

  // Send welcome notification after subscription
  async function sendWelcomeNotification(
    registration: ServiceWorkerRegistration
  ) {
    try {
      await registration.showNotification(`Welcome to ${showTitle}!`, {
        body: "You're all set! We'll notify you when new episodes are published.",
        icon: '/android-chrome-192x192.png',
        badge: '/favicon-32x32.png',
        tag: 'welcome',
        requireInteraction: false,
        data: {
          url: '/'
        }
      });
    } catch (error) {
      console.error('Error showing welcome notification:', error);
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
      class={`gradient-icon h-6 w-6 transition-all ${
        isSubscribed.value ? 'opacity-100' : 'opacity-60'
      }`}
      style={{
        maskImage: 'url(/images/bell.svg)',
        maskSize: 'contain',
        maskRepeat: 'no-repeat',
        maskPosition: 'center'
      }}
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
    />
  );
}
