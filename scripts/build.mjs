import './icons.mjs';
import{mkdirSync,copyFileSync,cpSync,rmSync}from'node:fs';
import{createRequire}from'node:module';
const require=createRequire(import.meta.url);
rmSync('dist',{recursive:true,force:true});mkdirSync('dist/vendor',{recursive:true});
for(const f of ['index.html','style.css','app.mjs','split-studio.js','install-guide.js','core.mjs','storage.mjs','excel.mjs','excel-worker.js','manifest.webmanifest','icon.svg','sw.js'])copyFileSync(f,'dist/'+f);
cpSync('icons','dist/icons',{recursive:true});
copyFileSync(require.resolve('exceljs/dist/exceljs.min.js'),'dist/vendor/exceljs.min.js');
copyFileSync(require.resolve('exceljs/LICENSE'),'dist/vendor/EXCELJS-LICENSE');
