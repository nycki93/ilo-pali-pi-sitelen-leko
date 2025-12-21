import http from 'http';
import sharp from 'sharp';

const sitelenWeka = sharp({ create: {
  width: 64,
  height: 32,
  channels: 4,
  background: { r: 200, g: 255, b: 200, alpha: 1 },
}});

const iloToki = http.createServer(async (req, res) => {

  const linjaSijelo = req.url?.match(/\/v1\/([^\/\?]*)/);
  
  if (!linjaSijelo) {
    res.writeHead(404);
    res.end('404 not found');
    return;
  }

  const kulupuNimi = linjaSijelo[1]?.split('-');
  console.log(kulupuNimi);

  const sitelen = await (sitelenWeka
    .composite([
      { input: 'sitelen/kijetesantakalu.png', top: 0, left: 0 },
      { input: 'sitelen/musi.png', top: 0, left: 16 },
    ])
    .png()
    .toBuffer()
    .then(data => sharp(data).resize({ width: 64 * 8, kernel: sharp.kernel.nearest }).toBuffer())
  );

  res.writeHead(200, { 'content-type': 'image/png' });
  res.write(sitelen);
  res.end();
});

iloToki.listen(8000, () => {
  console.log('Listening on http://localhost:8000');
});
