// Service Worker for Push Notifications
self.addEventListener('install', () => {
  console.log('Service Worker installing.');
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  console.log('Service Worker activating.');
  event.waitUntil(self.clients.claim());
});

self.addEventListener('push', (event) => {
  console.log('Push notification received:', event);

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
      console.error('Error parsing push data:', e);
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
  console.log('Notification clicked:', event);

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
