/* Service worker mínimo para el portal del productor.
   Sin dependencias. Estrategia:
   - Navegaciones (HTML): red primero, si no hay señal responde el index cacheado.
   - Recursos estáticos (JS/CSS/fuentes/imágenes): cache primero, y en segundo
     plano se actualiza. Así la app abre sin internet después del primer uso.
   Los datos del productor viven en localStorage, no dependen de la red. */

const CACHE = 'odisea-productor-v1';
const APP_SHELL = ['/', '/index.html', '/pwa-icon.svg', '/favicon.svg', '/manifest.webmanifest'];

self.addEventListener('install', (event) => {
    self.skipWaiting();
    event.waitUntil(caches.open(CACHE).then((c) => c.addAll(APP_SHELL).catch(() => {})));
});

self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then((keys) =>
            Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k)))
        ).then(() => self.clients.claim())
    );
});

self.addEventListener('fetch', (event) => {
    const { request } = event;
    if (request.method !== 'GET') return;

    const url = new URL(request.url);
    const sameOrigin = url.origin === self.location.origin;
    const isFont = url.origin === 'https://fonts.googleapis.com' || url.origin === 'https://fonts.gstatic.com';

    // Navegaciones → red primero con respaldo al index cacheado
    if (request.mode === 'navigate') {
        event.respondWith(
            fetch(request)
                .then((res) => {
                    caches.open(CACHE).then((c) => c.put('/index.html', res.clone()));
                    return res;
                })
                .catch(() => caches.match('/index.html').then((r) => r || caches.match('/')))
        );
        return;
    }

    // Recursos estáticos → cache primero
    if (sameOrigin || isFont) {
        event.respondWith(
            caches.match(request).then((cached) => {
                const network = fetch(request)
                    .then((res) => {
                        if (res && res.status === 200) {
                            caches.open(CACHE).then((c) => c.put(request, res.clone()));
                        }
                        return res;
                    })
                    .catch(() => cached);
                return cached || network;
            })
        );
    }
});
