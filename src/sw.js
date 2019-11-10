console.log('sw.js started');

workbox.core.skipWaiting();
workbox.core.clientsClaim();

self.addEventListener('install', event => {
    const asyncInstall = new Promise(resolve => {
        console.log('Waiting to resolve...');
        setTimeout(resolve, 5000);
    });

    event.waitUntil(asyncInstall);
});

self.addEventListener('activate', event => {
    console.log('activate')
})

workbox.routing.registerRoute(
    new RegExp('https:.*min\.(css|js)'),
    workbox.strategies.staleWhileRevalidate({
        cacheName: 'bootstrap-cdn-cache'
    })
)

workbox.routing.registerRoute(
    new RegExp(`http://.*:4567.*`),
    workbox.strategies.networkFirst()
)

workbox.precaching.precacheAndRoute(self.__precacheManifest || []);