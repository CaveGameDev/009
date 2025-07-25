// This file is your Service Worker. It intercepts network requests.

// Name for your cache storage. Increment this number when you change which files are cached.
const CACHE_NAME = 'minecraft-old-assets-v2'; // Increased version for this fresh start

// List of static files that the Service Worker should immediately try to cache upon installation.
// These are the *local paths* on your Netlify site.
const urlsToPrecache = [
    '/static/old_minecraft_assets/resources_response.txt', // This file will pretend to be the /resources/ folder response
    '/static/old_minecraft_assets/game_response.txt'      // This file will pretend to be the /game/ response
    // Add any other specific assets the old Minecraft client might request directly from minecraft.net
    // For example, if it tries to load 'https://www.minecraft.net/images/terrain.png', you'd add:
    // '/static/old_minecraft_assets/images/terrain.png' (assuming you have that file)
];

// Event: 'install'
// Fired when the Service Worker is first installed. Use this to precache assets.
self.addEventListener('install', (event) => {
    console.log('[Service Worker] Installing...');
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then((cache) => {
                console.log('[Service Worker] Pre-caching essential assets.');
                return cache.addAll(urlsToPrecache);
            })
            .catch((error) => {
                console.error('[Service Worker] Pre-caching failed:', error);
            })
    );
});

// Event: 'activate'
// Fired when the Service Worker is activated (takes control of the page).
// Use this to clean up old caches.
self.addEventListener('activate', (event) => {
    console.log('[Service Worker] Activating...');
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cacheName) => {
                    if (cacheName !== CACHE_NAME) {
                        console.log('[Service Worker] Deleting old cache:', cacheName);
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
    // Ensure the Service Worker takes control of the page immediately
    return self.clients.claim();
});

// Event: 'fetch'
// Fired for every network request made by the controlled pages.
// This is where you intercept and redirect requests.
self.addEventListener('fetch', (event) => {
    const requestUrl = new URL(event.request.url);

    // --- Intercept specific minecraft.net URLs and redirect to your local files ---

    // 1. Intercept 'https://www.minecraft.net/resources/'
    // This is the problematic 'folder' request.
    // Ensure the match is exact for the request you see failing in your network tab.
    if (requestUrl.origin === 'https://www.minecraft.net' && requestUrl.pathname === '/resources/' && requestUrl.search === '') {
        console.log(`[Service Worker] Intercepting ${event.request.url} -> serving local /static/old_minecraft_assets/resources_response.txt`);
        event.respondWith(
            caches.match('/static/old_minecraft_assets/resources_response.txt') // Try to get from cache first
                .then(cachedResponse => {
                    if (cachedResponse) {
                        return cachedResponse;
                    }
                    // If not in cache, fetch from your local Netlify server path
                    return fetch('/static/old_minecraft_assets/resources_response.txt');
                })
                .catch(error => {
                    console.error('[Service Worker] Failed to serve local resources_response.txt:', error);
                    // Return a generic error response if your local file cannot be served
                    return new Response('Failed to load resources response from local cache or server', { status: 500 });
                })
        );
        return; // IMPORTANT: Stop processing this event, we've handled it.
    }

    // 2. Intercept 'https://www.minecraft.net/game/?n=--username&i=WebPlayer'
    // This is the problematic 'dynamic' request.
    // Ensure the match is exact for the request you see failing in your network tab.
    if (requestUrl.origin === 'https://www.minecraft.net' && requestUrl.pathname === '/game/' && requestUrl.search === '?n=--username&i=WebPlayer') {
        console.log(`[Service Worker] Intercepting ${event.request.url} -> serving local /static/old_minecraft_assets/game_response.txt`);
        event.respondWith(
            caches.match('/static/old_minecraft_assets/game_response.txt') // Try to get from cache first
                .then(cachedResponse => {
                    if (cachedResponse) {
                        return cachedResponse;
                    }
                    // If not in cache, fetch from your local Netlify server path
                    return fetch('/static/old_minecraft_assets/game_response.txt');
                })
                .catch(error => {
                    console.error('[Service Worker] Failed to serve local game_response.txt:', error);
                    // Return a generic error response if your local file cannot be served
                    return new Response('Failed to load game response from local cache or server', { status: 500 });
                })
        );
        return; // IMPORTANT: Stop processing this event, we've handled it.
    }

    // 3. Optional: Intercept 'http://minecraft.net/skins/...'
    // If you want the Service Worker to handle skins instead of CheerpJ's networkHook.
    // You should remove the skin networkHook from cheerpjInit if you use this.
    if (requestUrl.origin === 'http://minecraft.net' && requestUrl.pathname.startsWith('/skins/')) {
        console.log(`[Service Worker] Intercepting ${event.request.url} -> serving placeholder skin.`);
        event.respondWith(
            fetch('https://placehold.co/64x64/000000/FFFFFF/png?text=SKIN') // Fetch placeholder from its origin
                .catch(error => {
                    console.error('[Service Worker] Failed to serve skin placeholder:', error);
                    return new Response('Failed to load skin placeholder', { status: 500 });
                })
        );
        return;
    }

    // IMPORTANT: For any other requests NOT matched above, let them go to the network normally.
    // This ensures your other site assets (JARs, etc.) still load.
    event.respondWith(fetch(event.request));
});
