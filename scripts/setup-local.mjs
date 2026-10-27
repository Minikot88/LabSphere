import {randomBytes} from 'node:crypto';
import {existsSync,writeFileSync} from 'node:fs';
if(existsSync('.env')) { console.log('.env exists; left unchanged'); }
else {
 const password=randomBytes(24).toString('hex');
 writeFileSync('.env',`DB_PASSWORD=${password}\nDATABASE_URL=postgresql://labsphere:${password}@127.0.0.1:5433/labsphere\nDB_PORT=5433\nWEB_URL=http://localhost:5173\nAPI_URL=http://localhost:3001\nAPI_PORT=3001\nSMTP_HOST=127.0.0.1\nSMTP_PORT=1025\nSMTP_FROM=no-reply@labsphere.test\nSESSION_SECRET=${randomBytes(48).toString('hex')}\nDEV_SEED_PASSWORD=${randomBytes(18).toString('base64url')}\nSTORAGE_ROOT=.local/private-files\nTIMEZONE=Asia/Bangkok\n`,{mode:0o600});
 console.log('Created .env with random local credentials. Read DEV_SEED_PASSWORD there.');
}
