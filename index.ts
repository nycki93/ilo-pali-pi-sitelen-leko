import http from 'http';
import sharp from 'sharp';

const nanpaKute = process.env.SITELENLEKO_PORT || 8000;

const sitelenSama: Record<string, string> = {
  'ali': 'ale',
  '+open': 'nimiopen',
  '+pini': 'nimipini',
  '+wan': 'liliwan',
  '+tu': 'lilitu',
};

async function paliSitelen1(
  _kama: http.IncomingMessage, 
  tawa: http.ServerResponse, 
  linja: string,
) {
  const kulupuNimi = linja.matchAll(/-?\+?[^-+]+/g) || [];
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
      tawa.writeHead(500);
      tawa.write(`500 unknown word: ${nimiPakala}`);
      tawa.end();
      return;
    } else {
      tawa.writeHead(500);
      tawa.write('500 unable to render image');
      tawa.end();
      return;
    }
  }

  tawa.writeHead(200, { 'content-type': 'image/png' });
  tawa.write(sitelen);
  tawa.end();
}

async function paliSitelen2(
  _kama: http.IncomingMessage, 
  tawa: http.ServerResponse, 
  linja: string,
) {
  const kulupuNimi = linja.matchAll(/-?\+?[^-+]+/g) || [];
  // nimi "+sin" li kipisi e linja
  // nimi "+open" li open e nimi
  // nimi "+pini" li pini e nimi
  // nimi "+wan" li sike lili wan
  // nimi "+tu" li sike lili tu
  // nimi "+monsi" li walo e monsi
  // mini "+weka" li weka e monsi
  // nimi "+suli" li suli
  // mini "+lili" li lili
  // nimi "+ala" li ala
  // nimi "+ante" li kule ante
  let nanpaSewi = 0;
  let nanpaPoki = 0;
  let nanpaPokiNi = 0;
  let kulupuSitelen = [];
  let kuleMonsi = '#ffffff';
  let lonAnte = false;
  let nanpaSuli = 8;
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
      kuleMonsi = '#ffffff';
      continue;
    }
    if (nimi == '+weka') {
      kuleMonsi = '#00000000';
      continue;
    }
    if (nimi == '+suli') {
      nanpaSuli = nanpaSuli * 2;
      continue;
    }
    if (nimi == '+lili') {
      nanpaSuli = nanpaSuli / 2;
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

    sitelen = await (sharp(sitelen)
      .resize({ 
        width: 16 * nanpaPoki * nanpaSuli,
        kernel: sharp.kernel.nearest }
      )
      .toBuffer()
    );

  } catch (pakala) {
    console.log(pakala);
    const linjaPakala = (pakala as Error).message || '';
    const tanPakala = linjaPakala.match(/[^\/]*(?=\.png)/) || [];
    const nimiPakala = tanPakala[0];
    if (nimiPakala) {
      tawa.writeHead(500);
      tawa.write(`500 unknown word: ${nimiPakala}`);
      tawa.end();
      return;
    } else {
      tawa.writeHead(500);
      tawa.write('500 unable to render image');
      tawa.end();
      return;
    }
  }

  tawa.writeHead(200, { 'content-type': 'image/png' });
  tawa.write(sitelen);
  tawa.end();
}

const iloToki = http.createServer(async (kama, tawa) => {
  const [_, nanpa, linja] = kama.url?.match(/\/(v[0-9]+)\/([^\/\?]*)/) || [];
  if (nanpa == 'v1') {
    return paliSitelen1(kama, tawa, linja || '');
  } else if (nanpa == 'v2') {
    return paliSitelen2(kama, tawa, linja || '');
  } else {
    tawa.writeHead(404);
    tawa.write('404 not found');
    tawa.end();
    return;
  }
});

iloToki.listen(nanpaKute, () => {
  console.log(`Listening on http://localhost:${nanpaKute}`);
});
