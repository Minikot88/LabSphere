# LabSphere — Full UI/UX Design Reference (51 Screens)

**Version:** 1.1 · **Date:** 25 October 2026 · **Status:** interactive visual prototype only  
**Primary asset:** `LABSPHERE_ALL_PAGES_INTERACTIVE_DESIGN.html`  
**Related development specification:** `LAB_MANAGEMENT_CODEX_MASTER_BUILD_2026-10-25.md`

## 1. วัตถุประสงค์

ไฟล์ HTML เป็น **Design Reference** สำหรับระบบ Laboratory Chemical & Equipment Management แบบ **Multi-Laboratory** รองรับหลายห้องปฏิบัติการ ภายใต้แพลตฟอร์มเดียว มีหน้าจอรวม **51 หน้า** และใช้ข้อมูลตัวอย่างสังเคราะห์ ไม่เชื่อม API/Prisma/PostgreSQL. สามารถดับเบิลคลิกเปิดใน Chrome/Edge โดยไม่ต้องต่ออินเทอร์เน็ต ไม่ต้องรัน Docker.

โปรดอย่านำ HTML ไปใช้งานเป็น Production หรือเข้าใจว่าการกดอนุมัติในตัวอย่างทำให้เกิดธุรกรรมจริง: ปุ่มบางปุ่มเปิดหน้า, สลับแท็บ, ยืนยันตัวอย่าง, เปลี่ยนสถานะชั่วคราว หรือแจ้งว่าเป็นต้นแบบเท่านั้น.

## 2. Design System

| หัวข้อ | ข้อกำหนด |
|---|---|
| Product name | LabSphere — Laboratory Management |
| Language | Thai-first; technical keywords in English as appropriate |
| Theme | White / Teal / Navy · Enterprise Clean |
| Primary color | `#0E7B74`; dark `#09655E` |
| Deep navy | `#152B3B` |
| App background | `#F5F7F9` |
| Card surface | `#FFFFFF` |
| Border | `#E3EAF0` |
| Positive | Green semantic badge plus text |
| Warning | Orange semantic badge plus text |
| Danger | Red semantic badge plus text |
| Typography | `Noto Sans Thai`, Inter/system fallbacks |
| Spacing | 4, 8, 12, 16, 24, 32 px |
| Border radius | 9–14 px |
| Responsive | Desktop 1440, Tablet 768, Mobile 390 |
| Navigation | Sticky Sidebar + grouped navigation; mobile drawer |
| Data display | Statistics, searchable tables, status chips, charts, calendar, timeline |
| Common controls | Confirm dialog, filter, empty state, detail tabs, forms, action buttons |

## 3. Screen Inventory — 51 Screens

### A. การเข้าถึงระบบ (7)

1. `login` — เข้าสู่ระบบ
2. `register` — สมัครสมาชิก
3. `verify-email` — ยืนยันอีเมล
4. `forgot-password` — ลืมรหัสผ่าน
5. `reset-password` — ตั้งรหัสผ่านใหม่
6. `invite-accept` — ตอบรับคำเชิญ
7. `select-lab` — เลือกห้องปฏิบัติการ

### B. Dashboard และบัญชีผู้ใช้ (5)

8. `screens` — สารบัญดีไซน์ทุกหน้า
9. `dashboard` — ภาพรวมเฉพาะห้อง
10. `notifications` — แจ้งเตือน
11. `profile` — โปรไฟล์ผู้ใช้
12. `security` — ความปลอดภัยบัญชี

### C. สารเคมีและคลัง (10)

13. `chemicals` — รายการสารเคมี
14. `chemical-new` — เพิ่มชนิดสารเคมี
15. `chemical-detail` — รายละเอียดสารเคมีพร้อมแท็บ
16. `container-detail` — รายละเอียดขวด / Lot / QR
17. `receive` — รับสารเข้าคลัง
18. `withdrawals` — รายการคำขอเบิก
19. `withdrawal-detail` — อนุมัติ / จ่ายจริง
20. `stocktakes` — ตรวจนับสต็อก
21. `transfers` — โอนย้ายภายในหรือข้ามห้อง
22. `waste` — สารหมดอายุ / ส่งกำจัด

### D. เครื่องมือและการจอง (11)

23. `equipment` — ทะเบียนเครื่องมือ + Cards/Table
24. `equipment-detail` — รายละเอียดเครื่องมือ
25. `calendar` — ปฏิทินรายสัปดาห์
26. `bookings` — รายการจอง
27. `booking-new` — สร้างคำขอจอง + Quota
28. `booking-detail` — อนุมัติ / Check-in / Check-out
29. `issues` — รายการแจ้งเสีย
30. `issue-new` — แบบฟอร์มแจ้งปัญหา
31. `issue-detail` — รายละเอียดปัญหา + Timeline
32. `maintenance` — ซ่อมบำรุง / สอบเทียบ
33. `maintenance-detail` — ใบงานซ่อม / ตรวจรับ

### E. ความปลอดภัยและบริหารห้อง (8)

34. `safety` — ด้านความปลอดภัย
35. `documents` — SDS / SOP / คู่มือ
36. `training` — การอบรม / ใบรับรอง
37. `approvals` — กล่องคำขออนุมัติ
38. `members` — สมาชิก / ผู้ดูแลหลายคน / บทบาท
39. `reports` — รายงานและการส่งออก
40. `activity` — Audit Log ภายในห้อง
41. `settings` — นโยบาย / การแจ้งเตือน / Quota

### F. Super Admin (7)

42. `platform` — ภาพรวมทั้งแพลตฟอร์ม
43. `platform-labs` — จัดการห้องทั้งหมด
44. `platform-lab-detail` — รายละเอียดห้อง
45. `platform-orgs` — องค์กร / หน่วยงาน
46. `platform-users` — ผู้ใช้ทุกห้อง
47. `platform-audit` — Audit ระดับแพลตฟอร์ม
48. `platform-health` — แม่แบบตรวจสถานะบริการ

### G. Error States (3)

49. `forbidden` — 403 ไม่มีสิทธิ์
50. `not-found` — 404 ไม่พบหน้า
51. `offline` — ไม่สามารถเชื่อมต่อระบบ

**การเปิดหน้าตรง:** เปิดไฟล์ HTML แล้วใส่ `#<screen-id>` ต่อท้ายตำแหน่งไฟล์ เช่น `...html#calendar` หรือคลิกจากหน้าสารบัญ.

## 4. Role & Multi-Lab UX

- **Platform Super Admin:** เห็นภาพรวมทุกห้อง การสร้างห้อง และภาพรวมสมาชิกทั้งแพลตฟอร์ม; หน้าเกี่ยวข้อง `platform*`.
- **Lab Admin:** ดูคำขออนุมัติ สต็อก เครื่องมือ สมาชิก การตั้งค่าของห้อง.
- **Chemical Manager:** เน้นคลัง การเบิก การปรับยอด การโอนย้าย และเอกสารสารเคมี.
- **Equipment Manager:** เน้นจองเครื่องมือ ตรวจโควตา แจ้งเสีย งานซ่อม และการตรวจรับ.
- **Safety Officer:** เน้น SDS/SOP, การอบรม, สารหมดอายุ และข้อกำหนดความปลอดภัย.
- **Lab Member:** เข้าดูรายการสาร ขอเบิก จองเครื่องมือ แจ้งปัญหา และติดตามคำขอ.

ตัวเลือกบทบาทที่มุมขวาบน **มีไว้ให้ดูบริบทการแสดงผล** ไม่ใช่ระบบ RBAC จริง. ระบบ Production ต้องบังคับสิทธิ์ฝั่ง Server และตรวจ `labId` สำหรับทุกคำขอ ไม่ให้ข้ามห้องโดยไม่ได้รับสิทธิ์.

## 5. Flows ที่ Codex ต้องพัฒนาจริงตาม Design

1. **สมัครสมาชิก:** Register → Email Verify → Admin Approval → Login → Select Lab.
2. **คลัง:** Chemical Catalog → Container/Lot → Stock Receive → Withdrawal Request → Approval → Actual Dispense → Ledger Update.
3. **การจอง:** Equipment → Calendar → Booking New → Verify Training + 3 Distinct Days/Week/Member/Lab → Pending → Approval → Check-in → Check-out.
4. **แจ้งเสีย:** Equipment Detail / Booking Detail → Issue New → Block Use → Repair → Verify Serviceability → Available.
5. **ผู้ดูแลหลายคน:** Invite → Membership Approval → Lab Scoped Role Assignment → Audit.
6. **หลายห้อง:** Platform Lab List → Select Lab → Separate Inventory/Equipment/Membership and Reports → Optional Cross-Lab Transfer with Receiver Acceptance.
7. **รายงาน:** Filters + Real API Aggregation → CSV Export → Permission Check.

## 6. Mapping to Implementation

**Frontend:** Vite.js + React + TypeScript + React Router + Tailwind CSS + shadcn/ui.  
**Backend:** Node.js + TypeScript + Fastify REST API.  
**ORM:** Prisma ORM.  
**Database:** PostgreSQL via Docker Compose **บนเครื่อง Local เท่านั้น**.  
**Automated tests:** Vitest + Playwright.  
**Storage:** Private filesystem adapter for Local; optional ownCloud/OIDC integrations later.

ให้แปลง Screen IDs เป็น Router Paths ตามเอกสาร Master Spec (เช่น `/app/:labId/dashboard`, `/app/:labId/chemicals`, `/app/:labId/bookings/calendar`, `/platform`, `/login`). ออกแบบ UI ที่ทุกการเปลี่ยนสถานะสำคัญเรียก Backend API และรับค่าจริงจาก PostgreSQL; ห้ามใช้สถานะ Mock ภายใน JavaScript แทนธุรกรรมจริงเมื่อพัฒนา Production-ready application.

### Prompt สำหรับ Codex (ใช้คู่กับ Master Spec)

```text
อ่าน LAB_MANAGEMENT_CODEX_MASTER_BUILD_2026-10-25.md และ LABSPHERE_ALL_PAGES_DESIGN_GUIDE.md ทั้งหมด แล้วเปิด LABSPHERE_ALL_PAGES_INTERACTIVE_DESIGN.html เพื่อใช้เป็น Visual UI/UX Reference ของ LabSphere (51 หน้าจอ).

ในรอบการทำงานเดียว ให้พัฒนาระบบจริงทั้งหมดตาม Master Spec ด้วย Vite + React + TypeScript + Tailwind + shadcn/ui, Backend Fastify + TypeScript, Prisma + PostgreSQL ผ่าน Docker Compose Local พร้อม Multi-Lab Tenant Isolation, RBAC, Approval Workflow, Stock Ledger, Equipment Booking & Quota, Safety, Maintenance, Notifications, Reports และ Audit Log.

ให้สร้างหน้าจอตาม Design Reference ครบทั้ง 51 หน้า/สถานะ UI และใช้ธีม White/Teal/Navy, responsive desktop/tablet/mobile. ปุ่มทุกปุ่มของระบบที่มีหน้าที่ดำเนินงานจริงต้องเชื่อม API/Database ไม่ใช่แจ้งเตือนหลอกหรือเปลี่ยน state เฉพาะหน้า. หน้า platform ต้องบังคับ Super Admin authorization ฝั่ง Backend. พัฒนาและรัน migrations, seed เฉพาะ Local, tests, E2E, build, README, .env.example, implementation report.

ตรวจ repo ที่เปิดอยู่ก่อนเสมอ ห้ามลบข้อมูลเดิมหรือ Docker Volumes โดยพลการ ห้าม Deploy Production, Push Git หรือเชื่อมฐานข้อมูล Production. ทำให้มากที่สุดในคำสั่งเดียว ไม่หยุดถามในรายละเอียดที่มี default ชัดเจนแล้ว; หากมี blocker ให้รายงานตามจริงพร้อม partial results และไม่กล่าวอ้างว่า PASS เมื่อไม่ได้รันทดสอบ.
```

## 7. UI QA ที่ดำเนินการแล้ว

- ตรวจ Syntax JavaScript และเปิดทุกหน้าใน Chromium ผ่าน Playwright ด้วย `set_content`.
- เปิดครบ **51/51 screen IDs** สำหรับ Desktop 1440×900 และ Mobile 390×844.
- ไม่พบ `pageerror` และไม่มี `documentElement.scrollWidth` ล้น viewport จากทั้ง 51 หน้าในช่วงทดสอบ.
- ตรวจภาพหน้าจอ Dashboard, Chemicals, Equipment, Calendar, Approvals, Platform และหน้าจอมือถือ.
- ยัง **ไม่ได้ทดสอบ API, Database, Authentication, RBAC, Performance หรือ Workflow แบบ end-to-end** เพราะนี่เป็น Prototype ที่ไม่มีบริการ Backend.

## 8. Files

- `LABSPHERE_ALL_PAGES_INTERACTIVE_DESIGN.html` — ตัวอย่างคลิกทุกหน้า (51 หน้าจอ)
- `LABSPHERE_DESIGN_OVERVIEW.png` — ภาพรวมดีไซน์หลัก 6 หน้าจอ
- `LABSPHERE_DESIGN_DASHBOARD.png` — ตัวอย่าง Dashboard
- `LABSPHERE_MOBILE_DASHBOARD.png` — ตัวอย่าง Responsive Mobile
- `LAB_MANAGEMENT_CODEX_MASTER_BUILD_2026-10-25.md` — Master Specification สำหรับให้ Codex สร้างระบบจริง

