self.addEventListener("install", event => {
  self.skipWaiting();
});

self.addEventListener("activate", event => {
  event.waitUntil(self.clients.claim());
});

self.addEventListener("push", event => {
  let data = {};
  try {
    data = event.data ? event.data.json() : {};
  } catch (e) {
    data = { body: event.data ? event.data.text() : "Tens uma atualização no CRM." };
  }

  const title = data.title || "StudioD CRM";
  const options = {
    body: data.body || "Tens uma nova notificação.",
    icon: "/icon-192.png",
    badge: "/icon-192.png",
    data: { url: data.url || "/" }
  };

  event.waitUntil(self.registration.showNotification(title, options));
});

self.addEventListener("notificationclick", event => {
  event.notification.close();
  const url = event.notification.data?.url || "/";
  event.waitUntil(
    clients.matchAll({ type: "window", includeUncontrolled: true }).then(windowClients => {
      for (const client of windowClients) {
        if (client.url.includes(self.location.origin) && "focus" in client) {
          client.focus();
          return client.navigate(url);
        }
      }
      if (clients.openWindow) return clients.openWindow(url);
    })
  );
});
