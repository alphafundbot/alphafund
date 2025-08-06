const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = process.env.PORT || 6000;

// MIME types map
const MIME_TYPES = {
  '.html': 'text/html',
  '.css': 'text/css',
  '.js': 'text/javascript',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon'
};

const server = http.createServer((req, res) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
  
  // Handle signals endpoint
  if (req.url === '/signals') {
    fs.readFile(path.join(process.env.HOME, 'signals.json'), (err, content) => {
      if (err) {
        res.writeHead(500);
        res.end('Error loading signals');
        return;
      }
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(content);
    });
    return;
  }
  
  // Handle root request
  let filePath = req.url;
  if (filePath === '/') {
    filePath = '/index.html';
  }
  
  // Get the file extension
  const extname = path.extname(filePath);
  const contentType = MIME_TYPES[extname] || 'application/octet-stream';
  
  // Resolve the file path
  filePath = path.join(__dirname, filePath);
  
  // Read and serve the file
  fs.readFile(filePath, (err, content) => {
    if (err) {
      if (err.code === 'ENOENT') {
        // File not found
        res.writeHead(404);
        res.end('404 Not Found');
      } else {
        // Server error
        res.writeHead(500);
        res.end(`Server Error: ${err.code}`);
      }
    } else {
      // Success
      res.writeHead(200, { 'Content-Type': contentType });
      res.end(content, 'utf-8');
    }
  });
});

server.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}/`);
});
