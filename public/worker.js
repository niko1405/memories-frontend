self.addEventListener('push', e => {
    const data = e.data.json();

    self.registration.showNotification(data.title, {
        body: data.message,
        icon: data.icon === 'default' ? '/appLogo.png' : data.icon,
        data: {
            url: 'https://memories-project-v1-0.netlify.app/'
        },
    });
});

self.addEventListener('notificationclick', function(event) {
    event.notification.close();
    event.waitUntil(
      clients.openWindow(event.notification.data.url)
    );
  });