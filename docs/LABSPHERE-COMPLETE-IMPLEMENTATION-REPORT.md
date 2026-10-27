# LabSphere — Complete Implementation & Design Integration Report

วันที่รายงาน: 27 October 2026 (Asia/Bangkok)
โครงการเดิม: D:\git\LabSphere

## ผลรวม

**PASS — Local acceptance ที่ตรวจสอบในรอบนี้**: ใช้ Vite/React/TypeScript/Tailwind และ Radix/shadcn-style components, Fastify/TypeScript, Prisma/PostgreSQL บน Docker Local. มีครบ 51 screen IDs และทุกโมดูลหลักเชื่อม API/ฐานข้อมูลจริง. ไม่มี localStorage เป็นฐานข้อมูล ไม่มีการสร้างโครงการใหม่/Deploy Production/ลบ Volume/รีเซ็ตข้อมูลเดิม.

การอ่านข้อกำหนดและการเทียบหน้าอ้างอิง: docs/evidence/design-integration-intake.json (hash/รายการไฟล์ที่ตรวจ), docs/evidence/design-contracts.json (render 51/51 reference contracts, 0 pageerror), docs/LABSPHERE-GAP-ANALYSIS.md (baseline รายหน้า). Master Specification มีอำนาจเหนือข้อมูลสมมติและปุ่มสาธิตใน HTML.

## การตรวจจริง

| การตรวจ | ผล | หลักฐาน |
|---|---|---|
| TypeScript / ESLint | PASS | รันกับ candidate ล่าสุด, ไม่มี error/warning ของ lint |
| Native API + Vite Build | PASS | ถูก build ใหม่ก่อน Playwright ทุกครั้ง |
| Unit / Integration บน PostgreSQL จริง | PASS 58/58 | docs/evidence/vitest.json |
| Playwright scenarios | PASS 3 screen suites + 3 workflow reruns | docs/evidence/playwright-final-verified.json |
| Secondary workflows | PASS 45 checks | docs/evidence/secondary-workflows-final.json |
| Training / governance / settings / membership / account lifecycle | PASS 31 checks | docs/evidence/governance-workflows-final.json |
| Seed ซ้ำสองครั้ง | PASS: จำนวนและยอดเดิมเท่ากัน | docs/evidence/development-database-final.json |
| Docker / PostgreSQL | PASS: PostgreSQL + Mailpit healthy, pg_isready accepting | docs/evidence/docker-final.jsonl |
| Local URL login/dashboard/DB health | PASS 200, ไม่มี unexpected API/pageerror | docs/evidence/local-runtime-final.json |
| Runtime dependency audit | PASS 0 reported vulnerabilities | docs/evidence/npm-audit-runtime-final.json |
| Protected read-only review | ACCEPT Backend revision 3, call 3/3; final UI parent-verified, ขอบเขต 6 Backend files | docs/assurance/design-review-ledger.json |

API tests = 7 unit + 31 original integration + 20 design/security integration tests. ทดสอบข้อมูลจริงใน labsphere_test ซึ่งแยกจาก labsphere. Role matrix ตรวจสิทธิ์อ่านและห้ามข้ามห้องทั้ง 6 roles ใน 3 ห้อง พร้อม representative writes และ negative cases. ไม่ได้อ้างว่าพิสูจน์ครบทุก permutation ของ role/API/state.

| Viewport | Reference screens | Additional route checks | Unique paths ที่เปิดจริง | Unexpected console/API/page errors |
|---|---:|---:|---:|---|
| desktop | 51 | 48 | 83 | 0 / 0 / 0 |
| tablet | 51 | 48 | 83 | 0 / 0 / 0 |
| mobile | 51 | 48 | 83 | 0 / 0 / 0 |

Additional checks มีทั้ง list/new/detail และบางเส้นทางซ้ำกับ reference. ตรวจแท็บสัมพันธ์ ภาพที่อัปโหลด/อ่านได้จริง Cards view, read-all และ offline→retry. ตรวจเลือกสาร/เครื่องมือเก่าที่พ้นหน้าแรกของ API และ preselection จาก Equipment→Booking; selectors/calendar โหลดทุกหน้าของ API ไม่ตัดเงียบที่ 100 รายการ. Audit มีตัวกรอง actor/date และบันทึก INVITE_ACCEPT ใน transaction เดียวกับการให้สิทธิ์. HTTP ที่คาดหมายใน negative tests และ fault injection ถูกแยกจาก unexpected errors. ภาพหลักฐานอยู่ใน docs/evidence/screens/<viewport>/; ทุกภาพใช้ข้อมูลสังเคราะห์. Browser traces ปิดเพื่อไม่เก็บรหัสผ่าน/MFA.

## รายหน้าทั้ง 51 หน้า

คอลัมน์ UI หมายถึงเปิดเส้นทางและตรวจ rendering/API/overflow จริงทั้ง Desktop 1440×900, Tablet 768×1024, Mobile 390×844. การส่งฟอร์ม/เปลี่ยนสถานะพิสูจน์แยกใน workflow/API tests ข้างต้น.

| # | Screen ID / หน้า | Route | สถานะข้อมูลจริง | UI 3 ขนาด |
|---|---|---|---|---|
| 1 | login — เข้าสู่ระบบ | /login | Auth API + PostgreSQL | PASS |
| 2 | register — สมัครสมาชิก | /register | Auth API + PostgreSQL | PASS |
| 3 | verify-email — ยืนยันอีเมล | /verify-email | Auth API + PostgreSQL | PASS |
| 4 | forgot-password — ลืมรหัสผ่าน | /forgot-password | Auth API + PostgreSQL | PASS |
| 5 | reset-password — ตั้งรหัสผ่านใหม่ | /reset-password | Auth API + PostgreSQL | PASS |
| 6 | invite-accept — ตอบรับคำเชิญ | /invite/accept | Auth API + PostgreSQL | PASS |
| 7 | select-lab — เลือกห้องปฏิบัติการ | /select-lab | Auth API + PostgreSQL | PASS |
| 8 | screens — สารบัญหน้าระบบ | /screens | Route registry + authorized API records | PASS |
| 9 | dashboard — ภาพรวมห้องปฏิบัติการ | /app/:labId/dashboard | Scoped/account API | PASS |
| 10 | notifications — การแจ้งเตือน | /notifications | Scoped/account API | PASS |
| 11 | profile — โปรไฟล์ | /profile | Scoped/account API | PASS |
| 12 | security — ความปลอดภัยบัญชี | /account/security | Scoped/account API | PASS |
| 13 | chemicals — สารเคมี | /app/:labId/chemicals | Lab API + PostgreSQL | PASS |
| 14 | chemical-new — เพิ่มชนิดสารเคมี | /app/:labId/chemicals/new | Lab API + PostgreSQL | PASS |
| 15 | chemical-detail — รายละเอียดสารเคมี | /app/:labId/chemicals/:id | Lab API + PostgreSQL | PASS |
| 16 | container-detail — รายละเอียดขวด / Lot | /app/:labId/containers/:id | Lab API + PostgreSQL | PASS |
| 17 | receive — รับเข้าสารเคมี | /app/:labId/inventory/receive | Lab API + PostgreSQL | PASS |
| 18 | withdrawals — คำขอเบิกสาร | /app/:labId/withdrawals | Lab API + PostgreSQL | PASS |
| 19 | withdrawal-detail — อนุมัติและจ่ายสาร | /app/:labId/withdrawals/:id | Lab API + PostgreSQL | PASS |
| 20 | stocktakes — ตรวจนับสต็อก | /app/:labId/inventory/stocktakes | Lab API + PostgreSQL | PASS |
| 21 | transfers — โอนย้ายสาร | /app/:labId/inventory/transfers | Lab API + PostgreSQL | PASS |
| 22 | waste — สารหมดอายุ / ส่งกำจัด | /app/:labId/inventory/waste | Lab API + PostgreSQL | PASS |
| 23 | equipment — ทะเบียนเครื่องมือ | /app/:labId/equipment | Lab API + PostgreSQL | PASS |
| 24 | equipment-detail — รายละเอียดเครื่องมือ | /app/:labId/equipment/:id | Lab API + PostgreSQL | PASS |
| 25 | calendar — ปฏิทินการจอง | /app/:labId/bookings/calendar | Lab API + PostgreSQL | PASS |
| 26 | bookings — รายการจอง | /app/:labId/bookings | Lab API + PostgreSQL | PASS |
| 27 | booking-new — สร้างคำขอจอง | /app/:labId/bookings/new | Lab API + PostgreSQL | PASS |
| 28 | booking-detail — รายละเอียดการจอง | /app/:labId/bookings/:id | Lab API + PostgreSQL | PASS |
| 29 | issues — รายการแจ้งเสีย | /app/:labId/equipment/issues | Lab API + PostgreSQL | PASS |
| 30 | issue-new — แจ้งปัญหาเครื่องมือ | /app/:labId/equipment/issues/new | Lab API + PostgreSQL | PASS |
| 31 | issue-detail — รายละเอียดปัญหา | /app/:labId/equipment/issues/:id | Lab API + PostgreSQL | PASS |
| 32 | maintenance — ซ่อมบำรุง / สอบเทียบ | /app/:labId/maintenance | Lab API + PostgreSQL | PASS |
| 33 | maintenance-detail — ใบงานซ่อม / ตรวจรับ | /app/:labId/maintenance/:id | Lab API + PostgreSQL | PASS |
| 34 | safety — ความปลอดภัย | /app/:labId/safety | Lab API + PostgreSQL | PASS |
| 35 | documents — เอกสาร SDS / SOP | /app/:labId/documents | Lab API + PostgreSQL | PASS |
| 36 | training — การอบรม / ใบรับรอง | /app/:labId/training | Lab API + PostgreSQL | PASS |
| 37 | approvals — งานรออนุมัติ | /app/:labId/approvals | Lab API + PostgreSQL | PASS |
| 38 | members — สมาชิกและสิทธิ์ | /app/:labId/members | Lab API + PostgreSQL | PASS |
| 39 | reports — รายงานและสถิติ | /app/:labId/reports | Lab API + PostgreSQL | PASS |
| 40 | activity — Audit Log ห้อง | /app/:labId/activity | Lab API + PostgreSQL | PASS |
| 41 | settings — ตั้งค่าห้อง | /app/:labId/settings | Lab API + PostgreSQL | PASS |
| 42 | platform — ภาพรวมแพลตฟอร์ม | /platform | Platform API + MFA | PASS |
| 43 | platform-labs — ห้องปฏิบัติการทั้งหมด | /platform/labs | Platform API + MFA | PASS |
| 44 | platform-lab-detail — รายละเอียดห้อง | /platform/labs/:id | Platform API + MFA | PASS |
| 45 | platform-orgs — องค์กร / หน่วยงาน | /platform/organizations | Platform API + MFA | PASS |
| 46 | platform-users — บัญชีผู้ใช้ทั้งหมด | /platform/users | Platform API + MFA | PASS |
| 47 | platform-audit — Audit แพลตฟอร์ม | /platform/audit | Platform API + MFA | PASS |
| 48 | platform-health — สถานะบริการ | /platform/health | Platform API + MFA | PASS |
| 49 | forbidden — 403 ไม่มีสิทธิ์ | /403 | สถานะจริง / API retry | PASS |
| 50 | not-found — 404 ไม่พบหน้า | /404 | สถานะจริง / API retry | PASS |
| 51 | offline — การเชื่อมต่อขัดข้อง | /offline | สถานะจริง / API retry | PASS |

## รายฟังก์ชันและสถานะ

| โมดูล | พฤติกรรมที่พัฒนา/รักษาไว้ | สถานะ / วิธีตรวจ |
|---|---|---|
| Authentication | สมัคร/ยืนยันอีเมล/ลิงก์ใช้ครั้งเดียว/รีเซ็ต/เปลี่ยนรหัสผ่าน/Session/CSRF/Rate limit/MFA + Recovery | PASS — API tests + Browser login + secondary proof |
| RBAC / Multi-Lab | 6 roles × CHEM/BIO/MAT, เดารหัสข้ามห้องไม่ได้, ผู้ใช้ระงับไม่มีสิทธิ์, Admin ต้องมี session MFA | PASS — API tests |
| Invitations / Admin | บัญชีใหม่และบัญชีเดิม, บังคับเข้าสู่ระบบเมื่อใช้บัญชีเดิม, คำเชิญใช้ครั้งเดียว, หลายห้อง, จัดบทบาท/อนุมัติสมาชิก | PASS — API tests + 45-check secondary proof |
| Chemical catalog | เพิ่ม/แก้/เก็บถาวร, ค้นหา CAS/อันตราย/จุดจัดเก็บ/ใกล้หมดอายุ/ใกล้หมด, CSV รายการที่เลือก | PASS — API tests + Browser |
| Containers / Receipts | ขวด/ล็อต/หน่วย Decimal, รับเข้า idempotent, วันหมดอายุ/กักกัน, QR, ย้ายจุดจัดเก็บพร้อม audit | PASS — API tests + Browser |
| Withdrawal | หลายรายการ, อนุมัติ/สำรอง FEFO แยกจากจ่ายจริง, จ่ายบางส่วน, ป้องกันซ้ำ/สต็อกติดลบ/แข่งกัน, คืน/ยกเลิก/ปฏิเสธ | PASS — API tests + Browser + secondary proof |
| SDS / Training prerequisites | ตรวจบัญชี/สมาชิก/SDS ที่ยังไม่หมดอายุและอ่านได้/อบรมซ้ำก่อนอนุมัติและจ่าย; ปิด mixed-role MFA bypass | PASS — API tests |
| Stocktake / Ledger | snapshot/variance/stale count, อนุมัติสร้าง ledger, stock/audit append-only, ADJUST_IN/OUT filter | PASS — API tests + extra detail routes |
| Transfers / Waste | dispatch/receive, ผู้รับมีสิทธิ์, reject/return ยอดคืนตรงเดิม, ไม่มี double-count, quarantine ก่อน dispose | PASS — API tests + secondary proof |
| Equipment | ทะเบียน/แก้ไข/สถานะ/การอบรม/สอบเทียบ, Cards/Table, QR, เอกสารและประวัติสัมพันธ์ | PASS — API tests + Browser |
| Booking / Quota | ไม่ซ้อนรวม concurrent approvals + DB exclusion, ขอบเวลาติดกันได้, Bangkok unique days, 3 วัน/สัปดาห์, ข้ามสัปดาห์/หลายเครื่อง/ข้อยกเว้น | PASS — Unit + API tests + Browser |
| Booking lifecycle | approve/reject/cancel/reschedule/reset approval, check-in window/zero policy, actual check-out, no-show/waiver | PASS — API tests + Browser + secondary proof |
| Booking privacy | ช่องเวลาสาธารณะปิด purpose/note/history; ค้นหาของผู้อื่นเป็น substring ไม่ได้ | PASS — API tests + Browser |
| Issues / Maintenance | แจ้งเสียพร้อมภาพจริง, safety stop กระทบการจอง, ซ่อม/ทดสอบ/ตรวจรับ, หลายใบงาน, optional Safety signoff, calibration มีผลต่อการคืนเครื่อง | PASS — API tests + Browser |
| Safety / Documents | Private default, SDS/SOP/ใบรับรองแยก visibility, ไฟล์ 10 MB/type/signature, authenticated download, compatibility เป็นผลทบทวนโดยมนุษย์ | PASS — API tests + Browser |
| Training | ยื่นหลักฐาน/อนุมัติ/เพิกถอน/หมดอายุ, จำกัดประวัติส่วนตัวเมื่อไม่ใช่ผู้รับผิดชอบ | PASS — API tests + all-screen/detail checks |
| Notifications | ในระบบ + Mailpit outbox, dedupe/retry, อ่านรายรายการ/ทั้งหมด/กรองยังไม่อ่าน, ค่าตั้งอีเมลต่อห้อง | PASS — API tests + Browser |
| Reports / Audit | KPI จริง, ช่วงวัน/CSV UTF-8 BOM/formula safety, stock/usage/booking/downtime/cost/utilization, scope/สิทธิ์, ประวัติและตัวกรอง | PASS — API tests + Browser |
| Settings / Master data | นโยบายโควตา/เปิดทำการ/แจ้งเตือน, จุดจัดเก็บ/ผู้จำหน่าย/ประกาศ/สมาชิก, archive ห้องพร้อม audit | PASS — API + all-route Browser checks |
| Platform | องค์กร/ห้อง/ผู้ใช้/พักบัญชี/ภาพรวม/Audit, รายละเอียดห้องและ archive/reactivate, health วัด DB/storage/SMTP จริง | PASS — API tests + all-screen Browser |
| Design / Responsive | 51 reference screens, standalone forms, grouped sidebar, dashboard area chart/action inbox, weekly hourly schedule, tabs/timelines, offline recovery | PASS — Headless reference audit + 3 viewports |
| Operations | 6 migrations, named volume เดิม, seed ซ้ำไม่เพิ่มข้อมูล/เปลี่ยนยอด, native build, Local runtime 5173/3001 | PASS — Database/Docker/runtime evidence |

หลักฐาน Playwright รอบแรกและรอบแก้การรอโหลดภาพถูกเก็บแยกตาม sourceReports ใน verified summary; ไม่ถือผล FAIL เดิมเป็น PASS. โค้ด application ไม่เปลี่ยนระหว่าง screen run ที่ผ่านกับ workflow rerun ที่ผ่าน เปลี่ยนเฉพาะตัวทดสอบให้รอ actual image decode.

## ปัญหาที่ตรวจพบและแก้แล้ว

- การประกาศ GET return history ซ้ำที่เพิ่มระหว่างพัฒนา: นำเฉพาะส่วนซ้ำออกและใช้ route เดิมต่อ.
- Test harness เดิมรอ modal แต่ฟอร์มเปลี่ยนเป็นหน้าเต็ม: รอ response/navigation จริง และบัญชีใหม่ต่อรอบเพื่อไม่ให้โควตาจากรอบก่อนรบกวน.
- Audit request/entity ID เป็นข้อความ: แปลงชื่อเฉพาะ UUID; เพิ่ม regression.
- Private SDS ของผู้อื่น: ต้องเป็นไฟล์ที่ผู้รับอ่านได้; mixed Admin/Safety ใช้ session MFA ตาม effective permission. กรณีพิสูจน์ session ของ Admin คนอื่นไม่ได้ ใช้ LAB-visible หรือ uploader-owned SDS แบบ fail-closed.
- Ledger adjustment filter ใช้ชื่อผิด: เปลี่ยนให้ตรง ADJUST_IN/OUT และทดสอบ actual row.
- Booking purpose search oracle ที่มีเดิม: ผู้ไม่ใช่ manager ค้นหา purpose ได้เฉพาะรายการตนเองก่อนคำนวณผลและจำนวน.

## Database / Docker

- PostgreSQL 17.7 บน 127.0.0.1:5433; Compose project labsphere-local และ named volume labsphere-local_labsphere_pg เดิม. Mailpit บน 1025/8025.
- ทั้ง labsphere และ labsphere_test ใช้ migrations 001–006. Migration 006 เปลี่ยนเฉพาะค่า default Document.visibility เป็น PRIVATE; ไม่เขียนทับ visibility เดิม.
- Development snapshot หลัง seed ซ้ำ: organizations=1, labs=3, users=19, memberships=21, chemicals=9, containers=18, equipment=12, training=12, documents=9, ledger=18, audit=3. จำนวนและยอดไม่มีการเปลี่ยนจาก seed ซ้ำ.
- ประวัติคำขอ/ปรับยอดจาก tests อยู่ใน labsphere_test; ข้อมูล Development ไม่ถูกรีเซ็ต. หลักฐาน no-show ใช้ approved booking ใหม่ที่เตรียมให้เป็นอดีตเฉพาะใน test DB.

## วิธีใช้ Local

1. เปิด Docker Desktop; ที่ D:\git\LabSphere รัน npm install (เมื่อจำเป็น), npm run setup:local, npm run db:up, npm run db:generate, npm run db:migrate, npm run db:seed:dev, npm run dev. setup:local ไม่เขียนทับ .env เดิม.
2. เว็บ [http://localhost:5173](http://localhost:5173), API [http://localhost:3001/api/v1/health](http://localhost:3001/api/v1/health), Swagger [http://localhost:3001/api/docs](http://localhost:3001/api/docs), Mailpit [http://localhost:8025](http://localhost:8025).
3. ปัจจุบันปล่อย Dev server ไว้ใน exec session 28598; ไม่เปิดแท็บ/Preview อัตโนมัติ. หากหยุดไปให้รัน npm run dev ใหม่.
4. Admin/Super Admin ต้องเปิด TOTP ที่ Account Security และเก็บ Recovery Codes ก่อนทำ privileged action. ค่า dev password ดูเฉพาะ DEV_SEED_PASSWORD ใน .env ของเครื่องนี้; รายงานนี้ไม่แสดงรหัสผ่าน/Secret.
5. ทดสอบซ้ำ: สร้าง labsphere_test ครั้งแรกด้วย docker compose exec -T postgres createdb -U labsphere labsphere_test หากยังไม่มี แล้วรัน npm run typecheck, npm run lint, npm test, npm run test:e2e. Test scripts migrate เฉพาะ labsphere_test; integration tests สร้างประวัติสำหรับ extra detail routes.
6. Backup/isolated restore ใช้ npm run db:backup:local และ npm run db:restore:isolated -- <dump>; ไม่มี restore ทับ development โดยปริยาย.

## บัญชี Development

| Role | Email | ห้อง |
|---|---|---|
| Platform Super Admin | platform@labsphere.test | ทุกห้อง; ต้องตั้ง MFA |
| Lab Admin | admin.chem@labsphere.test | CHEM; ต้องตั้ง MFA |
| Chemical Manager | chemical.chem@labsphere.test | CHEM |
| Equipment Manager | equipment.chem@labsphere.test | CHEM |
| Safety Officer | safety.chem@labsphere.test | CHEM |
| Member | member.chem@labsphere.test | CHEM |
| Viewer | viewer.chem@labsphere.test | CHEM |

เปลี่ยน .chem เป็น .bio หรือ .mat สำหรับบัญชีแยกของอีกสองห้อง. บัญชี Browser/API QA เป็นบัญชีสังเคราะห์ต่อรอบใน test DB ไม่ใช่บัญชีใช้งาน Development.

## ข้อจำกัด / สิ่งที่ยังไม่ทำ

- **Local blocker: ไม่มีที่ทราบว่าค้างและแก้ได้หลังรอบตรวจนี้.** ไม่รับรอง Production readiness หรือ EHS compliance ของข้อมูลตัวอย่าง.
- OIDC/SSO, ownCloud และ malware scanner จริงเป็น optional interfaces ตาม Master; ยัง disabled/NOT_SCANNED ไม่อ้างว่าไฟล์ปลอดมัลแวร์. LINE/real SMTP และ Production deployment ไม่ได้เปิดใช้.
- ต้องนำ SDS/SOP จริง ใบสอบเทียบจริง และนโยบายองค์กรมาให้ผู้รับผิดชอบตรวจยืนยันก่อนใช้งานจริง. ตัวอย่างทุกไฟล์/ผู้ใช้/ข้อมูลเป็นข้อมูลสังเคราะห์.
- หลักของ Master เช่น Monday–Sunday/Bangkok, mandatory approval, private access และ CSV มาก่อนตัวเลือก/ตัวเลข/ปุ่มสาธิตใน HTML. ไม่จำลอง role picker เพื่อเปลี่ยนสิทธิ์จริง และไม่อ้าง visual pixel-identical.
- Related detail histories จำกัดล่าสุด 100 แถว; list APIs มี pagination สำหรับประวัติยาว. ยังไม่ได้ทำ large-scale load test, penetration test, browser engines อื่นนอก Chromium หรือทดสอบทุกชุดสถานะที่เป็นไปได้.
- Build ผ่าน แต่มีคำเตือน JavaScript bundle ประมาณ 931 kB ก่อน gzip (~276 kB gzip). Code splitting เป็นงานปรับประสิทธิภาพก่อนใช้งานขนาดใหญ่.
- Sandbox launcher ชน BitLocker F: ที่ล็อกอยู่; ใช้คำสั่ง workspace ที่ผ่าน approval แทนได้. Docker Engine เริ่มใหม่โดยใช้ volume เดิม. คำสั่ง heuristic revoke เซสชันเก่าถูก automatic approval review ปฏิเสธและไม่ได้ทำ; ใช้ logout เฉพาะ proof session ปัจจุบันแทน จึงไม่ติดขัดต่อผล Local.

## ก่อน Production

ต้องแยก deployment approval, HTTPS/secure cookies/secrets manager, backup/restore drill, monitoring/retention, production identity/storage/scanner, least privilege/network policy, performance/penetration testing และ EHS/UAT โดยผู้รับผิดชอบ. ไม่มีการ Deploy/Push Git หรือเชื่อมฐานข้อมูล Server จริงในรอบนี้.

Audit supplement: การรับคำเชิญบันทึก status/roles ก่อน–หลังโดยไม่บันทึก token/password; actor/date filters รักษาขอบเขต role/lab และวันสิ้นสุดครอบคลุม millisecond สุดท้าย.

Frozen source manifest: docs/assurance/design-integration-manifest.json. Parent ยืนยัน hash ไม่เปลี่ยนหลัง review; reviewer ยอมรับเฉพาะขอบเขต Backend ที่ระบุ ส่วน Frontend/Integration/Runtime ตรวจโดย Parent พร้อมหลักฐานข้างต้น.
