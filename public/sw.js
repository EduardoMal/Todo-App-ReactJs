self.addEventListener("install", (e) => {
  self.skipWaiting();
});

self.addEventListener("activate", (e) => {
  e.waitUntil(self.clients.claim());
});

self.addEventListener("message", (e) => {
  const data = e.data ? e.data : {};

  const title = data.title || "Default Title";
  const options = {
    body: data.body || "You have a new message!",
    tag: data.data.tag,
    icon: "icon192.png",
    badge: "/icon192.png",
    data: { url: data.url || "/" }, // Store extra data
    actions: [
      { action: "open", title: "Open App" },
      { action: "dismiss", title: "Dismiss" },
    ],
  };

  e.waitUntil(self.registration.showNotification(title, options));
});

self.addEventListener("notificationclick", (e) => {
  if (e.action === "open") {
    e.waitUntil(clients.openWindow("/"));
  }
});
