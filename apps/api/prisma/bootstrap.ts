import argon2 from 'argon2';
import {z} from 'zod';
import {db,atomic,lock} from '../src/db.js';
import {email,password} from '../../../packages/shared/src/index.js';
try{const b=z.object({email,password}).parse({email:process.env.BOOTSTRAP_ADMIN_EMAIL,password:process.env.BOOTSTRAP_ADMIN_PASSWORD});await atomic(async tx=>{await lock(tx,'bootstrap-admin');if(await tx.user.count({where:{platformRole:'PLATFORM_SUPER_ADMIN'}}))throw new Error('Bootstrap already exists');await tx.user.create({data:{email:b.email,passwordHash:await argon2.hash(b.password),name:'Platform administrator',emailVerifiedAt:new Date(),platformRole:'PLATFORM_SUPER_ADMIN'}});});console.log('Bootstrap account created; enroll MFA on first login.');}finally{await db.$disconnect();}
