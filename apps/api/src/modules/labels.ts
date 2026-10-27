import {db} from '../db.js';
// Resolve only identifiers already present in authorized rows. Never fetch an unscoped catalog.
export async function labeledRows<T>(labId:string,rows:T[]){
 const ids=new Set<string>();for(const row of rows)if(row&&typeof row==='object')for(const [key,value] of Object.entries(row))if(key.endsWith('Id')&&typeof value==='string'&&/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(value))ids.add(value);
 if(!ids.size)return rows;const refs=[...ids];const [chemicals,containers,equipment,locations,users]=await Promise.all([
  db.chemical.findMany({where:{labId,id:{in:refs}},select:{id:true,name:true}}),db.chemicalContainer.findMany({where:{labId,id:{in:refs}},select:{id:true,code:true}}),db.equipment.findMany({where:{labId,id:{in:refs}},select:{id:true,name:true}}),db.storageLocation.findMany({where:{labId,id:{in:refs}},select:{id:true,label:true}}),db.user.findMany({where:{id:{in:refs}},select:{id:true,name:true}})
 ]);const labels:Record<string,string>={};for(const row of [...chemicals,...containers,...equipment,...locations,...users])labels[row.id]='name' in row?row.name:'code' in row?row.code:row.label;
 return rows.map(row=>({...row,_labels:labels}));
}
