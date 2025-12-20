import http from 'http';

const server = http.createServer((req, res) => {
  res.writeHead(200, { 'content-type': 'text/plain' });
  res.write('Hello from Bun');
  res.end();
});

server.listen(8000, () => {
  console.log('Listening on http://localhost:8000');
});
