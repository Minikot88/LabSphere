import {config} from 'dotenv';
import {spawnSync} from 'node:child_process';
config({quiet:true});
const url=new URL(process.env.DATABASE_URL);
if(!['127.0.0.1','localhost'].includes(url.hostname)||!['/labsphere','/labsphere_test'].includes(url.pathname))throw new Error('Local test database guard rejected URL');
url.pathname='/labsphere_test';
const run=spawnSync(process.execPath,['node_modules/prisma/build/index.js','migrate','deploy'],{env:{...process.env,DATABASE_URL:url.toString()},stdio:'inherit'});
if(run.status!==0)process.exit(run.status||1);
