import type { Plugin } from "vite";
import { readdirSync } from "node:fs";
export function gardenPwaPlugin(): Plugin {
  return {
    name: "garden-offline-shell",
    apply: "build",
    generateBundle(_options, bundle) {
      const files = [
        "/",
        "/app",
        "/manifest.webmanifest",
        "/icons/icon-192.png",
        "/icons/icon-512.png",
        ...Object.keys(bundle).map((key) => `/${key}`),
        ...readdirSync(new URL("./public/fonts", import.meta.url))
          .filter((key) => !key.startsWith("."))
          .map((key) => `/fonts/${key}`),
      ];
      const version = `garden-shell-${Date.now()}`;
      this.emitFile({
        type: "asset",
        fileName: "sw.js",
        source: `
const CACHE=${JSON.stringify(version)};
const FILES=${JSON.stringify(files)};
self.addEventListener('install', event => { event.waitUntil(caches.open(CACHE).then(cache=>cache.addAll(FILES)).then(()=>self.skipWaiting())); });
self.addEventListener('activate', event => { event.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(key=>key.startsWith('garden-shell-')&&key!==CACHE).map(key=>caches.delete(key)))).then(()=>self.clients.claim())); });
self.addEventListener('fetch', event => {
 const request=event.request; const url=new URL(request.url);
 if(request.method!=='GET'||url.origin!==self.location.origin||url.pathname.startsWith('/api/'))return;
 if(request.mode==='navigate') { event.respondWith(fetch(request).then(response=>{ if(response.ok){const copy=response.clone();caches.open(CACHE).then(cache=>cache.put(request,copy));}return response; }).catch(()=>caches.match(request).then(hit=>hit||caches.match('/'))));return; }
 event.respondWith(caches.match(request).then(hit=>hit||fetch(request).then(response=>{if(response.ok){const copy=response.clone();caches.open(CACHE).then(cache=>cache.put(request,copy));}return response;})));
});`,
      });
    },
  };
}
