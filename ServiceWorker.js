// service-worker.js
console.log('Service Worker is running.');

self.addEventListener('push', event => {
  console.log('Push event received:', event);

  const options = {
    body: event.data.text(),
    icon: 'path/to/icon.png',
    badge: 'path/to/badge.png',
  };

  event.waitUntil(
    self.registration.showNotification('Your Notification Title', options)
  );
});
