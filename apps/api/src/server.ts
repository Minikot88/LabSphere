import {buildApp} from './app.js';
import {cfg} from './config.js';
import {db} from './db.js';
import {scanAlerts,deliverOutbox} from './jobs/worker.js';
const app=await buildApp();await app.listen({port:cfg.port,host:'127.0.0.1'});
let working=false;let lastDay='';const timer=setInterval(async()=>{if(working)return;working=true;try{const day=new Intl.DateTimeFormat('en-CA',{timeZone:'Asia/Bangkok'}).format(new Date());if(day!==lastDay){await scanAlerts();lastDay=day;}await deliverOutbox();}catch(e){app.log.error(e);}finally{working=false;}},10000);timer.unref();
for(const signal of ['SIGINT','SIGTERM'])process.on(signal,async()=>{clearInterval(timer);await app.close();await db.$disconnect();process.exit(0);});
