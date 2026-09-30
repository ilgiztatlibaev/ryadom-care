import {cp,mkdir,readFile,rm} from 'node:fs/promises';
import {resolve,dirname} from 'node:path';
const output=resolve('dist');
if(dirname(output)!==resolve('.')) throw new Error('Build directory must be inside workspace');
await rm(output,{recursive:true,force:true});
await mkdir('dist',{recursive:true});
await cp('public','dist',{recursive:true});
const html=await readFile('dist/index.html','utf8');
for(const match of html.matchAll(/(?:src|href)="(\.\/[^"#]+|\/[^"#]+)"/g)) {
  const asset=match[1];
  await readFile(resolve('dist',asset.replace(/^\/+/,'')));
}
const fontCss=await readFile('dist/assets/fonts.css','utf8');
for(const match of fontCss.matchAll(/url\((\.\/[^)]+)\)/g)) await readFile(resolve('dist/assets',match[1]));
console.log('Build complete: dist/ — all referenced assets present.');
