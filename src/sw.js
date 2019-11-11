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
    new workbox.strategies.StaleWhileRevalidate({
        cacheName: 'bootstrap-cdn-cache'
    })
)

workbox.routing.registerRoute(
    new RegExp(`http://.*:4567.*`),
    new workbox.strategies.NetworkFirst()
)

self.addEventListener('fetch', event => {
    if(event.request.method === 'POST' || event.request.method === 'DELETE') {
        event.respondWith(
            fetch(event.request).catch(err => {
                return new Response(
                    JSON.stringify({error: `Action is unavailable while app is offline (${err})`}), {
                        headers: { 'Content-Type': 'application/json' }
                    }
                )
            })
        )
    }
})

workbox.precaching.precacheAndRoute(self.__precacheManifest || []);