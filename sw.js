const C="sucheop-v14";const FILES=["./","index.html","manifest.json","icon-192.png","icon-512.png","apple-touch-icon.png"];
self.addEventListener("install",e=>{e.waitUntil(caches.open(C).then(c=>c.addAll(FILES)));self.skipWaiting();});
self.addEventListener("activate",e=>{e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k!==C).map(k=>caches.delete(k)))));self.clients.claim();});
self.addEventListener("fetch",e=>{if(e.request.method!=="GET")return;
  const u=new URL(e.request.url);
  const mine=u.origin===self.location.origin, sdk=u.hostname==="www.gstatic.com"&&u.pathname.startsWith("/firebasejs/");
  if(!mine&&!sdk)return;
  e.respondWith(fetch(e.request).then(r=>{const cp=r.clone();caches.open(C).then(c=>c.put(e.request,cp));return r;}).catch(()=>caches.match(e.request,{ignoreSearch:true}).then(r=>r||(mine?caches.match("index.html"):Response.error()))));});

self.addEventListener("push",e=>{let d={};try{d=e.data?e.data.json():{};}catch(_){d={title:"근무 수첩",body:e.data?e.data.text():""};}
  e.waitUntil(self.registration.showNotification(d.title||"근무 수첩",{body:d.body||"",tag:d.tag||undefined,icon:"icon-192.png",badge:"icon-192.png",data:{url:"./"}}));});
self.addEventListener("notificationclick",e=>{e.notification.close();
  e.waitUntil(clients.matchAll({type:"window",includeUncontrolled:true}).then(cs=>{for(const c of cs){if("focus" in c)return c.focus();}return clients.openWindow("./");}));});
