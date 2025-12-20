import http from 'http';
import sharp from 'sharp';

const background = sharp({ create: {
  width: 64,
  height: 32,
  channels: 4,
  background: { r: 255, g: 255, b: 255, alpha: 1 },
}});

const server = http.createServer(async (req, res) => {

  const img = await (background
    .composite([
      { input: 'sitelen/kijetesantakalu.png', top: 0, left: 0 },
      { input: 'sitelen/musi.png', top: 0, left: 16 },
    ])
    .png()
    .toBuffer()
    .then(data => sharp(data).resize({ width: 64 * 8, kernel: sharp.kernel.nearest }).toBuffer())
  );

  res.writeHead(200, { 'content-type': 'image/png' });
  res.write(img);
  res.end();
});

server.listen(8000, () => {
  console.log('Listening on http://localhost:8000');
});
