import {Prisma} from './generated/prisma/client.js';
export class AppError extends Error {constructor(public status:number,public code:string,message=code,public details?:unknown){super(message);}}
export function ensure(value:unknown,code='CONFLICT',message=code,status=409):asserts value {if(!value)throw new AppError(status,code,message);}
export const D=(v:ConstructorParameters<typeof Prisma.Decimal>[0])=>new Prisma.Decimal(v);
const units:Record<string,[string,string]>={g:['mass','1'],mg:['mass','0.001'],kg:['mass','1000'],mL:['volume','1'],L:['volume','1000'],uL:['volume','0.001']};
export function convert(q:string,from:string,to:string){ensure(units[from]&&units[to]&&units[from][0]===units[to][0],'UNIT_DIMENSION','หน่วยไม่อยู่ในมิติเดียวกัน',422);const n=D(q);ensure(n.isPositive()&&n.decimalPlaces()<=6,'QUANTITY',undefined,422);return n.mul(units[from][1]).div(units[to][1]);}
type Interval={startsAt:Date;endsAt:Date};
export function quotaByWeek(bookings:Interval[]){
 const weeks=new Map<string,Set<string>>();
 for(const b of bookings){ensure(b.endsAt>b.startsAt,'INTERVAL',undefined,422);ensure(b.endsAt.getTime()-b.startsAt.getTime()<=93*86400000,'INTERVAL_TOO_LONG',undefined,422);
  const start=new Date(b.startsAt.getTime()+7*3600000);const end=new Date(b.endsAt.getTime()-1+7*3600000);start.setUTCHours(0,0,0,0);end.setUTCHours(0,0,0,0);
  for(let time=start.getTime();time<=end.getTime();time+=86400000){const day=new Date(time);const monday=new Date(time-((day.getUTCDay()+6)%7)*86400000).toISOString().slice(0,10);const set=weeks.get(monday)||new Set<string>();set.add(day.toISOString().slice(0,10));weeks.set(monday,set);}
 }return weeks;
}
export function assertQuota(bookings:Interval[],limit:number,exceptions:Record<string,number>={}){const q=quotaByWeek(bookings);for(const [week,dates] of q)ensure(dates.size<=(exceptions[week]??limit),'QUOTA','เกินโควตาวันจองต่อสัปดาห์',409);return Object.fromEntries([...q].map(([week,dates])=>[week,{days:[...dates],used:dates.size,limit:exceptions[week]??limit}]));}
export const csvCell=(v:unknown)=>{let s=String(v??'');if(/^[\s]*[=+@\-\t\r]/.test(s))s="'"+s;return '"'+s.replaceAll('"','""')+'"';};
export function operatingHours(startsAt:Date,endsAt:Date,policy:{openHour?:number;closeHour?:number;openDays?:string}){const start=startsAt.getTime()+7*3600000,end=endsAt.getTime()+7*3600000;const first=new Date(start);first.setUTCHours(0,0,0,0);for(let day=first.getTime();day<end;day+=86400000){const weekday=new Date(day).getUTCDay();ensure(policy.openDays!=='WEEKDAYS'||(weekday!==0&&weekday!==6),'LAB_CLOSED','ห้องปิดให้บริการในวันดังกล่าว');ensure(Math.max(start,day)>=day+(policy.openHour??0)*3600000&&Math.min(end,day+86400000)<=day+(policy.closeHour??24)*3600000,'LAB_CLOSED','ช่วงเวลาจองอยู่นอกเวลาเปิดให้บริการ');}}
