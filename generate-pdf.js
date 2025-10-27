const markdownpdf = require('markdown-pdf');
const fs = require('fs');
const path = require('path');

const inputFile = path.join(
  __dirname,
  'kan-back/back-docs/BACKEND_PRESENTATION.md',
);
const outputFile = path.join(
  __dirname,
  'kan-back/back-docs/BACKEND_PRESENTATION.pdf',
);

const options = {
  remarkable: {
    html: true,
    breaks: true,
    typographer: true,
  },
  paperFormat: 'A4',
  paperOrientation: 'portrait',
  paperBorder: '2cm',
  cssPath: path.join(__dirname, 'pdf-styles.css'),
};

console.log('📄 Генерация PDF из Markdown...');
console.log(`📁 Входной файл: ${inputFile}`);
console.log(`📁 Выходной файл: ${outputFile}`);

markdownpdf(options)
  .from(inputFile)
  .to(outputFile, function () {
    console.log('✅ PDF успешно создан!');
    console.log(`📍 Расположение: ${outputFile}`);
  });
