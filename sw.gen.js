"use strict";
/*
  Simple service worker generator.
  It reads a list of known static assets and writes a service worker (sw.js)
  that pre-caches them and serves cache-first offline.
*/
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
// Note: This script is written in TS so we can compile alongside app TS.
// It uses Node's fs and path at build time (not in browser).
// @ts-ignore - Node types may not be available in the project's tsconfig include
var fs = require("fs/promises");
// @ts-ignore
var path = require("path");
// @ts-ignore
var crypto = require("crypto");
var isDev = process.argv.includes('--dev');
// Target directory can be provided via env TARGET_DIR or first CLI arg.
var targetArg = process.env.TARGET_DIR || process.argv[2];
var DIST = path.resolve(targetArg || __dirname);
var OUTPUT = path.resolve(DIST, 'sw.js');
var DEV_SW = "// Dev service worker: unregisters itself and reloads clients.\nself.addEventListener('install', (e) => {\n  self.skipWaiting();\n});\nself.addEventListener('activate', (e) => {\n  e.waitUntil(\n    self.registration.unregister().then(() => {\n      return self.clients.matchAll();\n    }).then((clients) => {\n      clients.forEach((client) => client.navigate(client.url));\n    })\n  );\n});\nself.addEventListener('fetch', (e) => {\n  // No-op, just fall back to network.\n});\n";
// Files we know we need after bundling/copy
var STATIC_FILES = [
    'index.html',
    'bundle.js',
    'styles.css',
    'favicon.png',
    'manifest.webmanifest'
];
// External assets referenced from index.html that we want to pre-cache for offline.
var EXTERNAL_ASSETS = [
    'https://cdn.jsdelivr.net/npm/@magenta/music@1.23.1'
];
function fileExists(p) {
    return __awaiter(this, void 0, void 0, function () {
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    _b.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, fs.access(p)];
                case 1:
                    _b.sent();
                    return [2 /*return*/, true];
                case 2:
                    _a = _b.sent();
                    return [2 /*return*/, false];
                case 3: return [2 /*return*/];
            }
        });
    });
}
function main() {
    return __awaiter(this, void 0, void 0, function () {
        var assets, _i, STATIC_FILES_1, f, p, extraGlobs, distFiles, _a, _loop_1, _b, distFiles_1, f, _c, EXTERNAL_ASSETS_1, u, hash, cacheName, sw, prev, _d;
        return __generator(this, function (_e) {
            switch (_e.label) {
                case 0:
                    if (!isDev) return [3 /*break*/, 2];
                    return [4 /*yield*/, fs.writeFile(OUTPUT, DEV_SW, 'utf-8')];
                case 1:
                    _e.sent();
                    console.log("Generated dev service worker in ".concat(OUTPUT, "."));
                    return [2 /*return*/];
                case 2:
                    assets = [];
                    _i = 0, STATIC_FILES_1 = STATIC_FILES;
                    _e.label = 3;
                case 3:
                    if (!(_i < STATIC_FILES_1.length)) return [3 /*break*/, 6];
                    f = STATIC_FILES_1[_i];
                    p = path.join(DIST, f);
                    return [4 /*yield*/, fileExists(p)];
                case 4:
                    if (_e.sent())
                        assets.push("/".concat(f));
                    _e.label = 5;
                case 5:
                    _i++;
                    return [3 /*break*/, 3];
                case 6:
                    extraGlobs = ['.wasm', '.mp3', '.wav', '.ogg', '.woff', '.woff2'];
                    distFiles = [];
                    _e.label = 7;
                case 7:
                    _e.trys.push([7, 9, , 10]);
                    return [4 /*yield*/, fs.readdir(DIST)];
                case 8:
                    distFiles = _e.sent();
                    return [3 /*break*/, 10];
                case 9:
                    _a = _e.sent();
                    return [3 /*break*/, 10];
                case 10:
                    _loop_1 = function (f) {
                        if (extraGlobs.some(function (ext) { return f.endsWith(ext); })) {
                            if (!assets.includes("/".concat(f)))
                                assets.push("/".concat(f));
                        }
                    };
                    for (_b = 0, distFiles_1 = distFiles; _b < distFiles_1.length; _b++) {
                        f = distFiles_1[_b];
                        _loop_1(f);
                    }
                    // Include external assets
                    for (_c = 0, EXTERNAL_ASSETS_1 = EXTERNAL_ASSETS; _c < EXTERNAL_ASSETS_1.length; _c++) {
                        u = EXTERNAL_ASSETS_1[_c];
                        assets.push(u);
                    }
                    hash = crypto.createHash('sha256').update(JSON.stringify(assets)).digest('hex').slice(0, 8);
                    cacheName = 'mdict-cache-v1-' + hash;
                    sw = "// Auto-generated service worker. Do not edit directly.\nself.addEventListener('message', (event) => {\n  if (event.data && event.data.type === 'SKIP_WAITING') {\n    self.skipWaiting();\n  }\n});\n\nself.addEventListener('install', (event) => {\n  event.waitUntil(\n    caches.open('".concat(cacheName, "').then((cache) => cache.addAll(").concat(JSON.stringify(assets), "))\n  );\n  // Don't wait for user action, prepare to activate immediately\n  self.skipWaiting();\n});\n\nself.addEventListener('activate', (event) => {\n  event.waitUntil(\n    caches.keys().then((keys) => Promise.all(keys.map((k) => k === '").concat(cacheName, "' ? undefined : caches.delete(k))))\n      .then(() => self.clients.claim())\n  );\n});\n\nself.addEventListener('fetch', (event) => {\n  const req = event.request;\n  // Bypass non-GET\n  if (req.method !== 'GET') return;\n\n  const url = new URL(req.url);\n  \n  // NEVER cache sw.js - always fetch from network to detect updates\n  if (url.pathname === '/sw.js') {\n    event.respondWith(fetch(req));\n    return;\n  }\n\n  // Network-then-cache for magenta CDN to keep it fresh, fallback to cache\n  if (url.hostname.includes('cdn.jsdelivr.net') || (url.hostname.endsWith('storage.googleapis.com') && url.pathname.includes('/magentadata/'))) {\n    event.respondWith(\n      fetch(req).then((res) => {\n        const resClone = res.clone();\n        caches.open('").concat(cacheName, "').then((c) => c.put(req, resClone)).catch(() => {});\n        return res;\n      }).catch(() => caches.match(req))\n    );\n    return;\n  }\n\n  // Network-first for index.html to ensure updates, cache-first for other assets\n  if (url.pathname === '/' || url.pathname === '/index.html') {\n    event.respondWith(\n      fetch(req).then((res) => {\n        const resClone = res.clone();\n        caches.open('").concat(cacheName, "').then((c) => c.put(req, resClone)).catch(() => {});\n        return res;\n      }).catch(() => caches.match(req))\n    );\n    return;\n  }\n\n  // Cache-first for other app shell & assets\n  event.respondWith(\n    caches.match(req).then((cached) => cached || fetch(req).then((res) => {\n      const resClone = res.clone();\n      caches.open('").concat(cacheName, "').then((c) => c.put(req, resClone)).catch(() => {});\n      return res;\n    }).catch(() => {\n      // Offline fallback to index for navigation requests\n      if (req.mode === 'navigate') return caches.match('/index.html');\n      return new Response('Offline', { status: 503, statusText: 'Offline' });\n    }))\n  );\n});\n");
                    prev = '';
                    return [4 /*yield*/, fileExists(OUTPUT)];
                case 11:
                    if (!_e.sent()) return [3 /*break*/, 15];
                    _e.label = 12;
                case 12:
                    _e.trys.push([12, 14, , 15]);
                    return [4 /*yield*/, fs.readFile(OUTPUT, 'utf-8')];
                case 13:
                    prev = _e.sent();
                    return [3 /*break*/, 15];
                case 14:
                    _d = _e.sent();
                    return [3 /*break*/, 15];
                case 15:
                    if (!(prev !== sw)) return [3 /*break*/, 17];
                    return [4 /*yield*/, fs.writeFile(OUTPUT, sw, 'utf-8')];
                case 16:
                    _e.sent();
                    console.log("Generated ".concat(OUTPUT, " with ").concat(assets.length, " assets."));
                    return [3 /*break*/, 18];
                case 17:
                    console.log("No changes for ".concat(OUTPUT, " (").concat(assets.length, " assets)."));
                    _e.label = 18;
                case 18: return [2 /*return*/];
            }
        });
    });
}
main().catch(function (e) {
    console.error(e);
    process.exit(1);
});
