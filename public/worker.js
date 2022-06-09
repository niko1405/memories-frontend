self.addEventListener('push', e => {
    const data = e.data.json();

    self.registration.showNotification(data.title, {
        body: data.message,
        icon: data.icon === 'default' ? '/appLogo.png' : data.icon,
        data: {
            url: 'http://localhost:3000/sui'
        },
        // click_action: "http://localhost:3000/sui",
    });
});

self.addEventListener('notificationclick', function(event) {
    event.notification.close();
    event.waitUntil(
      clients.openWindow(event.notification.data.url)
    );
  });