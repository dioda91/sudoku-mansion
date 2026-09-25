// local-server.js  ——  零依赖静态服务器（绑定所有网卡，手机同 Wi-Fi 也能访问）
const http = require('http');
const fs = require('fs');
const path = require('path');
const os = require('os');
const root = __dirname;
const port = Number(process.argv[2] || 8080);
const types = { '.html':'text/html; charset=utf-8', '.js':'text/javascript; charset=utf-8', '.mjs':'text/javascript; charset=utf-8',
  '.css':'text/css; charset=utf-8', '.json':'application/json; charset=utf-8', '.webmanifest':'application/manifest+json',
  '.png':'image/png', '.jpg':'image/jpeg', '.svg':'image/svg+xml', '.ico':'image/x-icon', '.txt':'text/plain; charset=utf-8',
  '.mp3':'audio/mpeg', '.ogg':'audio/ogg', '.wav':'audio/wav', '.woff2':'font/woff2' };
http.createServer((req, res) => {
  let p = decodeURIComponent(req.url.split('?')[0]);
  if (p.endsWith('/')) p += 'index.html';
  const file = path.join(root, path.normalize(p).replace(/^([.][.][/\\])+/, ''));
  fs.readFile(file, (err, data) => {
    if (err) { res.writeHead(404, {'Content-Type':'text/plain; charset=utf-8'}); res.end('404'); return; }
    res.writeHead(200, { 'Content-Type': types[path.extname(file).toLowerCase()] || 'application/octet-stream', 'Cache-Control':'no-cache' });
    res.end(data);
  });
}).listen(port, '0.0.0.0', () => {
  const ips = [];
  const nets = os.networkInterfaces();
  for (const name of Object.keys(nets)) for (const ni of nets[name] || []) {
    if (ni.family === 'IPv4' && !ni.internal) ips.push(ni.address);
  }
  console.log('PC    : http://127.0.0.1:' + port + '/');
  ips.forEach(ip => console.log('Phone : http://' + ip + ':' + port + '/'));
  if (!ips.length) console.log('Phone : (no LAN address found)');
});