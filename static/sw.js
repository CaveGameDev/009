// static/sw.js

// Name for your cache storage. Increment this number when you change which files are cached.
const CACHE_NAME = 'minecraft-old-assets-v4'; // Increment version to ensure new SW is activated

// List of static files that the Service Worker should immediately try to cache upon installation.
// THESE ARE THE CORRECTED LOCAL PATHS ON YOUR NETLIFY SITE.
const urlsToPrecache = [
    '/old_minecraft_assets/game_response.txt',       // CORRECTED path
    '/old_minecraft_assets/resources_response.txt',  // CORRECTED path
    '/old_minecraft_assets/play_response.txt',       // CORRECTED path
    '/old_minecraft_assets/skins/WebPlayer.png',     // CORRECTED path
    // Add any other specific assets the old Minecraft client might request directly from minecraft.net
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
                // Important: If a precache fails, it will prevent the SW from installing.
                // Check browser console for network errors on these paths.
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

    // --- DEBUGGING START ---
    console.groupCollapsed(`[Service Worker] Intercepting fetch: ${event.request.url}`);
    console.log('  Origin:', requestUrl.origin);
    console.log('  Pathname:', requestUrl.pathname);
    console.log('  Search:', requestUrl.search);
    console.log('  Method:', event.request.method);
    console.groupEnd();
    // --- DEBUGGING END ---


    // 1. Rule for 'https://www.minecraft.net/game/?n=--username&i=WebPlayer'
    if (requestUrl.origin === 'https://www.minecraft.net' &&
        requestUrl.pathname === '/game/' &&
        requestUrl.search === '?n=--username&i=WebPlayer') {

        console.log(`[Service Worker] **** MATCHED! Intercepting game URL: ${event.request.url} ****`);
        event.respondWith(
            // CORRECTED PATH: Removed /static
            caches.match('/old_minecraft_assets/game_response.txt')
                .then(cachedResponse => {
                    if (cachedResponse) {
                        console.log('[Service Worker] Serving game_response.txt from cache.');
                        return cachedResponse;
                    }
                    console.log('[Service Worker] Serving game_response.txt from network (local).');
                    // CORRECTED PATH: Removed /static
                    return fetch('/old_minecraft_assets/game_response.txt');
                })
                .catch(error => {
                    console.error('[Service Worker] Failed to serve local game_response.txt:', error);
                    return new Response('Failed to load game response from local cache or server', { status: 500 });
                })
        );
        return;
    }

    // 2. Rule for 'http://www.minecraft.net/resources/'
    // Important: Your console showed a 404 for https://in-20091223-2.netlify.app/resources/
    // This SW rule only intercepts the ORIGINAL http://minecraft.net/resources/ URL.
    // If you still get a 404 for the netlify.app/resources/ URL, it means a networkHook
    // is active, or the game is directly requesting that local URL without SW intervention.
    if (requestUrl.origin === 'http://www.minecraft.net' && requestUrl.pathname === '/resources/') {
        console.log(`[Service Worker] **** MATCHED! Intercepting resources URL: ${event.request.url} ****`);
        event.respondWith(
            // CORRECTED PATH: Removed /static
            caches.match('/old_minecraft_assets/resources_response.txt')
                .then(cachedResponse => {
                    if (cachedResponse) {
                        console.log('[Service Worker] Serving resources_response.txt from cache.');
                        return cachedResponse;
                    }
                    console.log('[Service Worker] Serving resources_response.txt from network (local).');
                    // CORRECTED PATH: Removed /static
                    return fetch('/old_minecraft_assets/resources_response.txt');
                })
                .catch(error => {
                    console.error('[Service Worker] Failed to serve local resources_response.txt:', error);
                    return new Response('Failed to load resources response', { status: 500 });
                })
        );
        return;
    }

    // 3. Rule for 'http://www.minecraft.net/play.jsp?n=DECRAFT_Player&s=0'
    if (requestUrl.origin === 'http://www.minecraft.net' &&
        requestUrl.pathname === '/play.jsp' &&
        requestUrl.search === '?n=DECRAFT_Player&s=0') {

        console.log(`[Service Worker] **** MATCHED! Intercepting play.jsp URL: ${event.request.url} ****`);
        event.respondWith(
            // CORRECTED PATH: Removed /static
            caches.match('/old_minecraft_assets/play_response.txt')
                .then(cachedResponse => {
                    if (cachedResponse) {
                        console.log('[Service Worker] Serving play_response.txt from cache.');
                        return cachedResponse;
                    }
                    console.log('[Service Worker] Serving play_response.txt from network (local).');
                    // CORRECTED PATH: Removed /static
                    return fetch('/old_minecraft_assets/play_response.txt');
                })
                .catch(error => {
                    console.error('[Service Worker] Failed to serve local play_response.txt:', error);
                    return new Response('Failed to load play.jsp response', { status: 500 });
                })
        );
        return;
    }

    // 4. Rule for Skins: 'http://minecraft.net/skins/...'
    if (requestUrl.origin === 'http://minecraft.net' && requestUrl.pathname.startsWith('/skins/')) {
        const skinFileName = requestUrl.pathname.split('/').pop();
        const localSkinPath = `/old_minecraft_assets/skins/${skinFileName}`; // CORRECTED PATH: Removed /static

        console.log(`[Service Worker] Intercepting skin URL: ${event.request.url} -> serving local ${localSkinPath}`);
        event.respondWith(
            caches.match(localSkinPath)
                .then(cachedResponse => {
                    if (cachedResponse) {
                        console.log('[Service Worker] Serving skin from cache.');
                        return cachedResponse;
                    }
                    console.log('[Service Worker] Serving skin from network (local).');
                    return fetch(localSkinPath);
                })
                .catch(error => {
                    console.error('[Service Worker] Failed to serve local skin:', error);
                    return new Response('Failed to load skin', { status: 500 });
                })
        );
        return;
    }

    // IMPORTANT: For any other requests NOT matched by the above rules, let them go to the network normally.
    event.respondWith(fetch(event.request));
});
