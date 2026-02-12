// Service Worker for Push Notifications

// Helper for conditional logging in development
const isDev = self.location.hostname === 'localhost' || self.location.hostname === '127.0.0.1';

function devLog(...args) {
  if (isDev) {
    console.log(...args);
  }
}

function devError(...args) {
  if (isDev) {
    console.error(...args);
  }
}

self.addEventListener('install', () => {
  devLog('Service Worker installing.');
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  devLog('Service Worker activating.');
  event.waitUntil(self.clients.claim());
});

self.addEventListener('push', (event) => {
  devLog('Push notification received:', event);

  let data = {
    title: 'New Whiskey Web and Whatnot Episode',
    body: 'A new episode is now available!',
    icon: '/android-chrome-192x192.png',
    badge: '/favicon-32x32.png',
    tag: 'new-episode',
    url: '/'
  };

  if (event.data) {
    try {
      const pushData = event.data.json();
      // Merge received data with defaults
      data = { ...data, ...pushData };
    } catch (e) {
      devError('Error parsing push data:', e);
    }
  }

  const notificationOptions = {
    body: data.body,
    icon: data.icon,
    badge: data.badge,
    tag: data.tag,
    data: { url: data.url },
    requireInteraction: false
  };

  // Add image if provided (episode art)
  if (data.image) {
    notificationOptions.image = data.image;
  }

  const promiseChain = self.registration.showNotification(
    data.title,
    notificationOptions
  );

  event.waitUntil(promiseChain);
});

self.addEventListener('notificationclick', (event) => {
  devLog('Notification clicked:', event);

  event.notification.close();

  // Navigate to the episode or homepage
  const urlToOpen = new URL(
    event.notification.data?.url || '/',
    self.location.origin
  ).href;

  event.waitUntil(
    self.clients
      .matchAll({ type: 'window', includeUncontrolled: true })
      .then((clientList) => {
        // Check if a window is already open
        for (const client of clientList) {
          const clientPath = new URL(client.url).pathname;
          const targetPath = new URL(urlToOpen).pathname;
          if (clientPath === targetPath && 'focus' in client) {
            return client.focus();
          }
        }
        // Open a new window if none exists
        if (self.clients.openWindow) {
          return self.clients.openWindow(urlToOpen);
        }
      })
  );
});
