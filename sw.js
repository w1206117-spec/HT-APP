// HT 團隊系統 Service Worker
const CACHE_NAME = 'ht-team-v1';

// Install
self.addEventListener('install', e => {
  self.skipWaiting();
});

// Activate
self.addEventListener('activate', e => {
  e.waitUntil(clients.claim());
});

// Push event - 收到推播時顯示通知
self.addEventListener('push', e => {
  let data = { title: 'HT 團隊系統', body: '你有新的提醒', icon: '/app1.jpg' };
  try {
    data = e.data.json();
  } catch(err) {
    if(e.data) data.body = e.data.text();
  }

  e.waitUntil(
    self.registration.showNotification(data.title || 'HT 團隊系統', {
      body: data.body || '',
      icon: data.icon || '/app1.jpg',
      badge: '/app1.jpg',
      vibrate: [200, 100, 200],
      data: { url: data.url || '/index.html' },
      actions: [
        { action: 'open', title: '開啟系統' },
        { action: 'close', title: '稍後再看' }
      ]
    })
  );
});

// 點擊通知時開啟 App
self.addEventListener('notificationclick', e => {
  e.notification.close();
  if(e.action === 'close') return;
  const url = e.notification.data?.url || '/index.html';
  e.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then(clientList => {
      for(const client of clientList) {
        if(client.url.includes('index.html') && 'focus' in client) {
          return client.focus();
        }
      }
      if(clients.openWindow) return clients.openWindow(url);
    })
  );
});
