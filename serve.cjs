const http = require('http');
const fs = require('fs');
const path = require('path');
const root = 'c:/Users/usuar/Downloads/Open Squad';

http.createServer((req, res) => {
  const fp = path.join(root, req.url.split('?')[0]);
  try {
    const data = fs.readFileSync(fp);
    const ext = path.extname(fp);
    const ct = ext === '.html' ? 'text/html' : ext === '.png' ? 'image/png' : 'application/octet-stream';
    res.writeHead(200, { 'Content-Type': ct });
    res.end(data);
  } catch(e) {
    res.writeHead(404);
    res.end('Not found: ' + fp);
  }
}).listen(8767, () => console.log('Server ready on 8767'));
