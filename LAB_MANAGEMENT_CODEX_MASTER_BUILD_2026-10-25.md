# LAB MANAGEMENT PLATFORM — MASTER BUILD SPEC & ONE-SHOT CODEX PROMPT

> Version: 1.0 | วันที่: 25 ตุลาคม 2569 (2026-10-25) | ภาษา UI: ไทยเป็นหลัก | สถานะ: **ข้อกำหนด/คำสั่งพัฒนา** ยังไม่ใช่ระบบที่สร้างเสร็จ
>
> **คำสั่งถึง Codex:** เอกสารนี้เป็นทั้ง Product Requirements, UX/UI Specification, Architecture, Data Model, Business Rules, Security Contract, Test Plan และคำสั่งให้ลงมือสร้างระบบทั้งหมดในรอบการทำงานเดียว. ให้อ่านทั้งหมดก่อนเปลี่ยนไฟล์. **สร้างและทดสอบระบบจริงในเครื่อง Local** โดยใช้ Vite + React + TypeScript, Node.js + Fastify, Prisma ORM, PostgreSQL ใน Docker Compose. ระบบต้องรองรับ **หลายห้องปฏิบัติการ** ตั้งแต่แรก. ห้ามนำไป Deploy Production, ห้ามเชื่อม/แก้ฐานข้อมูล Server จริง, ห้าม Push Git, ห้ามทำลายข้อมูลเดิมโดยพลการ.

---

## 0) ONE-SHOT EXECUTION ORDER — คัดลอกช่วงนี้ไปส่ง Codex ได้ทันที

```text
คุณคือ Lead Full-Stack Engineer, Software Architect, Database Engineer, UX/UI Designer, QA/Security Engineer สำหรับโครงการ Laboratory Management Platform.

อ่านไฟล์ LAB_MANAGEMENT_CODEX_MASTER_BUILD_2026-10-25.md ทั้งไฟล์ แล้วดำเนินการ IMPLEMENT ระบบให้ครบตามข้อกำหนดในไฟล์เดียวกันโดยอัตโนมัติในรอบนี้ ไม่ใช่เพียงร่างแผน/Mockup/Prototype และไม่หยุดหลังทำหน้า Dashboard. ทำงานเป็นขั้นภายในรอบเดียวจนได้ระบบรันได้บนเครื่อง Local พร้อมฐาน PostgreSQL บน Docker, Prisma migration/seed, API, UI ทุกหน้า, RBAC/tenant isolation, business logic, tests, E2E และเอกสาร.

Technology ที่ล็อก: Vite.js + React + TypeScript + Tailwind CSS + shadcn/ui (frontend); Node.js + TypeScript + Fastify (backend); Prisma ORM + PostgreSQL (database); Docker Compose สำหรับฐานข้อมูล Local; npm workspaces; Vitest + Playwright. ใช้เทคโนโลยีอื่นเฉพาะส่วนสนับสนุนที่จำเป็น. UI ภาษาไทย, ธีม White/Teal/Navy Enterprise Clean, รองรับ Desktop/Tablet/Mobile. สร้าง Multi-Lab Platform ที่ข้อมูลและสิทธิ์แยกตามห้องอย่างปลอดภัย พร้อม Super Admin ภาพรวมทุกห้อง.

ตรวจสภาพ repository และไฟล์ปัจจุบันก่อน. ถ้า directory ว่างให้ scaffold ใหม่; ถ้าไม่ว่างให้ปรับอย่างปลอดภัย ห้ามลบ/overwrite งานเดิมที่ไม่เกี่ยวข้อง. ตรวจ Node/Docker/Ports. ถ้า Docker ไม่พร้อม ให้สร้าง compose และทดสอบส่วนที่ทำได้ โดยบันทึก BLOCKER ตามจริง; ห้ามอ้างว่า tests ผ่านถ้าไม่ได้รัน. ไม่ถามคำถามระหว่างทางสำหรับรายละเอียดที่เอกสารระบุ default แล้ว; ตัดสินใจเชิงเทคนิคที่ปลอดภัยด้วยตัวเองและบันทึกใน docs/DECISIONS.md. ห้ามข้าม module โดยใช้ TODO/coming soon หรือปุ่มที่กดแล้วไม่ทำงาน. ห้ามใช้ LocalStorage เป็นฐานข้อมูลจริง. ห้ามแสดง fake counters เป็นข้อมูลจริง.

ทำงานตามลำดับ: preflight → scaffold → database & migration → multi-lab auth/RBAC → chemical inventory & approval → equipment booking & quota → usage/maintenance → safety & documents → notifications & reports → UX complete → seed → unit/integration/E2E → audit/bugfix → run local → final report. แม้แบ่งเป็น phase ภายใน แต่ต้องทำทั้งหมดในคำสั่งเดียว ไม่ต้องหยุดให้อนุมัติแต่ละ phase. ห้ามรันคำสั่ง destructive กับ environment อื่นหรือ Production. สร้าง README, .env.example, Docker Compose, scripts และ docs/IMPLEMENTATION-REPORT.md. รายงานสถานะจริงเป็น PASS/PARTIAL/BLOCKED พร้อมคำสั่งเปิดใช้งานและผล tests. อย่า push/merge/deploy.

ผลสุดท้ายต้องเปิด frontend, login สมาชิก/ผู้ดูแล, เลือกห้อง, ทดสอบรับเข้า/เบิกสาร, จองเครื่อง, ตรวจ 3 วัน/สัปดาห์, แจ้งซ่อม, แก้ไขสถานะ, รายงาน, Audit และ isolation ระหว่างห้องได้จริง. อ่าน Acceptance Criteria ทุกข้อจากไฟล์นี้และพิสูจน์ด้วย tests เท่าที่ environment อำนวย.
```

### ข้อควรปฏิบัติกับ repo
1. ใช้ root directory ที่เปิดอยู่ใน VS Code/Codex เป็นตำแหน่งโครงการ ห้ามสมมติว่าอยู่ในไดรฟ์ใด.
2. ตรวจ `git status`, package files, ports, existing DB containers ก่อนสร้าง. ห้าม force reset, hard clean, ลบ volumes, `docker compose down -v` หรือเปลี่ยนไฟล์นอกโครงการโดยไม่ได้รับมอบหมาย.
3. ถ้ามี source/code เดิมให้ทำ inventory และบันทึกการเปลี่ยนแปลงใน `docs/IMPLEMENTATION-REPORT.md`.
4. ไม่ต้องถามผู้ใช้ซ้ำเกี่ยวกับ stack, ธีม, multi-lab, local Docker, quota หรือ authentication — กำหนดไว้แล้วในเอกสาร.
5. การ build หนึ่งรอบหมายถึง **หนึ่งคำสั่งจากผู้ใช้** แต่ภายในสามารถรันคำสั่ง คอมไพล์ ตรวจข้อผิดพลาด แก้ไข และทดสอบซ้ำได้หลายรอบจนเสร็จ.

---

## 1) Product vision, scope และ default policies

**ชื่อระบบใน UI:** LabSphere | ระบบจัดการห้องปฏิบัติการ (สามารถเปลี่ยน branding ภายหลัง)

ระบบกลางสำหรับหน่วยงาน/สถาบันที่มีหลายห้องปฏิบัติการ (multi-lab): ควบคุมสารเคมีรายขวดและสต็อก, การเบิก-รับ-โอน-ตรวจนับ-ทิ้งสาร, บริหารครุภัณฑ์/เครื่องมือ, จองและขออนุมัติ, ใช้งานจริง (check-in/out), แจ้งเสีย/ซ่อมบำรุง/สอบเทียบ, สมาชิก, ความปลอดภัย, เอกสาร, Notification และรายงาน. เป็น **Laboratory Resource Management** ไม่ใช่ LIMS สำหรับวิเคราะห์ผลตัวอย่างทดลอง.

### ขอบเขตองค์กร
- รองรับ 1 Organization ใน Local แต่ data model รองรับหลาย Organization ในอนาคต; hierarchy `Organization > Laboratory > Members/Inventory/Equipment`.
- ผู้ใช้ 1 คนอยู่ได้หลายห้องและมี Role ต่างกันแต่ละห้อง; `Platform Super Admin` มองทุกห้อง; `Org Admin` (optional) มองห้องภายในองค์กร; `Lab Admin`, `Chemical Manager`, `Equipment Manager`, `Safety Officer`, `Lab Member`, `Viewer` แยกสิทธิ์.
- สามารถเพิ่ม/ปิด/เก็บถาวรห้อง, เลือกห้องปัจจุบัน, ย้ายระหว่างห้องโดยไม่ข้อมูลรั่ว.
- **Default business rule:** โควตาจอง 3 **วันปฏิทินที่ไม่ซ้ำ** ต่อสมาชิก **ต่อห้อง** ต่อสัปดาห์ จันทร์–อาทิตย์ใน timezone `Asia/Bangkok`; ใช้กับทุกเครื่องในห้องรวมกัน; อนุญาต admin override เมื่อระบุเหตุผลและบันทึก log. ปรับค่าได้รายห้อง.
- การจองต้อง Admin/Equipment Manager อนุมัติก่อนใช้เสมอ; `pending` ไม่ถือว่ายืนยันช่องเวลา แต่กันโควตาชั่วคราวจนกว่าจะปฏิเสธ/ยกเลิก/หมดอายุ; การ approve ต้องเช็ก slot ซ้ำแบบ atomic.
- สมาชิกสมัครด้วย email/password, ยืนยัน email, Lab Admin อนุมัติ membership ก่อนใช้ทรัพยากร; Platform Super Admin สร้าง/เชิญ Admin ได้; ผู้ดูแลหลายคน.
- ทุกคำขอเบิกต้องผู้มีสิทธิ์อนุมัติก่อนจ่ายจริง; **approved != dispensed**; ห้ามตัดยอดเพียงเพราะ approve.
- Notifications: In-app + Email ผ่าน SMTP/Mailpit ใน Local; LINE OA Messaging API เป็น optional integration เมื่อใส่ credential จริง. **ห้ามใช้ LINE Notify ที่เลิกให้บริการแล้ว**.
- ห้ามบันทึกข้อมูลจริงใน seed; ใช้ synthetic demo fixture แยกเฉพาะ local-development.
- ไม่บังคับเชื่อม PSU SSO/Keycloak หรือ ownCloud ในรอบ Local นี้ แต่สร้าง adapter/provider interfaces ไว้สำหรับ OIDC และ private file storage เพื่อเปลี่ยนภายหลังได้.

### Complete modules — ไม่เลื่อนไป phase อนาคต
1. Auth + Email verification + password reset + user/admin invitation + profile + account status.
2. Organization/Laboratory management, Memberships, role delegation, lab switcher, policy settings.
3. Chemical catalog, CAS/formula/GHS/SDS, containers/batches/lot/expiry, location, unit conversions, QR labels.
4. Chemical stock receipts, withdrawal requests, approval, dispense, return, transfer, adjustment, stocktake, hazardous waste.
5. Equipment registry, schedule/calendar, bookings, approval/rejection, quota, exception request, check-in/out, no-show.
6. Equipment issue reports, attachments, stop-use locks, repair jobs, return-to-service verification, preventive maintenance/calibration.
7. Safety/SOP documents, instrument training/certification prerequisites, expiry alerts, incident monitoring.
8. Notifications, announcements/alerts, inbox, escalation, dashboard, reports/export CSV, audit logs.
9. Fully responsive UI, Thai-first copy, accessibility, usable empty/error/loading states.
10. Database migrations, seed, setup docs, automated test suite and Playwright E2E.

---

## 2) Tech stack (strict choices)

| Layer | Choice | Rationale |
|---|---|---|
| Monorepo | npm workspaces (`apps/web`, `apps/api`, `packages/shared`) | ทำงานง่ายบน Windows/VS Code |
| Frontend | Vite + React + TypeScript (strict) | ตามข้อกำหนด |
| Routing/data | React Router + TanStack Query | Routing, cache, invalidation |
| UI | Tailwind CSS + shadcn/ui + Radix + Lucide | องค์ประกอบที่ใช้งานได้จริง |
| Form/validation | React Hook Form + Zod | Front/back shared schemas |
| Calendar | FullCalendar OSS หรือ equivalent | Resource booking without premium-only APIs |
| Table | TanStack Table | Filters, pagination, sorting |
| Graph | Recharts | Statistics |
| Backend | Node.js LTS + Fastify + TypeScript | REST API |
| Validation | Zod + documented OpenAPI endpoints | Trust boundaries |
| ORM | Prisma ORM current compatible stable (pin exact versions) | schema/migrations |
| PostgreSQL | official image pinned major (e.g. PostgreSQL 17/18 after checking compatibility) | Docker DB |
| Email local | Mailpit service in Docker | ทดสอบการรับอีเมลโดยไม่ส่งออก |
| Security | Argon2id + cookie session/CSRF + RBAC policy guards | Authentication |
| File storage | Private local filesystem adapter (outside web root) | Uploads/SDS/pictures |
| PDF labels | QR/Barcode/PDF package fit for TS | Print labels |
| Tests | Vitest + Fastify inject + Playwright | Logic/API/E2E |

**Prisma modern setup:** `prisma.config.ts` เก็บ URL ของ CLI; ใช้ `provider = "postgresql"`, Prisma Client generated output, `@prisma/adapter-pg` + `new PrismaClient({ adapter: new PrismaPg({connectionString}) })` ตามเอกสารเวอร์ชันที่ติดตั้ง; ห้ามคัดลอก schema/config รุ่นเก่าแบบผิด major. `package.json` ESM เมื่อเวอร์ชันต้องการ. ตรวจ compatibility Node/Vite/Prisma แล้ว pin release ที่ทดสอบผ่าน (ไม่ใส่ `latest` โดยไม่ lockfile).

---

## 3) Repo/layout/ports and developer experience

```text
lab-management/
├─ apps/
│  ├─ web/
│  │  ├─ src/app/                 # router, providers, auth context, lab context
│  │  ├─ src/components/          # app shell, common UI, smart controls
│  │  ├─ src/features/            # dashboard, chemicals, equipment, ...
│  │  ├─ src/lib/                 # api client, date, units, rbac helpers
│  │  └─ e2e/                     # Playwright
│  └─ api/
│     ├─ src/modules/            # route/service/repository/schemas per module
│     ├─ src/plugins/            # authentication/guards/logger/db
│     ├─ src/jobs/               # alerts, queue, scheduled scans
│     └─ prisma/
│        ├─ schema.prisma
│        ├─ migrations/
│        └─ seed.ts
├─ packages/shared/              # TypeScript models, Zod, statuses, policy constants
├─ infra/                        # safe local setup/README, optional helpers
├─ docs/
│  ├─ DECISIONS.md
│  ├─ API.md
│  ├─ DATA-MODEL.md
│  ├─ SECURITY.md
│  ├─ TEST-PLAN.md
│  ├─ UX-ROUTES.md
│  └─ IMPLEMENTATION-REPORT.md
├─ compose.yaml
├─ .env.example
├─ package.json
└─ README.md
```

**Local defaults:** frontend `http://localhost:5173`, backend `http://localhost:3001`, PostgreSQL exposed on localhost `127.0.0.1:5433` (host alternate port to avoid existing databases), Mailpit UI `http://localhost:8025`. Bind PostgreSQL to loopback only. All ports configurable through env; preflight must detect port conflicts. `docker compose up -d postgres mailpit`, healthcheck `pg_isready`, named volume, no destructive resets. Client Vite `/api` proxy to Fastify in dev. Provide `npm install`, `npm run db:up`, `npm run db:migrate`, `npm run db:seed:dev`, `npm run dev`, `npm test`, `npm run test:e2e`, `npm run lint`, `npm run typecheck`, `npm run build`, `npm run db:backup:local`, `npm run db:restore:isolated` scripts; never use restore against current dev volume by default.

**Environment:** `.env.example` with variable names but no actual credentials; `.env` ignored by git. DB credentials generated locally if missing (document generation), no secret committed. Node startup fails loudly on missing env. `.env.example`: DATABASE_URL, WEB_URL, API_URL, DB_PORT, SMTP_*, SESSION_SECRET, CSRF_*, STORAGE_ROOT, BOOTSTRAP_ADMIN_EMAIL, BOOTSTRAP_ADMIN_PASSWORD (runtime only), DEV_SEED_PASSWORD, TIMEZONE, LINE_CHANNEL_* optional. Avoid placing privileged credentials in frontend `VITE_*`.

---

## 4) UX/UI design system — execute this, do not stop at wireframes

### Brand
- Product: **LabSphere** subtitle **ระบบจัดการห้องปฏิบัติการ**; logo concept: minimal flask + stacked circular orbit/containers; avoid stock images or decorative pictures in data tables.
- Tone: **Enterprise Clean, Modern Research, White/Light theme**. Compact but breathable, readable Thai, serious not playful.
- Colors CSS tokens:
  - `--brand: #0F766E` teal main; hover `#115E59`; light `#E6F6F3`.
  - `--navy: #13263D`; `--bg: #F5F7FA`; `--surface: #FFFFFF`.
  - `--text: #172B3A`; `--muted: #637487`; `--border: #E2E9EF`.
  - `--success: #15803D`; `--warning: #D97706`; `--danger: #DC2626`; `--info: #2563EB`.
  - Ensure WCAG AA text contrast, visual focus state, do not rely on color alone.
- Fonts: Thai `Noto Sans Thai` with system fallback; Latin `Inter` or equivalent; no external-font hard dependency for offline tests.
- Layout: Sidebar desktop 244–256px; collapsible; topbar 64–72px; main max-width 1440px; 24px outer padding desktop, 16px mobile; border radius 10–14px; cards 1px border/very soft shadow; row height at least 44px; clear section headers; spacing system 4/8/12/16/24/32.
- Screen targets: Desktop 1440px, Tablet 768px, Mobile 390px; navigation becomes drawer/bottom quick actions on mobile; table horizontal scroll + filter drawer; no clipped approve dialogs.
- Accessibility: labels, keyboard navigation, visible focus, live region alerts, aria relationships, modal focus trap, input errors explained. Loading skeleton, confirmation dialogs, pagination, empty/error/offline state.

### App shell wireframe (desktop)

```text
┌────────────────────────────────────────────────────────────────────────────────────────────────┐
│ LOGO LabSphere │ ห้องปฏิบัติการ: [เคมีวิเคราะห์ ▾]     [ค้นหา…]      🔔   ผู้ใช้ ▾             │
├────────────────────┬───────────────────────────────────────────────────────────────────────────┤
│ MENU               │  ภาพรวมห้องปฏิบัติการ                       [ช่วงเวลา ▾] [ส่งออกรายงาน] │
│ ■ ภาพรวม           │  คำอธิบายช่วงข้อมูล + บันทึกล่าสุด                                   │
│ □ สารเคมี           │  ┌────────────┐ ┌────────────┐ ┌────────────┐ ┌────────────┐          │
│ □ รับเข้า/เบิก       │  │ ชนิดสาร    │ │ ขวดคงเหลือ │ │ จองวันนี้   │ │ รออนุมัติ   │          │
│ □ เครื่องมือ        │  └────────────┘ └────────────┘ └────────────┘ └────────────┘          │
│ □ ปฏิทินการจอง      │  ┌───────────────────────────┐ ┌──────────────────────────────┐      │
│ □ แจ้งซ่อม          │  │ Chemical stock trend      │ │ งานที่ต้องอนุมัติ  View all │      │
│ □ ความปลอดภัย      │  │ Chart with valid metrics  │ │ request list + quick action │      │
│ □ เอกสาร           │  └───────────────────────────┘ └──────────────────────────────┘      │
│ □ รายงาน           │  ┌────────────────────────────────────────────────────────────┐       │
│ □ สมาชิก           │  │ สารเคมีใกล้หมด / เครื่องมือถูกระงับ / รายการล่าสุด          │       │
│ □ ตั้งค่า          │  └────────────────────────────────────────────────────────────┘       │
└────────────────────┴───────────────────────────────────────────────────────────────────────────┘
```

### Mandatory pages — all actually implemented

| Route pattern | Page and UX requirements |
|---|---|
| `/login`, `/register` | Split clean card, illustrated abstract chemistry geometry, validation, show/hide password, language Thai, links forgot password |
| `/verify-email`, `/forgot-password`, `/reset-password`, `/invite/accept` | Complete token-backed flows, success/error states, resend expiry handling |
| `/select-lab` | Lab cards: name, lab code, building, membership role, status; switch selector in topbar |
| `/app/:labId/dashboard` | Actual KPIs scoped lab, stock warnings, pending actions, equipment status, trend, quick actions |
| `/app/:labId/chemicals` | Search CAS/name, filter hazard/category/location/expiry/low stock, paginated table, multi-select CSV export, add |
| `/app/:labId/chemicals/new`, `/chemicals/:id` | Catalog/detail tabs `Overview / Containers / Stock Movement / SDS / Audit`; forms validation |
| `/app/:labId/containers/:id` | Specific bottle/container, volume/unit, location, QR, opened date, expiry, status, history |
| `/app/:labId/inventory/receive` | Receive lots & containers, barcode, supplier, evidence, inventory ledger |
| `/app/:labId/withdrawals` and `/:id` | Request list/status, request multiple chemicals, approve/reject, dispense actual, requester history |
| `/app/:labId/inventory/stocktakes` | Create count session, count by bottle, variance, approve adjustment, audit |
| `/app/:labId/inventory/transfers` | Transfer between locations and between labs requiring receiver approval; reject/cancel/receive |
| `/app/:labId/inventory/waste` | Expired/damaged/disposed chemicals, quarantine, responsible person, handover documentation |
| `/app/:labId/equipment` and `/:id` | Equipment search/filter, equipment card/detail, serial, asset no., room, service eligibility, QR, SOP/training, status |
| `/app/:labId/bookings/calendar` | Week/month list/calendar, available slots, filters, choose equipment and date/time; no premium component dependency |
| `/app/:labId/bookings/new`, `/bookings`, `/bookings/:id` | Booking form, 3-day quota indicator, submit, admin approval, cancel/reject, check-in/out, no-show, reschedule |
| `/app/:labId/equipment/issues`, `/issues/new`, `/issues/:id` | Report fault, photos, urgency, quarantine equipment; issue timeline/status |
| `/app/:labId/maintenance` and `/:id` | Repair work orders, costs, external vendor, preventive maintenance and calibration due dates, verified return to service |
| `/app/:labId/safety` | Hazard overview, SDS missing/expired, training required/expired, upcoming checks |
| `/app/:labId/documents` | SDS/SOP/manual versions, download/upload access control, metadata |
| `/app/:labId/training` | Member training records, certificate upload, instrument qualification validity |
| `/app/:labId/approvals` | Unified admin inbox: member, chemical, booking, transfer, stock adjustment, exception; batch only safe operations |
| `/app/:labId/members` | Invite, approve, disable, role assignment; searchable table |
| `/app/:labId/reports` | Date range, chemical usage, low stock, near expiry, bookings/utilization, downtime, cost, export CSV |
| `/app/:labId/activity` | Permission-gated audit trail, filters by user/action/entity/date, event detail |
| `/app/:labId/settings` | Lab metadata, policies/quota, alert thresholds, storage hierarchy, notification channels |
| `/notifications`, `/profile`, `/account/security` | Notifications read/unread, profile, change password, sessions, MFA setup |
| `/platform` and child pages | Super Admin overview and lab directory, organizations, global account administration, health/audit reports |
| `/403`, `/404`, `error` | Correct error presentation/no unauthorized data |

### UI control rules
- Sidebar menu is permission-sensitive. Wrong role direct-URL must be denied in **backend** (not only hidden frontend).
- Every table: real API pagination/search/filter/sort; view details; exports only allowed scope; empty states with meaningful actions.
- Every chart: real aggregation; when no events present show empty state; never invent numbers.
- Statuses use chips + icons + text, never color-only. Warning/destructive actions confirm with consequence explanation.
- Actions that can change inventory or bookings must submit to real API and update UI from persisted response; no fake button.
- Keep Thai copy consistent and informative e.g. `ยังไม่มีคำขอ`, `คำขอนี้ถูกอนุมัติโดย...`, `ยอดคงเหลือไม่เพียงพอ`.
- Date display Thai localized 24h, stored UTC timestamps with explicit timezone Asia/Bangkok when applying week/day quota.

### Key interaction flows (must support)
1. `Register → verify email → pending membership → admin approves → login/choose lab`.
2. `Create lab → invite admin/member → accept invitation → assign scoped roles`.
3. `Chemical create → add container/lot → receive stock → request withdraw → approve → reserve → dispense → update ledger/threshold → notify`.
4. `Chemical stocktake → discrepancy → approval → ledger adjustment, never silent overwrite`.
5. `Booking calendar → select valid time → check eligibility/quota → pending → approval/slot conflict recheck → check-in → check-out/history`.
6. `Fault report from QR/booking → equipment blocked → future bookings affected → maintenance work order → testing/verification → available`.
7. `Training cert upload/approve → eligible equipment booking; expire cert → block new approval`.
8. `Cross-lab transfer → source approves/dispatches → recipient accepts → atomic paired ledger + custody history`.

---

## 5) Roles, tenant security, and permissions

**Role scopes**: `PLATFORM_SUPER_ADMIN`, `ORG_ADMIN`, `LAB_ADMIN`, `CHEMICAL_MANAGER`, `EQUIPMENT_MANAGER`, `SAFETY_OFFICER`, `MEMBER`, `VIEWER`. A user may have a set of lab roles, not just one fixed role. `MembershipStatus = INVITED|PENDING|ACTIVE|SUSPENDED|REVOKED`.

| Action | Super/Org admin | Lab Admin | Chemical Manager | Equipment Manager | Safety Officer | Member | Viewer |
|---|---|---|---|---|---|---|---|
| Manage labs/policies | Scope appropriate | Lab | - | - | - | - | - |
| Invite/approve members | ✓ | ✓ lab | - | - | - | - | - |
| Manage chemical catalog/containers | ✓ | ✓ | ✓ | - | read | read | read |
| Receive/dispense chemicals | ✓ | ✓ | ✓ | - | read | request | read |
| Approve chemical withdrawals | ✓ | ✓ | ✓ | - | - | - | - |
| Manage equipment & booking approval | ✓ | ✓ | - | ✓ | read | request | read |
| Fault report | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | read |
| Close repair/return to service | ✓ | ✓ | - | ✓ (verified) | safety signoff if required | - | - |
| Safety, SDS, training validation | ✓ | ✓ | read/upload | read/upload | ✓ | own | read-if-permitted |
| Scoped report | ✓ | ✓ | module scoped | module scoped | safety scoped | own | scoped read |
| Audit log | ✓ | ✓ lab | own module subset | own module subset | safety subset | own actions | - |

**Security invariants**:
- `labId` is an authorization context validated against authenticated membership on **every** query, insert, update, export and file download; no IDOR, no guessing UUID to access another lab.
- `platform` routes require platform role; never grant lab admin to all labs.
- Cross-lab move is separate workflow with explicit authority both source and destination; avoid allowing `PATCH labId` on existing resource.
- Audit entries include actor, effective role, lab, event, before/after redacted where appropriate, IP/request ID/timestamp, no password/token logging.
- First admin bootstrap is a documented one-time environment-driven explicit command; prohibit default `admin/admin` or public seeded admin in production.

---

## 6) Prisma data model contract — implement normalized schema and migrations

Entity names/types can be adjusted for ORM convention, but implement these relations, keys, unique constraints, decimal precision and tenant constraints. All mutable records have `id UUID`, `createdAt`, `updatedAt` and creator where appropriate; soft-delete/archive data with audit where needed.

### Core tenancy/auth
- `Organization(id, code unique, name, status, settingsJson)`.
- `Laboratory(id, organizationId, code scoped-unique, name, building, room, timezone, status, policiesJson)`.
- `User(id, email unique normalized, passwordHash, name, phone optional, status, emailVerifiedAt, lastLoginAt)`.
- `Membership(id, userId, laboratoryId, status, joinedAt, approvedById, approvedAt)` unique `(userId,laboratoryId)`.
- `MembershipRole(id, membershipId, role)` unique `(membershipId,role)`; `PlatformRole(userId,role)`; `Invitation(email,labId,role,tokenHash,expiresAt,status)`.
- `Session(id, userId, tokenHash, expiresAt, revokedAt, userAgent, ip)`; `EmailVerification`, `PasswordReset` hashed one-time tokens and expiration; `TotpCredential` (encrypted secret), `MfaRecoveryCode` (hash).
- `Notification(id,userId,labId nullable,kind,title,body,link,readAt,deliveryState,attempts,createdAt)` and `NotificationOutbox` for reliable fanout/idempotency.

### Chemical inventory
- `Chemical(id, organizationId optional or global template, nameTh, nameEn, casNumber, formula, concentration, purity, physicalState, defaultUnit, hazardClassesJson, ghsPictogramsJson, sdsCurrentId)` — avoid treating CAS as universally unique if formulations differ.
- `ChemicalCatalogEntry(id, laboratoryId, chemicalId, reorderThresholdBaseQty Decimal, reorderUnit, storageGuidance, active)` unique lab + chemical when appropriate.
- `Supplier(id, organizationId, name, contacts)`; `StorageLocation(id, laboratoryId, parentId, code, label, kind, temperatureNotes, hazardNotes)` with hierarchical room/cabinet/shelf.
- `ChemicalContainer(id, laboratoryId, chemicalId, catalogEntryId, code unique globally, supplierId?, lotNumber, manufacturer, receivedAt, openedAt?, expiresAt?, initialQtyBase Decimal, currentQtyBase Decimal or derived ledger with materialized projection, reservedQtyBase Decimal, baseUnit, locationId, status, barcodeValue)`.
- `StockTransaction(id, laboratoryId, chemicalId, containerId?, type RECEIVE|DISPENSE|RETURN|ADJUST_IN|ADJUST_OUT|TRANSFER_OUT|TRANSFER_IN|WASTE, qtyBase Decimal positive, baseUnit, referenceType, referenceId, actorId, reason, createdAt, idempotencyKey unique)` **append only**; compensating reversal rather than editing/deleting.
- `WithdrawalRequest(id, laboratoryId, requesterId, purpose, status, reviewerId?, reviewedAt?, dispensedById?, dispensedAt?, createdAt)` and `WithdrawalItem(id, requestId, chemicalId, containerId?, requestedQtyBase, approvedQtyBase?, dispensedQtyBase?, baseUnit)`; optional split across containers with `DispenseAllocation`.
- `StockReservation(id, withdrawalItemId, containerId, reservedQtyBase, status, expiresAt?)` for approval hold.
- `Stocktake(id, laboratoryId, startedById, status, approvedById?, completedAt)` / `StocktakeLine(containerId, expectedQtyBase, countedQtyBase, varianceQtyBase)` / adjustment refs.
- `StockTransfer(id, sourceLabId, destinationLabId?, sourceLocationId, destinationLocationId?, status, requesterId, sentById?, receivedById?, timestamps)` / lines; explicit acceptance for cross-lab.
- `WasteRecord(id, laboratoryId, containerId?, chemicalId, qtyBase, wasteType, reason, custodianId, destination, documentId?, status, disposedAt?)`.
- `UnitConversion(id, chemicalId? nullable, fromUnit, toBaseFactor Decimal)`; only allow dimension-compatible conversions; when density required, require verified density+temperature; never treat gram and milliliter as equivalent without conversion evidence.

### Equipment/maintenance
- `Equipment(id, laboratoryId, code scoped unique, name, category, model, serialNumber, assetTag, manufacturer, storageLocationId, ownerId?, status, requiresTraining, bookingEnabled, bookableFrom, bookableUntil, safetyClass, description, qrCode, inspectionIntervalDays?, calibrationIntervalDays?, lastServiceAt?, nextServiceAt?, archivedAt?)`.
- `EquipmentAvailabilityBlock(id, equipmentId, labId, startsAt, endsAt, reason, createdById)` for maintenance/unavailable.
- `EquipmentBooking(id, laboratoryId, equipmentId, requesterId, startsAt UTC, endsAt UTC, status, purpose, reviewerId?, reviewedAt?, approvalNote?, requestedAt, exceptionApprovedById?, exceptionReason?)`; cancellation reason, checkin/checkout tracked separately.
- `BookingException(id, laboratoryId, bookingId?, requesterId, reason, status, reviewerId?, grantedDays?)`.
- `EquipmentUsage(id, bookingId unique, laboratoryId, equipmentId, userId, checkedInAt, checkedOutAt?, actualCondition, notes)`.
- `EquipmentIssue(id, laboratoryId, equipmentId, reportedById, bookingId?, title, description, severity, safetyStop Boolean, status, detectedAt, closedAt?)`.
- `MaintenanceWorkOrder(id, laboratoryId, equipmentId, issueId?, type REPAIR|PREVENTIVE|CALIBRATION|INSPECTION, status, assignedToId?, vendorId?, startedAt?, completedAt?, verifiedById?, verifiedAt?, costs Decimal?, resolution, testResult, nextDueAt?)`.
- `TrainingRecord(id, userId, laboratoryId, equipmentId? or equipmentCategoryId?, status, certificateDocId?, trainedAt, validUntil, approvedById?)`.

### Documents/reports/security
- `Document(id, labId, kind SDS|SOP|MANUAL|CERTIFICATE|REPAIR|WASTE|OTHER, title, version, chemicalId?, equipmentId?, storageKey, originalName, mimeType, bytes, checksum, uploadedById, visibility, createdAt)`.
- `AuditLog(id, labId?, organizationId?, actorId, action, entityType, entityId, beforeJson, afterJson, requestId, ip, userAgent, occurredAt)` immutable via service, db-privilege constraints as feasible.
- `LabAnnouncement`, optional `SettingsHistory`, `AlertRule`, `TaskEscalation` for dashboard and notifications.

**Mandatory indexes and constraints**: FKs to lab/entity, composite `(labId, createdAt)`, `(labId,status)`, unique codes per lab; logical foreign key consistency enforced in service transaction; container `currentQtyBase >= 0`, `reservedQtyBase >= 0`, `reserved <= current`, quantities Decimal not float. Use raw SQL migration if Prisma cannot express required PostgreSQL `CHECK`, partial index, or exclusion constraints. Document SQL migrations and rationale.

---

## 7) Critical business invariants (server-side only)

### 7.1 Inventory, approval, ledger
- Available stock = `currentQtyBase - reservedQtyBase` in same *base unit* per container; all quantities Decimal with precision (not JS Float).
- Receive: create eligible container + stock transaction; idempotent request key, transactional; duplicates cannot increase twice.
- Withdrawal submit: may display preliminary availability but no stock mutation yet; request from lab member with purpose and per-item qty; validate SDS/training where required.
- Approval: authorized reviewer chooses approved qty and specific container(s) FEFO (first expiring first out) if safe/appropriate. Atomically verify available qty and reserve with row lock/conditional update. Reject when not enough; reviewer cannot silently exceed requested qty without documented amendment.
- Dispense: actor confirms physically handed over; move reserved into `DISPENSE` ledger and decrement physical count in one transaction. Allow partial dispensing with correct remaining reservations; handle cancellation/release.
- Returned usable chemical: separate validated `RETURN` ledger entry; if contamination uncertain, quarantine/waste instead; never assume all dispensed chemical is returnable.
- Stocktake adjustment: requires `countedQty`, reason, reviewer; full before/after and ledger, cannot simply set balance in unlogged request.
- Expiry/blocked/unusable containers excluded from issuance availability. Warnings threshold based on total eligible availability for chemical in lab.
- Transfers: same-lab location move logs custody; cross-lab moves should be dispatched and accepted as a paired source/destination movement with no double counting; document in-transit states; reject/rollback correctly.
- Disposal: capture hazardous waste tracking and evidence; never turn disposal into an ordinary sale/use.

### 7.2 Bookings, quota & scheduling
- Interval model `[startsAt, endsAt)` for overlapping time slots; no midnight ambiguity. Datetimes stored UTC, UI localized `Asia/Bangkok`. `endsAt > startsAt`; past-time rules configurable.
- Weekly quota = **unique Bangkok local calendar dates touched by pending/approved/in-use bookings** of the **same user and same lab** within ISO-like Monday–Sunday week, maximum 3 by default. Multiple equipment on same date counts only once. Cross-week splits automatically; count each week independently. Cancellation/rejection/completion/no-show policy: pending/approved/in-use block; completed counts actual booked dates; rejected/cancelled do not count; no-show counts unless admin waives with logged reason.
- On submit, count quota under per-user+lab serialization/lock to prevent simultaneous requests bypassing limit; if over, explicit exception workflow. Admin override is recorded and not globally relaxing policy.
- Pending requests do not guarantee equipment slot; on approve, recheck overlap/block/status/training/quota under transaction with equipment-level lock. For approved/in-use use PostgreSQL exclusion constraint or equivalent strong isolation preventing overlap for same equipment in active interval. Document SQL constraint and `btree_gist` if used. No double booking under concurrent approvals.
- Eligibility: active membership, account active/email verified, instrument available, training current when required, booking approval, no maintenance block/closed lab time.
- Check-in allowed only within configured time window for approved booking by authorized user; check-out records actual duration, issue/no-show/report outcome; booking expiry auto-close/escalate as configured.
- A fault with safety stop must immediately mark equipment unavailable and block new approvals; **existing bookings affected are flagged, occupants notified, cancellations/rescheduling require traceable user decision** (not blindly delete records).

### 7.3 Maintenance & safety
- Fault report available from equipment details, booked session, and QR deeplink **after auth**; users cannot forge another lab ID. Attach photo, urgency, timestamp, safety stop.
- Blocked equipment only returns to AVAILABLE after work order completion **and documented verification by authorized person**; if equipment requires calibration, a valid check is required.
- Preventive maintenance schedule/expiry jobs operate per lab; no phantom completion.
- Documents private by default, signed/authenticated download routes, file type/size limits, safe filenames and malware-scan hook (real scanner optional/configurable, no false claims that scan occurred).
- Unsafe storage combinations must **not** be auto-approved merely via simplistic GHS match. Store verified compatibility and show warnings requiring human review against current SDS and lab SOP.

---

## 8) Notifications/events and background jobs

**Events:** MEMBER_REGISTERED, MEMBER_APPROVAL_REQUESTED/APPROVED, WITHDRAWAL_PENDING/APPROVED/REJECTED/DISPENSED, CHEMICAL_LOW_STOCK, CHEMICAL_NEAR_EXPIRY, BOOKING_PENDING/APPROVED/REJECTED/CANCELLED/UPCOMING, QUOTA_EXCEPTION_PENDING/DECIDED, EQUIPMENT_ISSUE_REPORTED, EQUIPMENT_BLOCKED, MAINTENANCE_COMPLETED, CALIBRATION_DUE, TRAINING_EXPIRING, STOCKTAKE_VARIANCE, CROSS_LAB_TRANSFER_PENDING.

- In-app notification center persisted. Email via SMTP transport; in local Mailpit only, not real university addresses.
- Optional LINE OA Messaging API behind `NotificationChannel` interface; disable gracefully if not configured. **Never** use terminated LINE Notify API.
- Outbox pattern/attempt counter/last error/next attempt, idempotent retries, simple queue backed by PostgreSQL allowed for local run (avoid requiring Redis unless justified).
- Scheduler job daily Asia/Bangkok: low stock, expiry, maintenance, training expiry, overdue bookings, stale pending requests; deduplicate alerts per item+threshold/time window; no email storm.
- Every reminder/link resolves to authorized app route.

---

## 9) API specification expectations

REST JSON `/api/v1`. Swagger/OpenAPI at local dev route with authentication explanation. Use consistent response `{data,meta}` and errors `{code,message,details,requestId}`, appropriate 401/403/404/409/422/429. Add pagination, sort whitelist and query filtering; enforce rate limit on auth and sensitive actions.

Required endpoint families (concrete route naming flexible, document in `docs/API.md`):
- `/auth/register`, `/auth/login`, `/auth/logout`, `/auth/me`, `/auth/verify-email`, `/auth/forgot-password`, `/auth/reset-password`, `/auth/mfa/*`, `/sessions`.
- `/organizations`, `/labs`, `/labs/:labId/settings`, `/labs/:labId/members`, `/labs/:labId/invitations`, `/labs/:labId/roles`.
- `/labs/:labId/chemicals`, `/containers`, `/stock/receive`, `/stock/transactions`, `/stocktakes`, `/stock-transfers`, `/waste`.
- `/labs/:labId/withdrawals`, `/:id/approve`, `/:id/reject`, `/:id/dispense`, `/:id/cancel`.
- `/labs/:labId/equipment`, `/availability`, `/bookings`, `/:id/approve`, `/:id/reject`, `/:id/check-in`, `/:id/check-out`, `/:id/cancel`, `/quota/preview`, `/exceptions`.
- `/labs/:labId/issues`, `/maintenance`, `/calibrations`, `/training`, `/documents`, `/approvals`, `/notifications`, `/reports`, `/audit-logs`, `/dashboard`.
- `/platform/labs`, `/platform/users`, `/platform/summary` with platform guard.

**Security:** cookie session HttpOnly+SameSite, secure in production; CSRF on state-changing cookie-auth requests; CORS allowlist, password hashing Argon2id, password reset/invite/verify token hashed at rest, expiry and single-use, no sensitive data leaked by email enumeration, MFA TOTP/recovery for administrators, authorizer on every route + resource-level checks. Input validation and output shaping to prevent leaking hashes/tokens. Proper logout/invalidate sessions. Audit role/permission changes.

---

## 10) Dashboard/reporting/KPIs

Scoped dashboards by Lab and Platform. Default KPI widgets:
- Number of chemical catalog entries, eligible containers, low stock, expiring within 30 days, quarantined/waste pending.
- Equipment total, available, in use, booked, blocked, overdue maintenance/calibration.
- Pending chemical withdrawal approvals, booking approvals, membership/transfer/exception approvals.
- 7/30/90-day stock use trend; equipment utilization = booked or actual used hours / configurable available hours; show formula and data range.
- Time-to-approve, issue count, average downtime, overdue work orders, active members.
- Export CSV UTF-8 BOM if Excel Thai compatibility helps; prevent CSV formula injection; downloadable reports filtered to scope.
- Every KPI backed by a tested API aggregation, not static seed numbers in source code. Seed is allowed for demo only.

---

## 11) Seed and security of local demo

- Create 1 demo organization with **3 separate laboratories**: ห้องเคมีวิเคราะห์, ห้องวิจัยชีวภาพ, ห้องวัสดุศาสตร์ — 3 labs prove multi-tenancy.
- Dev seed creates distinct roles/users, chemicals/containers/lots, at least 10 pieces equipment per demo environment in aggregate, bookings, alerts, faults, repairs, training, SDS examples clearly labeled fictional, audit snapshots. Seed reproducible/idempotent; no duplicated rows on rerun.
- Password for demo/test accounts must be provided through local `DEV_SEED_PASSWORD` from `.env`; do not commit a known credential. Seeded accounts disabled unless dev explicit seed command.
- Production/normal startup never auto seeds fake members or admin accounts. One-time `bootstrap-admin` command requires explicit environment credentials and checks no bootstrap already exists.
- README explains exactly where to see local Mailpit emails, how to register and approve members, and how to run tests.

---

## 12) Testing matrix — automated + manual acceptance

Implement meaningful test cases, not tautological asserts or snapshots alone.

### Unit/service tests
- Conversion: compatible units, decimals, invalid dimension rejected; amount precision, FEFO handling.
- Inventory: receive→reserve→dispense→ledger reconciliation; approval/dispense separated; double approval/dispense idempotent; insufficient and concurrent dispense blocked; stocktake variance approvals; expired quarantine; inter-lab transfer custody.
- Booking: duplicate/overlapping approvals blocked, boundary times allowed, 3 distinct days weekly, 2 machines same day = 1 quota day, cross-week split, Bangkok timezone DST-safe generic date handling, parallel requests locked, exceptions logged; rejected/cancelled releases; no-show policy.
- Fault: stop-use sets blocked, approval denied, future bookings flagged, repair finish alone cannot unblock, verified release required.
- Account: email verify, activation, invitation, recovery, role guard, multi-lab membership, MFA flows.

### API/authorization tests
- User A of Lab1 may not read/edit/export Lab2 resource by guessing UUID; lab admin cannot access platform routes; suspended member cannot book; resource/role validation.
- Auth rate limiting, token expiry, CSRF, upload validation, pagination sanitization, no secrets in response, audit after privileged actions.
- REST success and error codes including 409 conflicts, transaction rollback, idempotency.

### Browser Playwright smoke/e2e
- Desktop 1440x900 / tablet 768x1024 / mobile 390x844.
- Login/register/verify via Mailpit or seeded verified dev fixture; lab switcher isolation.
- Create chemical, receive two lots, search/filter, request withdrawal, approve, dispense, watch balance update, print QR.
- Create equipment, book allowed, reject double-book, reject >3 distinct days/week, approve via admin, check-in/out.
- Report broken equipment, block calendar, repair, verify, return to available.
- Check low stock/expiry notifications, role-based menu guards, CSV export, audit, profile/MFA.
- No unexpected console errors, no broken links, empty states and forms accessible.

### Commands / gates (adapt actual package manager)

```bash
npm install
npm run db:up
npm run db:migrate
npm run db:seed:dev
npm run lint
npm run typecheck
npm run test
npm run build
npm run test:e2e
npm run dev
```

`npm run dev` is a long-running process: Codex may start it to verify health/smoke and then terminate or leave running as appropriate; document URLs and actual state. If Docker/Playwright browser unavailable, do not forge PASS. Prefer installing missing local test browser dependencies only if permitted and safe; record blockers otherwise.

### Definition of DONE

- [ ] All listed screens are implemented, navigable, with real API wiring (no dummy action buttons).
- [ ] Multi-lab isolation is demonstrated using users of at least three labs.
- [ ] PostgreSQL in local Docker with named volume, health check, Prisma migrate/seed work.
- [ ] Registration/email verification/member approval, login/session/password reset, RBAC and admin MFA.
- [ ] Chem receiving, stock transactions/approvals/dispensing and low-stock alerts work with atomic ledger.
- [ ] Booking calendar, approval, quota 3 dates/week, cross-week, concurrency protection, check-in/out.
- [ ] Equipment fault/maintenance/verification returns to service correctly; reminders.
- [ ] SDS/docs/training/quarantine/expiry/waste modules actually persisted and authorized.
- [ ] Reports/exports/audit, in-app/email local notifications, QR labels work.
- [ ] Desktop/tablet/mobile tested; validation/loading/empty/error states implemented.
- [ ] `lint`, `typecheck`, tests, build, E2E run; failing tests fixed or transparently listed.
- [ ] README, docs/API.md, docs/DATA-MODEL.md, docs/SECURITY.md, docs/IMPLEMENTATION-REPORT.md produced.

---

## 13) Operational safety boundaries and acceptance reporting

- **Local only**. No use of remote `research-app`/`research-db` or other real host, no connecting university PostgreSQL, no migration to existing DB, no production SMTP credentials, no public exposure. No auto-deployment.
- Never delete user data/DB volume, reinitialize existing DB, rotate prod secret, disable firewalls or modify OS security settings. For port conflicts use configurables, log impact.
- Git commits optional only if requested by user; **do not push**. Do not claim code is production-ready merely because tests pass; this is full-feature local implementation requiring real security review, EHS validation, backup/restore and pilot UAT before production.
- If a major environmental blocker exists, complete unaffected modules, record exact missing prerequisites, commands attempted, test gaps, and no invented output.
- Technical report: code tree summary; Prisma migration/version; seeded data list; routes/screens completed; tests actual PASS/FAIL/SKIP counts; screenshots optional; critical safety/security findings; steps to start; known limitations; next operational validation. Distinguish `IMPLEMENTED`, `VERIFIED`, `NOT_RUN`, `BLOCKED`.

---

## 14) Source notes and clarification of design assumptions

Requirements originated from user-provided Gemini conversation transcript: email/password registration and admin approval, multiple admins, chemical list/receive/dispense/low stock alerts, instrument booking requiring approval, maximum 3 days per week, issue reporting and repair return-to-service, real database/auth, QR and audit, notifications. The expanded multi-lab platform architecture, organization boundary, training, detailed data model, storage rules, extra reports, calibration/waste and UI system are **design proposals** to meet the latest request for a large multi-laboratory system. Default quotas and multi-lab transfer semantics are proposed implementation policy, editable in Lab Settings.

External docs to consult when implementing:
- Vite: https://vite.dev/guide/
- Prisma PostgreSQL adapter & configuration: https://www.prisma.io/docs/orm/v7/core-concepts/supported-databases/postgresql
- Prisma driver adapters: https://www.prisma.io/docs/orm/v7/core-concepts/supported-databases/database-drivers
- LINE Notify sunset / Messaging API alternative: https://developers.line.biz/en/news/2025/04/01/line-notify/

**Priority:** Correct transactional behavior + authorization + safety boundaries before decorative UI and charts. **Do all modules in this single autonomous coding task**, but never suppress gaps or falsely mark work complete.
