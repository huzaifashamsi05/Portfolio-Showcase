import fs from 'fs';
import path from 'path';

const filePaths = [
  'c:/Users/HP/Downloads/websites/Portfolio-Showcase/Portfolio-Showcase/artifacts/portfolio/src/pages/HomePage.tsx',
  'c:/Users/HP/Downloads/websites/Portfolio-Showcase/Portfolio-Showcase/artifacts/portfolio/src/pages/AdminPage.tsx'
];

for (const filePath of filePaths) {
  let content = fs.readFileSync(filePath, 'utf8');

  // Replace alpha variants first
  content = content.replace(/#00f5ff05/g, 'var(--theme-05)');
  content = content.replace(/#00f5ff0a/g, 'var(--theme-0a)');
  content = content.replace(/#00f5ff11/g, 'var(--theme-11)');
  content = content.replace(/#00f5ff15/g, 'var(--theme-15)');
  content = content.replace(/#00f5ff22/g, 'var(--theme-22)');
  content = content.replace(/#00f5ff33/g, 'var(--theme-33)');
  content = content.replace(/#00f5ff44/g, 'var(--theme-44)');
  content = content.replace(/#00f5ff66/g, 'var(--theme-66)');
  content = content.replace(/#00f5ff88/g, 'var(--theme-88)');
  
  // Replace base color
  content = content.replace(/#00f5ff/g, 'var(--theme)');

  fs.writeFileSync(filePath, content);
  console.log(`Updated ${path.basename(filePath)}`);
}
