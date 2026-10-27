import {PrismaClient,Prisma} from './generated/prisma/client.js';
import {PrismaPg} from '@prisma/adapter-pg';
import {cfg} from './config.js';
export const db=new PrismaClient({adapter:new PrismaPg({connectionString:cfg.dbUrl})});
export type Tx=Prisma.TransactionClient;
export async function atomic<T>(fn:(tx:Tx)=>Promise<T>):Promise<T>{
 for(let attempt=0;;attempt++){try{return await db.$transaction(fn,{timeout:20000});}catch(e){if(e instanceof Prisma.PrismaClientKnownRequestError&&e.code==='P2034'&&attempt<3)continue;throw e;}}
}
export async function lock(tx:Tx,key:string){await tx.$queryRaw`SELECT pg_advisory_xact_lock(hashtextextended(${key},0))::text`;}
