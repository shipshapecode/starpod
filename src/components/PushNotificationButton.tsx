import { useEffect, useState } from 'preact/hooks';
import {
  notificationPermission,
  isSubscribed
} from './notificationState';

interface PushNotificationButtonProps {
  showTitle?: string;
}

// Helper to check if we're in development mode
const isDev = import.meta.env.DEV;

// Helper function for conditional logging
function devLog(...args: unknown[]) {
  if (isDev) {
    console.log(...args);
  }
}

function devError(...args: unknown[]) {
  if (isDev) {
    console.error(...args);
  }
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
      
      // Add keyboard shortcut for test notification (Ctrl+Shift+P or Cmd+Shift+P)
      const handleKeyPress = (e: KeyboardEvent) => {
        if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'P') {
          e.preventDefault();
          sendTestNotification();
        }
      };
      
      window.addEventListener('keydown', handleKeyPress);
      
      return () => {
        window.removeEventListener('keydown', handleKeyPress);
      };
    }
  }, []);

  async function checkSubscription() {
    try {
      const registration = await navigator.serviceWorker.ready;
      const subscription = await registration.pushManager.getSubscription();
      isSubscribed.value = subscription !== null;
    } catch (error) {
      devError('Error checking subscription:', error);
    }
  }

  async function sendTestNotification() {
    try {
      if (!isSubscribed.value) {
        alert('Please enable notifications first before sending a test notification.');
        return;
      }
      
      const registration = await navigator.serviceWorker.ready;
      await registration.showNotification('Test Episode: Building with AI', {
        body: 'Episode 42: A deep dive into AI coding assistants and the future of programming. Join us for an exciting discussion!',
        icon: '/android-chrome-192x192.png',
        badge: '/favicon-32x32.png',
        image: '/android-chrome-384x384.png', // Using episode art placeholder
        tag: 'test-episode',
        requireInteraction: false,
        data: {
          url: '/'
        }
      });
      devLog('Test notification sent successfully');
    } catch (error) {
      devError('Error sending test notification:', error);
      alert('Failed to send test notification. Please try again.');
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

        // Get VAPID key from environment variable or use placeholder for development
        const vapidKey = import.meta.env.PUBLIC_VAPID_KEY || 
          'BEl62iUYgUivxIkv69yViEuiBIa-Ib37J8xQmrPcBKKk6qzqsXBBEDdHDz_D8LViZvZOGSIcjKPi0xhS3IkmJnw';

        // Subscribe to push notifications
        const subscription = await registration.pushManager.subscribe({
          userVisibleOnly: true,
          applicationServerKey: urlBase64ToUint8Array(vapidKey)
        });

        isSubscribed.value = true;

        // Send subscription to server endpoint for storing
        // This will enable triggering notifications when new episodes are published
        if (import.meta.env.PUBLIC_API_URL) {
          try {
            await fetch(`${import.meta.env.PUBLIC_API_URL}/api/subscribe`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(subscription)
            });
            devLog('Push subscription sent to server');
          } catch (error) {
            devError('Failed to send subscription to server:', error);
            // Continue anyway - subscription still works locally
          }
        } else {
          devLog('Push subscription created (server API not configured)');
        }

        // Send welcome notification
        await sendWelcomeNotification(registration);
      }
    } catch (error) {
      devError('Error subscribing to push notifications:', error);
      alert('Failed to enable push notifications. Please try again.');
    }
  }

  async function unsubscribe() {
    try {
      const registration = await navigator.serviceWorker.ready;
      const subscription = await registration.pushManager.getSubscription();

      if (subscription) {
        // Notify server to remove this subscription from the database
        if (import.meta.env.PUBLIC_API_URL) {
          try {
            await fetch(`${import.meta.env.PUBLIC_API_URL}/api/unsubscribe`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ endpoint: subscription.endpoint })
            });
            devLog('Unsubscribe request sent to server');
          } catch (error) {
            devError('Failed to notify server of unsubscribe:', error);
            // Continue anyway - we'll still unsubscribe locally
          }
        }
        
        await subscription.unsubscribe();
        isSubscribed.value = false;
        devLog('Unsubscribed from push notifications');
      }
    } catch (error) {
      devError('Error unsubscribing from push notifications:', error);
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
      devError('Error showing welcome notification:', error);
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
