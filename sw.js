/**
 * 识字乐园 - Service Worker
 * 负责离线缓存：首次安装后，所有学习内容可离线使用
 */

const CACHE_NAME = 'shizileyuan-v6';

// 预缓存列表：所有核心文件
const PRE_CACHE_URLS = [
  './',
  './index.html',
  './manifest.json',
  './css/style.css',
  './js/storage.js',
  './js/tts.js',
  './js/data.js',
  './js/home.js',
  './js/learn.js',
  './js/practice.js',
  './js/write.js',
  './js/review.js',
  './js/app.js',
  './assets/icon-192.png',
  './assets/icon-512.png',
  './assets/apple-touch-icon.png',
  // Hanzi Writer CDN
  'https://cdn.jsdelivr.net/npm/hanzi-writer@3.5/dist/hanzi-writer.min.js'
];

// ===== 安装：预缓存核心文件 =====
self.addEventListener('install', function(event) {
  console.log('[SW] 正在安装...');
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(function(cache) {
        console.log('[SW] 预缓存核心文件...');
        // 逐个缓存，单个失败不影响整体
        return Promise.allSettled(
          PRE_CACHE_URLS.map(function(url) {
            return cache.add(url).catch(function(err) {
              console.warn('[SW] 缓存失败（非致命）:', url, err);
            });
          })
        );
      })
      .then(function() {
        console.log('[SW] 安装完成，跳过等待');
        return self.skipWaiting();
      })
  );
});

// ===== 激活：清理旧缓存 =====
self.addEventListener('activate', function(event) {
  console.log('[SW] 正在激活...');
  event.waitUntil(
    caches.keys().then(function(keys) {
      return Promise.all(
        keys.filter(function(k) { return k !== CACHE_NAME; })
            .map(function(k) {
              console.log('[SW] 删除旧缓存:', k);
              return caches.delete(k);
            })
      );
    }).then(function() {
      console.log('[SW] 激活完成，接管所有页面');
      return self.clients.claim();
    })
  );
});

// ===== 请求拦截：Cache-First 策略 =====
self.addEventListener('fetch', function(event) {
  // 只处理 GET 请求
  if (event.request.method !== 'GET') return;

  event.respondWith(
    caches.match(event.request).then(function(cached) {
      // 缓存命中：直接返回
      if (cached) {
        return cached;
      }

      // 缓存未命中：尝试网络请求
      return fetch(event.request).then(function(response) {
        // 只缓存成功的响应
        if (!response || response.status !== 200 || response.type !== 'basic') {
          return response;
        }

        // 动态缓存新资源
        var clone = response.clone();
        caches.open(CACHE_NAME).then(function(cache) {
          cache.put(event.request, clone);
        });

        return response;
      }).catch(function() {
        // 离线且无缓存：返回离线提示页
        if (event.request.headers.get('accept') &&
            event.request.headers.get('accept').includes('text/html')) {
          return caches.match('./index.html');
        }
        // 其他资源静默失败
        return new Response('', { status: 408 });
      });
    })
  );
});
