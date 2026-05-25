import fs from 'node:fs';
import path from 'node:path';
import PDFDocument from 'pdfkit';
import * as cheerio from 'cheerio';

const root = process.cwd();
const html = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
const $ = cheerio.load(html);
const cv = $('#cv-details .cv-content');

if (!cv.length) {
  throw new Error('Could not find CV content in index.html');
}

const outputPath = path.join(root, 'assets/files/sebastian-mueller-belle-cv.pdf');
fs.mkdirSync(path.dirname(outputPath), { recursive: true });

const doc = new PDFDocument({
  size: 'A4',
  margins: { top: 42, right: 42, bottom: 48, left: 42 },
  info: {
    Title: 'Curriculum Vitae - Dr. Sebastian Müller-Bellé',
    Author: 'Dr. Sebastian Müller-Bellé',
    Subject: 'Curriculum Vitae',
    Keywords: 'CV, Curriculum Vitae, Sebastian Müller-Bellé',
  },
});

const stream = fs.createWriteStream(outputPath);
doc.pipe(stream);

const regularFont = path.join(root, 'assets/fonts/Borna-Regular.otf');
const boldFont = path.join(root, 'assets/fonts/Borna-Bold.otf');
const monoFont = path.join(root, 'assets/fonts/BasierSquareMono-Regular.otf');
const monoBoldFont = path.join(root, 'assets/fonts/BasierSquareMono-Bold.otf');

doc.registerFont('Borna', regularFont);
doc.registerFont('Borna-Bold', boldFont);
doc.registerFont('Basier', monoFont);
doc.registerFont('Basier-Bold', monoBoldFont);

const page = {
  width: doc.page.width,
  height: doc.page.height,
  left: doc.page.margins.left,
  right: doc.page.margins.right,
  bottom: doc.page.height - doc.page.margins.bottom,
};
const contentWidth = page.width - page.left - page.right;
let pageNumber = 1;

function addPage() {
  footer();
  doc.addPage();
  pageNumber += 1;
}

function footer() {
  // Keep the footer inside PDFKit's printable area. Placing it below the
  // bottom margin triggers PDFKit's automatic page break and creates an
  // extra blank page that only contains footer/header text.
  const y = page.bottom - 22;
  doc.save();
  doc.font('Basier').fontSize(7).fillColor('#777777');
  doc.text(`Curriculum Vitae · Dr. Sebastian Müller-Bellé · Page ${pageNumber}`, page.left, y, {
    width: contentWidth,
    align: 'center',
    lineBreak: false,
  });
  doc.restore();
}

function ensureSpace(height) {
  if (doc.y + height > page.bottom) {
    addPage();
    doc.y = doc.page.margins.top;
  }
}

function textHeight(text, options = {}) {
  doc.font(options.font || 'Borna').fontSize(options.size || 9.5);
  return doc.heightOfString(text, { width: options.width || contentWidth, lineGap: options.lineGap ?? 2 });
}

function clean(text) {
  return text.replace(/\s+/g, ' ').trim();
}

function paragraph(text, options = {}) {
  text = clean(text);
  if (!text) return;
  const size = options.size || 9.4;
  const lineGap = options.lineGap ?? 2.4;
  const font = options.bold ? 'Borna-Bold' : (options.font || 'Borna');
  const color = options.color || '#181818';
  const gapAfter = options.gapAfter ?? 6;
  const width = options.width || contentWidth;
  ensureSpace(textHeight(text, { font, size, lineGap, width }) + gapAfter);
  doc.font(font).fontSize(size).fillColor(color).text(text, page.left, doc.y, {
    width,
    lineGap,
    align: options.align || 'left',
  });
  doc.moveDown(gapAfter / 10);
}

function heading(text) {
  text = clean(text).toUpperCase();
  ensureSpace(30);
  if (doc.y > doc.page.margins.top + 4) {
    doc.moveDown(0.45);
  }
  doc.moveTo(page.left, doc.y).lineTo(page.left + contentWidth, doc.y).lineWidth(0.5).strokeColor('#d9d9d9').stroke();
  doc.moveDown(0.85);
  doc.font('Basier-Bold').fontSize(8.4).fillColor('#111111').text(text, page.left, doc.y, {
    width: contentWidth,
    characterSpacing: 0.7,
  });
  doc.moveDown(0.75);
}

function subheading(text) {
  text = clean(text);
  ensureSpace(18);
  doc.font('Borna-Bold').fontSize(10).fillColor('#111111').text(text, page.left, doc.y, {
    width: contentWidth,
    lineGap: 1.5,
  });
  doc.moveDown(0.35);
}

function meta(text) {
  paragraph(text, { size: 8.7, color: '#555555', gapAfter: 4 });
}

function bulletList(items, options = {}) {
  const size = options.size || 9.1;
  const leftIndent = options.indent || 13;
  const bulletIndent = options.bulletIndent || 0;
  for (const item of items) {
    const text = clean($(item).text());
    if (!text) continue;
    const width = contentWidth - leftIndent;
    ensureSpace(textHeight(text, { size, width }) + 4);
    const startY = doc.y;
    doc.font('Borna').fontSize(size).fillColor('#181818');
    doc.circle(page.left + bulletIndent + 2.5, startY + 5, 1.5).fill('#181818');
    doc.text(text, page.left + leftIndent, startY, {
      width,
      lineGap: 2.1,
    });
    doc.moveDown(0.35);
  }
}

// Header
const header = cv.find('.cv-header');
const name = clean(header.find('.cv-name').text());
const tagline = clean(header.find('.cv-tagline').text());
const contact = header.find('.cv-contact span').map((_, el) => clean($(el).text())).get().join('   |   ');

doc.font('Borna-Bold').fontSize(22).fillColor('#111111').text(name, page.left, doc.y, {
  width: contentWidth,
  lineGap: 1,
});
doc.moveDown(0.35);
paragraph(tagline, { size: 10.5, bold: true, color: '#222222', gapAfter: 4 });
paragraph(contact, { size: 8.8, font: 'Basier', color: '#444444', gapAfter: 10 });

doc.moveTo(page.left, doc.y).lineTo(page.left + contentWidth, doc.y).lineWidth(0.7).strokeColor('#cfcfcf').stroke();
doc.moveDown(1);

const manualPageBreakBefore = new Set([
  'Professional Experience',
  'Education & Certifications',
]);

cv.children('.cv-block').each((_, block) => {
  const $block = $(block);
  const blockTitle = clean($block.children('.cv-block-title').first().text());

  if (manualPageBreakBefore.has(blockTitle) && doc.y > doc.page.margins.top + 4) {
    addPage();
    doc.y = doc.page.margins.top;
  }

  heading(blockTitle);

  $block.children().each((__, child) => {
    const $child = $(child);
    const tag = child.tagName?.toLowerCase();

    if ($child.hasClass('cv-block-title')) return;

    if (tag === 'p') {
      if ($child.hasClass('cv-note')) meta($child.text());
      else paragraph($child.text());
      return;
    }

    if ($child.hasClass('cv-competency-grid')) {
      $child.find('.cv-subblock').each((___, subblock) => {
        const $sub = $(subblock);
        subheading($sub.find('.cv-subblock-title').first().text());
        bulletList($sub.find('li').toArray());
        doc.moveDown(0.2);
      });
      return;
    }

    if ($child.hasClass('cv-role')) {
      const roleTitle = $child.find('.cv-role-title').first().text();
      const rolePeriod = $child.find('.cv-role-period').first().text();
      subheading(`${roleTitle} | ${rolePeriod}`);
      bulletList($child.find('li').toArray());
      doc.moveDown(0.35);
      return;
    }

    if ($child.hasClass('cv-entry')) {
      subheading($child.find('.cv-entry-title').first().text());
      const entryMeta = $child.find('.cv-entry-meta').first().text();
      if (entryMeta) meta(entryMeta);
      $child.children('p').not('.cv-entry-meta').each((___, p) => paragraph($(p).text(), { gapAfter: 4 }));
      const lis = $child.find('li').toArray();
      if (lis.length) bulletList(lis);
      doc.moveDown(0.25);
      return;
    }

    if (tag === 'ul') {
      bulletList($child.find('li').toArray());
    }
  });
});

footer();
doc.end();

await new Promise((resolve, reject) => {
  stream.on('finish', resolve);
  stream.on('error', reject);
});

console.log(`Generated ${path.relative(root, outputPath)}`);
