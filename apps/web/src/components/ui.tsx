import * as React from 'react';
import {Slot} from '@radix-ui/react-slot';
import * as DialogPrimitive from '@radix-ui/react-dialog';
import {cva,type VariantProps} from 'class-variance-authority';
import {clsx,type ClassValue} from 'clsx';
import {twMerge} from 'tailwind-merge';
import {Link} from 'react-router-dom';
import {ApiError} from '../lib/api';
import {X} from 'lucide-react';
export const cn=(...v:ClassValue[])=>twMerge(clsx(v));
const variants=cva('btn',{variants:{variant:{default:'btn-primary',outline:'btn-outline',danger:'btn-danger',ghost:'btn-ghost'}},defaultVariants:{variant:'default'}});
export function Button({className,variant,asChild=false,...props}:React.ComponentProps<'button'>&VariantProps<typeof variants>&{asChild?:boolean}){if(asChild)return <Slot className={cn(variants({variant}),className)} {...(props as React.ComponentProps<typeof Slot>)}/>;return <button className={cn(variants({variant}),className)} {...props}/>;}
export function Modal({open,onOpenChange,title,children}:{open:boolean;onOpenChange:(v:boolean)=>void;title:string;children:React.ReactNode}){return <DialogPrimitive.Root open={open} onOpenChange={onOpenChange}><DialogPrimitive.Portal><DialogPrimitive.Overlay className="modal-overlay"/><DialogPrimitive.Content className="modal-content"><DialogPrimitive.Title className="text-xl font-semibold">{title}</DialogPrimitive.Title><DialogPrimitive.Description className="muted">ตรวจสอบข้อมูลก่อนยืนยัน ระบบจะบันทึกข้อมูลและประวัติการดำเนินการ</DialogPrimitive.Description><DialogPrimitive.Close className="modal-close" aria-label="ปิด"><X size={20}/></DialogPrimitive.Close>{children}</DialogPrimitive.Content></DialogPrimitive.Portal></DialogPrimitive.Root>;}
export function Status({value}:{value:unknown}){return <span className={`status status-${String(value).toLowerCase()}`}>{String(value)==='BLOCKED'?'● ':''}{importStatus(value)}</span>;}
import {labelStatus} from '../lib/api';
const importStatus=(v:unknown)=>labelStatus[String(v)]||String(v);
export function ErrorBox({error}:{error:unknown}){return error?<div role="alert" className="error-box">{error instanceof Error?error.message:String(error)}{error instanceof ApiError&&<div className="error-recovery">{error.status===0||error.code==='SERVICE_UNAVAILABLE'?<><Link to="/offline">ตรวจการเชื่อมต่อ</Link><button onClick={()=>window.location.reload()}>ลองใหม่</button></>:error.code==='ADMIN_MFA_REQUIRED'?<Link to="/account/security">ตั้งค่า MFA</Link>:error.status===403?<Link to="/select-lab">เลือกห้องที่ได้รับสิทธิ์</Link>:error.status===404?<Link to="/screens">สารบัญหน้าระบบ</Link>:null}</div>}</div>:null;}
export function Loading(){return <div role="status" aria-label="กำลังโหลด" className="skeleton"><span/>กำลังโหลดข้อมูลจากระบบ…</div>;}
