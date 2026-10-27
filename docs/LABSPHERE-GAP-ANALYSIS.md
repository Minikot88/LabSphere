# LabSphere 51-screen gap analysis

Baseline: existing PostgreSQL/API implementation before design integration. The static HTML is a visual reference with synthetic data, not application code.

| # | Screen | Application route | Baseline gap | Current data source |
|---|---|---|---|---|
| 1 | login — เข้าสู่ระบบ | /login | มีแล้ว | Authentication API / PostgreSQL |
| 2 | register — สมัครสมาชิก | /register | มีแล้ว | Authentication API / PostgreSQL |
| 3 | verify-email — ยืนยันอีเมล | /verify-email | มีแล้ว | Authentication API / PostgreSQL |
| 4 | forgot-password — ลืมรหัสผ่าน | /forgot-password | มีแล้ว | Authentication API / PostgreSQL |
| 5 | reset-password — ตั้งรหัสผ่านใหม่ | /reset-password | มีแล้ว | Authentication API / PostgreSQL |
| 6 | invite-accept — ตอบรับคำเชิญ | /invite/accept | มีแล้ว | Authentication API / PostgreSQL |
| 7 | select-lab — เลือกห้องปฏิบัติการ | /select-lab | มีแล้ว | Authentication API / PostgreSQL |
| 8 | screens — สารบัญหน้าระบบ | /screens | ขาดหน้า | Static route metadata + scoped API records |
| 9 | dashboard — ภาพรวมห้องปฏิบัติการ | /app/:labId/dashboard | ปรับ dashboard ให้ตรงต้นแบบ | Scoped API / PostgreSQL |
| 10 | notifications — การแจ้งเตือน | /notifications | ขาดกรองยังไม่อ่านและอ่านทั้งหมด | Scoped API / PostgreSQL |
| 11 | profile — โปรไฟล์ | /profile | ขาดห้องที่เป็นสมาชิก | Scoped API / PostgreSQL |
| 12 | security — ความปลอดภัยบัญชี | /account/security | มีแล้ว | Scoped API / PostgreSQL |
| 13 | chemicals — สารเคมี | /app/:labId/chemicals | มีแล้ว | Scoped API / PostgreSQL |
| 14 | chemical-new — เพิ่มชนิดสารเคมี | /app/:labId/chemicals/new | ฟอร์ม modal | Scoped API / PostgreSQL |
| 15 | chemical-detail — รายละเอียดสารเคมี | /app/:labId/chemicals/:id | แท็บจริง; ขาดข้อมูลสัมพันธ์ | Scoped API / PostgreSQL |
| 16 | container-detail — รายละเอียดขวด / Lot | /app/:labId/containers/:id | ขาด timeline และรายการเคลื่อนไหว | Scoped API / PostgreSQL |
| 17 | receive — รับเข้าสารเคมี | /app/:labId/inventory/receive | มีแล้ว | Scoped API / PostgreSQL |
| 18 | withdrawals — คำขอเบิกสาร | /app/:labId/withdrawals | มีแล้ว | Scoped API / PostgreSQL |
| 19 | withdrawal-detail — อนุมัติและจ่ายสาร | /app/:labId/withdrawals/:id | ขาด timeline และชื่ออ้างอิง | Scoped API / PostgreSQL |
| 20 | stocktakes — ตรวจนับสต็อก | /app/:labId/inventory/stocktakes | มีแล้ว | Scoped API / PostgreSQL |
| 21 | transfers — โอนย้ายสาร | /app/:labId/inventory/transfers | มีแล้ว | Scoped API / PostgreSQL |
| 22 | waste — สารหมดอายุ / ส่งกำจัด | /app/:labId/inventory/waste | มีแล้ว | Scoped API / PostgreSQL |
| 23 | equipment — ทะเบียนเครื่องมือ | /app/:labId/equipment | ขาด Cards view | Scoped API / PostgreSQL |
| 24 | equipment-detail — รายละเอียดเครื่องมือ | /app/:labId/equipment/:id | ขาดแท็บ SOP การอบรมและประวัติ | Scoped API / PostgreSQL |
| 25 | calendar — ปฏิทินการจอง | /app/:labId/bookings/calendar | มีสัปดาห์แต่ขาดตารางเวลา | Scoped API / PostgreSQL |
| 26 | bookings — รายการจอง | /app/:labId/bookings | มีแล้ว | Scoped API / PostgreSQL |
| 27 | booking-new — สร้างคำขอจอง | /app/:labId/bookings/new | ขาด quota preview ในฟอร์ม | Scoped API / PostgreSQL |
| 28 | booking-detail — รายละเอียดการจอง | /app/:labId/bookings/:id | ไม่แสดง usage และ timeline | Scoped API / PostgreSQL |
| 29 | issues — รายการแจ้งเสีย | /app/:labId/equipment/issues | มีแล้ว | Scoped API / PostgreSQL |
| 30 | issue-new — แจ้งปัญหาเครื่องมือ | /app/:labId/equipment/issues/new | มีแล้ว; อ้างอิงรูปผ่านเอกสาร | Scoped API / PostgreSQL |
| 31 | issue-detail — รายละเอียดปัญหา | /app/:labId/equipment/issues/:id | ขาด timeline | Scoped API / PostgreSQL |
| 32 | maintenance — ซ่อมบำรุง / สอบเทียบ | /app/:labId/maintenance | มีแล้ว | Scoped API / PostgreSQL |
| 33 | maintenance-detail — ใบงานซ่อม / ตรวจรับ | /app/:labId/maintenance/:id | ขาด timeline | Scoped API / PostgreSQL |
| 34 | safety — ความปลอดภัย | /app/:labId/safety | มีแล้ว | Scoped API / PostgreSQL |
| 35 | documents — เอกสาร SDS / SOP | /app/:labId/documents | มีแล้ว | Scoped API / PostgreSQL |
| 36 | training — การอบรม / ใบรับรอง | /app/:labId/training | มีแล้ว | Scoped API / PostgreSQL |
| 37 | approvals — งานรออนุมัติ | /app/:labId/approvals | ขาดตัวกรองและยอดรวม | Scoped API / PostgreSQL |
| 38 | members — สมาชิกและสิทธิ์ | /app/:labId/members | มีแล้ว | Scoped API / PostgreSQL |
| 39 | reports — รายงานและสถิติ | /app/:labId/reports | มีแล้ว | Scoped API / PostgreSQL |
| 40 | activity — Audit Log ห้อง | /app/:labId/activity | มีแล้ว; ขาดตัวกรองเหตุการณ์ | Scoped API / PostgreSQL |
| 41 | settings — ตั้งค่าห้อง | /app/:labId/settings | มีแล้ว | Scoped API / PostgreSQL |
| 42 | platform — ภาพรวมแพลตฟอร์ม | /platform | ขาดสถิติทรัพยากรรวม | Super Admin API / PostgreSQL (health: measured services) |
| 43 | platform-labs — ห้องปฏิบัติการทั้งหมด | /platform/labs | มีแล้ว | Super Admin API / PostgreSQL (health: measured services) |
| 44 | platform-lab-detail — รายละเอียดห้อง | /platform/labs/:id | ขาดหน้าและ API | Super Admin API / PostgreSQL (health: measured services) |
| 45 | platform-orgs — องค์กร / หน่วยงาน | /platform/organizations | มีแล้ว | Super Admin API / PostgreSQL (health: measured services) |
| 46 | platform-users — บัญชีผู้ใช้ทั้งหมด | /platform/users | มีแล้ว | Super Admin API / PostgreSQL (health: measured services) |
| 47 | platform-audit — Audit แพลตฟอร์ม | /platform/audit | มีแล้ว; ขาดตัวกรอง | Super Admin API / PostgreSQL (health: measured services) |
| 48 | platform-health — สถานะบริการ | /platform/health | ขาดหน้าและ API | Super Admin API / PostgreSQL (health: measured services) |
| 49 | forbidden — 403 ไม่มีสิทธิ์ | /403 | มีแล้ว | Real error/recovery state |
| 50 | not-found — 404 ไม่พบหน้า | /404 | มี wildcard | Real error/recovery state |
| 51 | offline — การเชื่อมต่อขัดข้อง | /offline | ขาดหน้าและ recovery | Real error/recovery state |

No mock business records or localStorage persistence are used. New implementation and test status are recorded separately in LABSPHERE-COMPLETE-IMPLEMENTATION-REPORT.md.

Function-level changes: standalone creation forms; scoped context tabs and audit timelines; actual booking usage; equipment cards/table; hourly weekly calendar; candidate quota/availability preview; notification unread/all-read; user membership profile; platform lab lifecycle and aggregate counts; measured DB/storage/SMTP health; private-document default for future uploads; custody moves with immutable audit; validated integer pagination and additional search filters.

Preserved core workflows: ledger receipts/reservations/dispense/return/count/transfer/waste; authorization and MFA; overlap/quota locking; training/calibration eligibility; safety stop, repair, verification/signoff; files, alerts, CSV reports and immutable audit.
