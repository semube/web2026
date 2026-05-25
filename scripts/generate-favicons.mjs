import fs from 'node:fs/promises';
import path from 'node:path';
import sharp from 'sharp';
import pngToIco from 'png-to-ico';

const root = process.cwd();
const source = path.join(root, 'assets/images/header-smb.jpg');
const outDir = path.join(root, 'assets/favicons');
await fs.mkdir(outDir, { recursive: true });

const metadata = await sharp(source).metadata();
const cropSize = Math.min(metadata.width, metadata.height);
const cropLeft = Math.round((metadata.width - cropSize) / 2);
// Keep the crop slightly high so the face remains readable at favicon sizes.
const cropTop = Math.max(0, Math.round((metadata.height - cropSize) * 0.28));

function baseImage() {
  return sharp(source)
    .rotate()
    .extract({ left: cropLeft, top: cropTop, width: cropSize, height: cropSize });
}

async function png(name, size) {
  await baseImage()
    .resize(size, size, { fit: 'cover', position: 'center' })
    .png({ compressionLevel: 9, adaptiveFiltering: true })
    .toFile(path.join(outDir, name));
}

const appleSizes = [57, 60, 72, 76, 114, 120, 144, 152, 167, 180];
const pngSizes = [16, 32, 48, 96, 150, 192, 512];

for (const size of pngSizes) {
  await png(`favicon-${size}x${size}.png`, size);
}

for (const size of appleSizes) {
  await png(`apple-touch-icon-${size}x${size}.png`, size);
}

await fs.copyFile(path.join(outDir, 'apple-touch-icon-180x180.png'), path.join(outDir, 'apple-touch-icon.png'));
await fs.copyFile(path.join(outDir, 'favicon-192x192.png'), path.join(outDir, 'android-chrome-192x192.png'));
await fs.copyFile(path.join(outDir, 'favicon-512x512.png'), path.join(outDir, 'android-chrome-512x512.png'));
await fs.copyFile(path.join(outDir, 'favicon-150x150.png'), path.join(outDir, 'mstile-150x150.png'));

const icoBuffer = await pngToIco([
  path.join(outDir, 'favicon-16x16.png'),
  path.join(outDir, 'favicon-32x32.png'),
  path.join(outDir, 'favicon-48x48.png'),
]);
await fs.writeFile(path.join(root, 'favicon.ico'), icoBuffer);

const favicon512 = await fs.readFile(path.join(outDir, 'favicon-512x512.png'));
await fs.writeFile(path.join(outDir, 'favicon.svg'), `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
  <defs><clipPath id="circle"><circle cx="256" cy="256" r="256"/></clipPath></defs>
  <image href="data:image/png;base64,${favicon512.toString('base64')}" width="512" height="512" clip-path="url(#circle)" preserveAspectRatio="xMidYMid slice"/>
</svg>
`);

await fs.writeFile(path.join(outDir, 'safari-pinned-tab.svg'), `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
  <title>SMB</title>
  <circle cx="256" cy="256" r="236" fill="#000"/>
  <text x="256" y="294" text-anchor="middle" font-family="Arial, Helvetica, sans-serif" font-size="132" font-weight="700" fill="#fff">SMB</text>
</svg>
`);

await fs.writeFile(path.join(root, 'site.webmanifest'), JSON.stringify({
  name: 'Dr. Sebastian Müller-Bellé',
  short_name: 'S. Müller-Bellé',
  icons: [
    { src: 'assets/favicons/android-chrome-192x192.png', sizes: '192x192', type: 'image/png' },
    { src: 'assets/favicons/android-chrome-512x512.png', sizes: '512x512', type: 'image/png' },
  ],
  theme_color: '#f4f1ec',
  background_color: '#f4f1ec',
  display: 'standalone',
}, null, 2) + '\n');

await fs.writeFile(path.join(root, 'browserconfig.xml'), `<?xml version="1.0" encoding="utf-8"?>
<browserconfig>
  <msapplication>
    <tile>
      <square150x150logo src="assets/favicons/mstile-150x150.png"/>
      <TileColor>#f4f1ec</TileColor>
    </tile>
  </msapplication>
</browserconfig>
`);

console.log('Generated favicon assets from assets/images/header-smb.jpg');
