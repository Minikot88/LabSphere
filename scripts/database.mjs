import 'dotenv/config';
import {execFileSync} from 'node:child_process';
import {mkdirSync,writeFileSync,readFileSync,existsSync} from 'node:fs';
import {resolve,dirname} from 'node:path';
const url=new URL(process.env.DATABASE_URL||'');
if(!['localhost','127.0.0.1'].includes(url.hostname)||url.pathname!=='/labsphere')throw new Error('Only the LabSphere local database is allowed');
const mode=process.argv[2];
if(mode==='backup'){
 const target=resolve('.local/backups',`labsphere-${new Date().toISOString().replaceAll(/[:.]/g,'-')}.dump`);
 mkdirSync(dirname(target),{recursive:true});
 const bytes=execFileSync('docker',['compose','exec','-T','postgres','pg_dump','-U','labsphere','-Fc','labsphere'],{maxBuffer:100*1024*1024});
 writeFileSync(target,bytes,{flag:'wx'});console.log(`Local backup saved: ${target}`);
}else if(mode==='restore'){
 const source=process.argv[3];if(!source||!existsSync(source))throw new Error('Usage: npm run db:restore:isolated -- .local/backups/<file>.dump');
 const target=`labsphere_restore_${Date.now()}`;
 execFileSync('docker',['compose','exec','-T','postgres','createdb','-U','labsphere',target]);
 execFileSync('docker',['compose','exec','-T','postgres','pg_restore','-U','labsphere','--no-owner','--exit-on-error','-d',target],{input:readFileSync(resolve(source)),maxBuffer:100*1024*1024});
 console.log(`Verified isolated restore completed into ${target}; development database unchanged.`);
}else throw new Error('Expected backup or restore');
