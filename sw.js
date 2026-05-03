// sw.js - Service Worker，负责后台弹出通知
// 必须放在和 index.html 同一目录（仓库根目录）

self.addEventListener('install', () => self.skipWaiting());
self.addEventListener('activate', e => e.waitUntil(self.clients.claim()));

// 接收主页面发来的消息，弹出系统通知
self.addEventListener('message', e => {
    if (e.data && e.data.type === 'SHOW_NOTIFICATION') {
        const { title, body, icon } = e.data;
        self.registration.showNotification(title, {
            body: body,
            icon: icon || '/icon.png',
            badge: icon || '/icon.png',
            vibrate: [200, 100, 200],
            tag: 'chat-notify',         // 同 tag 的通知会覆盖，不堆叠
            renotify: true,             // 即使 tag 相同也重新震动提醒
        });
    }
});

// 点击通知后聚焦到页面
self.addEventListener('notificationclick', e => {
    e.notification.close();
    e.waitUntil(
        self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then(clients => {
            if (clients.length > 0) {
                clients[0].focus();
            } else {
                self.clients.openWindow('/');
            }
        })
    );
});
