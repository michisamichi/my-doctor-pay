const CACHE='drpay-personal-v157-20261111';
const ASSETS=['./','./index.html','./manifest.webmanifest','./icon-192.png','./icon-512.png'];
const OLD_CACHES=new Set([
 'drpay-personal-v156-20261111','drpay-personal-v155-20261111', 'drpay-personal-v154-20261111','drpay-personal-v153-20261110','drpay-personal-v152-20261110','drpay-personal-v151-20261109','mydoctorpay-v1-20261109','mydoctorpay-v1.1-20261109',
 'mydoctorpay-v1.2-20261109','mydoctorpay-v1.3-20261109',
 'mydoctorpay-clean-v14-20261109','drpay-v15-20261109b'
]);
const OWN_URLS=new Set(ASSETS.map(path=>new URL(path,self.registration.scope).href));
self.addEventListener('install',event=>event.waitUntil(
 caches.open(CACHE).then(cache=>cache.addAll(ASSETS)).then(()=>self.skipWaiting())
));
self.addEventListener('activate',event=>event.waitUntil(Promise.all([
 caches.keys().then(keys=>Promise.all(keys.filter(key=>OLD_CACHES.has(key)).map(key=>caches.delete(key)))),
 self.clients.claim()
])));
self.addEventListener('fetch',event=>{
 const request=event.request;
 if(request.method!=='GET'||!OWN_URLS.has(request.url))return;
 event.respondWith(fetch(request).then(response=>{
  if(response.ok){const copy=response.clone();caches.open(CACHE).then(cache=>cache.put(request,copy)).catch(()=>{});}
  return response;
 }).catch(()=>caches.match(request)));
});
