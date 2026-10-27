import {randomBytes,createHash,createCipheriv,createDecipheriv,timingSafeEqual} from 'node:crypto';
import type {FastifyRequest} from 'fastify';
import type {User,Session} from './generated/prisma/client.js';
import type {Tx} from './db.js';
import {db} from './db.js';
import {cfg} from './config.js';
import {AppError,ensure} from './domain.js';
import {z} from 'zod';
import {Prisma} from './generated/prisma/client.js';
export const hash=(v:string)=>createHash('sha256').update(v).digest('hex');
export const token=()=>randomBytes(32).toString('base64url');
export const encrypt=(v:string)=>{const iv=randomBytes(12);const c=createCipheriv('aes-256-gcm',Buffer.from(hash(cfg.secret),'hex'),iv);return [iv.toString('hex'),Buffer.concat([c.update(v,'utf8'),c.final()]).toString('hex'),c.getAuthTag().toString('hex')].join('.');};
export const decrypt=(v:string)=>{const [iv,data,tag]=v.split('.');const c=createDecipheriv('aes-256-gcm',Buffer.from(hash(cfg.secret),'hex'),Buffer.from(iv,'hex'));c.setAuthTag(Buffer.from(tag,'hex'));return Buffer.concat([c.update(Buffer.from(data,'hex')),c.final()]).toString('utf8');};
export const safeUser=(u:User)=>({id:u.id,email:u.email,name:u.name,phone:u.phone,status:u.status,emailVerifiedAt:u.emailVerifiedAt,platformRole:u.platformRole,organizationAdminId:u.organizationAdminId});
export type Context={user:User;session:Session;roles:string[];labId?:string;request:FastifyRequest;mfaEnabled:boolean};
export async function authenticate(request:FastifyRequest){const raw=request.cookies.session;const session=raw?await db.session.findUnique({where:{tokenHash:hash(raw)}}):null;ensure(session&&!session.revokedAt&&session.expiresAt>new Date(),'UNAUTHENTICATED','กรุณาเข้าสู่ระบบ',401);const user=await db.user.findUniqueOrThrow({where:{id:session.userId}});ensure(user.status==='ACTIVE'&&user.emailVerifiedAt,'ACCOUNT_DISABLED','บัญชีไม่พร้อมใช้งาน',403);
 if(!['GET','HEAD','OPTIONS'].includes(request.method)){const sent=request.headers['x-csrf-token'];const expected=Buffer.from(session.csrfHash);const actual=Buffer.from(hash(typeof sent==='string'?sent:''));ensure(actual.length===expected.length&&timingSafeEqual(expected,actual),'CSRF','คำขอ CSRF ไม่ถูกต้อง',403);const origin=request.headers.origin;if(origin)ensure(origin===cfg.webUrl,'ORIGIN',undefined,403);}
 return {user,session,request,roles:[],mfaEnabled:!!session.mfaVerifiedAt&&!!(await db.totpCredential.findUnique({where:{userId:user.id}}))?.enabled} as Context;
}
export async function labContext(request:FastifyRequest,labId:string){const c=await authenticate(request);const lab=await db.laboratory.findUnique({where:{id:labId}});ensure(lab&&lab.status==='ACTIVE','NOT_FOUND','ไม่พบห้องปฏิบัติการ',404);if(c.user.platformRole==='PLATFORM_SUPER_ADMIN'||c.user.organizationAdminId===lab.organizationId)c.roles=['LAB_ADMIN'];else{const m=await db.membership.findUnique({where:{labId_userId:{labId,userId:c.user.id}}});ensure(m?.status==='ACTIVE','FORBIDDEN','ไม่มีสิทธิ์ในห้องปฏิบัติการนี้',403);c.roles=m.roles;}c.labId=labId;return c;}
export function permit(c:Context,...roles:string[]){if(c.roles.includes('LAB_ADMIN')||c.user.platformRole||c.user.organizationAdminId)ensure(c.mfaEnabled,'ADMIN_MFA_REQUIRED','กรุณาตั้งค่า MFA ที่บัญชี / ความปลอดภัยก่อนทำรายการผู้ดูแล',403);ensure(c.roles.includes('LAB_ADMIN')||roles.some(r=>c.roles.includes(r)),'FORBIDDEN','ไม่มีสิทธิ์ทำรายการนี้',403);}
export const isManager=(c:Context,role:string)=>c.roles.includes('LAB_ADMIN')?c.mfaEnabled:c.roles.includes(role);
export function member(c:Context){ensure(c.roles.some(r=>r!=='VIEWER'),'FORBIDDEN',undefined,403);}
export function platform(c:Context){ensure(c.user.platformRole==='PLATFORM_SUPER_ADMIN','FORBIDDEN',undefined,403);ensure(c.mfaEnabled,'ADMIN_MFA_REQUIRED','กรุณาตั้งค่า MFA ก่อนจัดการแพลตฟอร์ม',403);}
export const own=(c:Context,userId:string,manager:string)=>ensure(userId===c.user.id||isManager(c,manager),'FORBIDDEN',undefined,403);
export async function scoped<T extends {labId:string}>(row:Promise<T|null>,labId:string){const result=await row;ensure(result?.labId===labId,'NOT_FOUND','ไม่พบรายการ',404);return result;}
export async function audit(tx:Tx,c:Pick<Context,'user'|'labId'|'roles'|'request'>,action:string,entityType:string,entityId:string,before?:unknown,after?:unknown){const json=(v:unknown)=>v===undefined?Prisma.JsonNull:JSON.parse(JSON.stringify(v));await tx.auditLog.create({data:{labId:c.labId,actorId:c.user.id,action,entityType,entityId,before:json(before),after:json(after),effectiveRoles:c.roles,requestId:c.request.id,ip:c.request.ip,userAgent:String(c.request.headers['user-agent']||'')}});}
export function pagination(query:unknown){const q=z.object({page:z.coerce.number().int().min(1).max(100000).default(1),pageSize:z.coerce.number().int().min(1).max(100).default(20),search:z.string().max(160).default(''),status:z.string().max(80).optional(),sort:z.string().optional(),dir:z.string().optional()}).parse(query);return {...q,skip:(q.page-1)*q.pageSize,take:q.pageSize,status:q.status||undefined,sort:['createdAt','name','status','code'].includes(q.sort||'')?q.sort!:'createdAt',dir:q.dir==='asc'?'asc' as const:'desc' as const};}
export const notFound=()=>new AppError(404,'NOT_FOUND','ไม่พบรายการ');
