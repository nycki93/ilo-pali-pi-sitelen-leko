import http from 'http';
import sharp from 'sharp';

const sitelenSama: Record<string, string> = {
  'ali': 'ale',
  '+open': 'nimiopen',
  '+pini': 'nimipini',
  '+wan': 'liliwan',
  '+tu': 'lilitu',
};

const iloToki = http.createServer(async (req, res) => {

  const linjaSijelo = req.url?.match(/\/v1\/([^\/\?]*)/);
  
  if (!linjaSijelo) {
    res.writeHead(404);
    res.write('404 not found');
    res.end();
    return;
  }

  const kulupuNimi = linjaSijelo[1]?.matchAll(/-?\+?[^-+]+/g) || [];

  // nimi "+sin" li kipisi e linja
  // nimi "+open" li open e nimi
  // nimi "+pini" li pini e nimi
  // nimi "+wan" li sike lili wan
  // nimi "+tu" li sike lili tu
  // nimi "+walo" li walo e monsi
  // nimi "+suli" li suli
  // nimi "+ala" li ala
  // nimi "+ante" li kule ante
  let nanpaSewi = 0;
  let nanpaPoki = 0;
  let nanpaPokiNi = 0;
  let kulupuSitelen = [];
  let kuleMonsi = '#ffffff00';
  let lonAnte = false;
  let lonSuli = false;
  for (let [nimi] of kulupuNimi) {
    if (nimi.startsWith('-')) {
      nimi = nimi.slice(1);
    }
    if (nimi == '+sin') {
      nanpaPokiNi = 0;
      nanpaSewi = nanpaSewi + 1;
      continue;
    }
    if (nimi == '+walo') {
      kuleMonsi = '#ffffffff';
      continue;
    }
    if (nimi == '+suli') {
      lonSuli = true;
      continue;
    }
    if (nimi == '+ante') {
      lonAnte = true;
      continue;
    }
    if (nimi != '+ala') {
      kulupuSitelen.push({
        input: `sitelen/${sitelenSama[nimi] || nimi}.png`,
        top: 16 * nanpaSewi,
        left: 16 * nanpaPokiNi,
      });
    }
    nanpaPokiNi = nanpaPokiNi + 1;
    if (nanpaPokiNi > nanpaPoki) {
      nanpaPoki = nanpaPokiNi;
    }
  }
  nanpaSewi = nanpaSewi + 1;

  let sitelen: Buffer;
  try {
    sitelen = await (sharp({ create: {
        width: 16 * nanpaPoki,
        height: 16 * nanpaSewi,
        channels: 4,
        background: kuleMonsi,
      }})
      .composite(kulupuSitelen)
      .png()
      .toBuffer()
    );

    if (lonAnte) {
      sitelen = await (sharp(sitelen)
        .negate({ alpha: false })
        .toBuffer()
      );
    }

    if (lonSuli) {
      sitelen = await (sharp(sitelen)
        .resize({ 
          width: 128 * nanpaPoki, 
          kernel: sharp.kernel.nearest }
        )
        .toBuffer()
      );
    }

  } catch (pakala) {
    console.log(pakala);
    const linjaPakala = (pakala as Error).message || '';
    const tanPakala = linjaPakala.match(/[^\/]*(?=\.png)/) || [];
    const nimiPakala = tanPakala[0];
    if (nimiPakala) {
      res.writeHead(500);
      res.write(`500 unknown word: ${nimiPakala}`);
      res.end();
      return;
    } else {
      res.writeHead(500);
      res.write('500 unable to render image');
      res.end();
      return;
    }
  }

  res.writeHead(200, { 'content-type': 'image/png' });
  res.write(sitelen);
  res.end();
});

iloToki.listen(8000, () => {
  console.log('Listening on http://localhost:8000');
});
