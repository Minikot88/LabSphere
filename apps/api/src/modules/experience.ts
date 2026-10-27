import type {FastifyInstance} from 'fastify';
import {access,mkdir} from 'node:fs/promises';
import {constants} from 'node:fs';
import nodemailer from 'nodemailer';
import {z} from 'zod';
import {db,atomic,lock} from '../db.js';
import {cfg} from '../config.js';
import {ensure} from '../domain.js';
import {authenticate,platform,labContext,isManager,audit,permit,scoped} from '../security.js';
import {data} from './auth.js';
import {detail} from './queries.js';

const kinds=z.enum(['chemicals','containers','equipment','withdrawals','stocktakes','waste','bookings','issues','maintenance','calibrations','training','documents']);
const entityTypes={chemicals:'Chemical',containers:'ChemicalContainer',equipment:'Equipment',withdrawals:'Withdrawal',stocktakes:'Stocktake',waste:'WasteRecord',bookings:'Booking',issues:'EquipmentIssue',maintenance:'Maintenance',calibrations:'Maintenance',training:'Training',documents:'Document'};
export async function experienceRoutes(app:FastifyInstance){
 app.post('/api/v1/labs/:labId/containers/:id/move',async req=>{const p=req.params as {labId:string;id:string};const c=await labContext(req,p.labId);permit(c,'CHEMICAL_MANAGER');const b=z.object({locationId:z.uuid(),reason:z.string().min(3).max(2000)}).parse(req.body);return atomic(async tx=>{await lock(tx,`inventory:${p.labId}`);const before=await scoped(tx.chemicalContainer.findUnique({where:{id:p.id}}),p.labId);await scoped(tx.storageLocation.findUnique({where:{id:b.locationId}}),p.labId);ensure(before.locationId!==b.locationId,'LOCATION_UNCHANGED','ขวดอยู่ในจุดจัดเก็บนี้แล้ว',422);const row=await tx.chemicalContainer.update({where:{id:p.id},data:{locationId:b.locationId}});await audit(tx,c,'LOCATION_MOVE','ChemicalContainer',row.id,{locationId:before.locationId,currentQty:before.currentQty},{locationId:row.locationId,currentQty:row.currentQty,reason:b.reason});return data(row);});});
 app.get('/api/v1/labs/:labId/records/:kind/:id/context',async req=>{
  const p=req.params as {labId:string;kind:string;id:string};const kind=kinds.parse(p.kind);const c=await labContext(req,p.labId);const record=await detail(c,kind,p.id);const row=record as unknown as Record<string,unknown>;
  // A public calendar slot deliberately omits its requester's private history.
  const privateSlot=kind==='bookings'&&!('requesterId' in row);
  const timeline=privateSlot?[]:await db.auditLog.findMany({where:{labId:p.labId,entityType:entityTypes[kind],entityId:p.id},orderBy:{createdAt:'asc'},select:{id:true,action:true,actorId:true,createdAt:true}});
  const ids=new Set<string>();for(const [key,v] of Object.entries(row))if(key.endsWith('Id')&&typeof v==='string')ids.add(v);
  for(const items of [row.items,row.lines])if(Array.isArray(items))for(const item of items)for(const [key,v] of Object.entries(item))if(key.endsWith('Id')&&typeof v==='string')ids.add(v);
  timeline.forEach(e=>ids.add(e.actorId));
  const refs=[...ids];const [chemicals,containers,equipment,locations,people,documents]=await Promise.all([
   db.chemical.findMany({where:{labId:p.labId,id:{in:refs}},select:{id:true,name:true}}),db.chemicalContainer.findMany({where:{labId:p.labId,id:{in:refs}},select:{id:true,code:true}}),db.equipment.findMany({where:{labId:p.labId,id:{in:refs}},select:{id:true,name:true}}),db.storageLocation.findMany({where:{labId:p.labId,id:{in:refs}},select:{id:true,label:true}}),
   db.user.findMany({where:{id:{in:refs}},select:{id:true,name:true}}),
   db.document.findMany({where:{labId:p.labId,id:{in:refs},...(isManager(c,'SAFETY_OFFICER')?{}:{OR:[{visibility:'LAB'},{uploadedById:c.user.id}]})},omit:{storageKey:true}})
  ]);
  const labels:Record<string,string>={};for(const r of [...chemicals,...containers,...equipment,...locations,...people])labels[r.id]='name' in r?r.name:'code' in r?r.code:r.label;
  const tabs:Record<string,unknown[]>={};const byEquipment={labId:p.labId,equipmentId:p.id};
  for(const doc of documents)labels[doc.id]=doc.title;
  if(documents.length)tabs.evidence=documents;
  if(kind==='chemicals'){
   if(isManager(c,'CHEMICAL_MANAGER')||isManager(c,'SAFETY_OFFICER'))tabs.transactions=await db.stockTransaction.findMany({where:{labId:p.labId,chemicalId:p.id},orderBy:{createdAt:'desc'},take:100});
   tabs.containers=await db.chemicalContainer.findMany({where:{labId:p.labId,chemicalId:p.id},orderBy:{createdAt:'desc'}});
   tabs.documents=await db.document.findMany({where:{labId:p.labId,chemicalId:p.id,...(isManager(c,'SAFETY_OFFICER')?{}:{OR:[{visibility:'LAB'},{uploadedById:c.user.id}]})},omit:{storageKey:true}});
  }
  if(kind==='containers'&&isManager(c,'CHEMICAL_MANAGER'))tabs.transactions=await db.stockTransaction.findMany({where:{labId:p.labId,containerId:p.id},orderBy:{createdAt:'desc'},take:100});
  if(kind==='equipment'){
   tabs.documents=await db.document.findMany({where:{...byEquipment,...(isManager(c,'SAFETY_OFFICER')?{}:{OR:[{visibility:'LAB'},{uploadedById:c.user.id}]})},omit:{storageKey:true}});
   tabs.bookings=(await db.booking.findMany({where:byEquipment,orderBy:{startsAt:'desc'},take:100})).map(b=>isManager(c,'EQUIPMENT_MANAGER')||b.requesterId===c.user.id?b:{id:b.id,startsAt:b.startsAt,endsAt:b.endsAt,status:b.status,purpose:'จองโดยสมาชิก'});
   tabs.training=await db.training.findMany({where:{...byEquipment,...(isManager(c,'SAFETY_OFFICER')?{}:{userId:c.user.id})},orderBy:{createdAt:'desc'},take:100});
   tabs.maintenance=await db.maintenance.findMany({where:byEquipment,orderBy:{createdAt:'desc'},take:100});
   tabs.issues=await db.equipmentIssue.findMany({where:byEquipment,orderBy:{createdAt:'desc'},take:100});
   tabs.blocks=await db.availabilityBlock.findMany({where:byEquipment,orderBy:{startsAt:'desc'},take:100});
  }
  if(kind==='issues')tabs.maintenance=await db.maintenance.findMany({where:{labId:p.labId,issueId:p.id},orderBy:{createdAt:'desc'}});
  return data({labels,tabs,timeline:timeline.map(e=>({...e,actorName:labels[e.actorId]||'ผู้ดำเนินการ'}))});
 });
 app.get('/api/v1/platform/labs/:id',async req=>{const c=await authenticate(req);platform(c);const {id}=req.params as {id:string};const lab=await db.laboratory.findUnique({where:{id}});ensure(lab,'NOT_FOUND',undefined,404);const [organization,members,chemicals,containers,equipment,bookings,issues,maintenance]=await Promise.all([db.organization.findUnique({where:{id:lab.organizationId}}),db.membership.count({where:{labId:id,status:'ACTIVE'}}),db.chemical.count({where:{labId:id,archivedAt:null}}),db.chemicalContainer.count({where:{labId:id}}),db.equipment.count({where:{labId:id,archivedAt:null}}),db.booking.count({where:{labId:id,status:'PENDING'}}),db.equipmentIssue.count({where:{labId:id,status:{not:'CLOSED'}}}),db.maintenance.count({where:{labId:id,status:{not:'VERIFIED'}}})]);return data({...lab,organization,counts:{members,chemicals,containers,equipment,pendingBookings:bookings,openIssues:issues,openMaintenance:maintenance}});});
 app.patch('/api/v1/platform/labs/:id',async req=>{const c=await authenticate(req);platform(c);const {id}=req.params as {id:string};const b=z.object({name:z.string().min(2).max(160),building:z.string().max(160),room:z.string().max(160),status:z.enum(['ACTIVE','ARCHIVED']),reason:z.string().min(3).max(1000)}).parse(req.body);return atomic(async tx=>{const before=await tx.laboratory.findUnique({where:{id}});ensure(before,'NOT_FOUND',undefined,404);const {reason,...fields}=b;const row=await tx.laboratory.update({where:{id},data:fields});await audit(tx,{...c,labId:id},'PLATFORM_LAB_CHANGED','Laboratory',id,before,{...row,reason});return data(row);});});
 app.get('/api/v1/platform/health',async req=>{const c=await authenticate(req);platform(c);const check=async(name:string,fn:()=>Promise<unknown>)=>{const start=performance.now();try{await fn();return {id:name,name,status:'HEALTHY',latencyMs:Math.round(performance.now()-start)};}catch{return {id:name,name,status:'UNAVAILABLE',latencyMs:Math.round(performance.now()-start)};}};const services=await Promise.all([check('PostgreSQL',()=>db.$queryRaw`SELECT 1`),check('Private file storage',async()=>{await mkdir(cfg.storage,{recursive:true});await access(cfg.storage,constants.R_OK|constants.W_OK);}),check('Local SMTP / Mailpit',async()=>{const transport=nodemailer.createTransport({host:cfg.smtpHost,port:cfg.smtpPort,secure:false,connectionTimeout:2000,greetingTimeout:2000,socketTimeout:2000});try{await transport.verify();}finally{transport.close();}})]);const [pending,retrying,sent,migrations]=await Promise.all([db.notificationOutbox.count({where:{status:'PENDING'}}),db.notificationOutbox.count({where:{status:'PENDING',attempts:{gt:0}}}),db.notificationOutbox.count({where:{status:'SENT'}}),db.$queryRaw<{migration_name:string;finished_at:Date}[]>`SELECT migration_name, finished_at FROM _prisma_migrations WHERE finished_at IS NOT NULL AND rolled_back_at IS NULL ORDER BY finished_at`]);return data({status:services.every(s=>s.status==='HEALTHY')?'HEALTHY':'DEGRADED',checkedAt:new Date(),services,outbox:{pending,retrying,sent},migrations:migrations.map(m=>({name:m.migration_name,appliedAt:m.finished_at})),runtime:{node:process.version,uptimeSeconds:Math.floor(process.uptime()),timezone:'Asia/Bangkok',environment:'Local development'}});});
 app.post('/api/v1/notifications/read-all',async req=>{const c=await authenticate(req);const result=await db.notification.updateMany({where:{userId:c.user.id,readAt:null},data:{readAt:new Date()}});return data({updated:result.count});});
}
