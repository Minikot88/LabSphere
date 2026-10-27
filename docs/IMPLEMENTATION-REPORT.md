# LabSphere Local Implementation Report

Date: 2026-10-25, Asia/Bangkok. Scope: the supplied Master Build Specification and design HTML, local implementation and verification only.

## Delivery and environment

The starting directory contained the secretary capsule, AGENTS.md, the master specification and HTML design reference. There was no application or Git repository. Those supplied files were preserved. No Git initialization, commit, push, production deployment, remote database, real SMTP, unrelated container or OS security change was performed.

Implemented npm workspaces: `apps/web`, `apps/api`, `packages/shared`; local Compose PostgreSQL/Mailpit; five SQL migrations; explicit seed/bootstrap/backup/isolated-restore commands; private file storage; tests and documentation. Node 24.18.0, Vite 8.3.5, React 19.2.0, TypeScript 5.9.3, Tailwind 4.3.3, Fastify 5.12.7, Prisma/adapter 7.10.1, PostgreSQL 17.7. Direct dependencies and lockfile are pinned.

Current local services:

- Frontend http://localhost:5173
- API http://localhost:3001/api/v1/health
- Swagger http://localhost:3001/api/docs
- Mailpit http://localhost:8025
- PostgreSQL 127.0.0.1:5433, database `labsphere`, project-specific named volume.

The dev API/web remain running. Playwright uses separate compiled artifacts, database `labsphere_test`, API 23002 and web 25174, and shuts its test servers down. The earlier 5174 test port was occupied by another project's widget during work; that process was identified and left untouched.

## Modules and proof

| Area | Implemented behavior | Verification |
|---|---|---|
| Account | Register, email verify/resend, recovery/reset, invitations, profile, password change, sessions, TOTP/recovery | PostgreSQL API tests, browser MFA, separate invitation workflow |
| Tenancy/RBAC | Organization/lab directory, creation, scoped memberships/role sets, switcher, suspension, platform guard, lab policies | Three-lab positive/negative access checks, IDOR/export/file tests |
| Chemicals | Catalog/detail/edit/archive, CAS/formulation/hazards, eligible stock, search and hazard/location/expiry/low-stock filters, selected CSV | API stock-filter/export tests; browser create/edit/search |
| Containers | Lots, suppliers, locations, exact balances, expiry/quarantine, opened date, authenticated QR | Receive/idempotency/expiry tests; browser two lots and QR |
| Withdrawals | Multi-item request, FEFO reservation, approved quantities, partial dispense, cancellation/release, returns | Exact Decimal reconciliation, concurrent approval, idempotency and eligibility regressions; browser full flow |
| Stock control | Count/variance approval, stale-count rejection, paired transfers/in-transit custody, hazardous waste disposal | Real PostgreSQL integration tests and immutable ledger checks |
| Equipment | Registry, eligibility/training/calibration, booking enablement, QR, issue deeplinks | API and browser registry/QR/fault workflows |
| Booking | Month/week calendar and list, pending/approval, serialized quota, exceptions, half-open overlap, reschedule/cancel, no-show/waiver, actual use | API concurrency/exclusion/timezone tests; browser double-book and fourth-day rejection, check-in/out |
| Repair/calibration | Safety stop, affected bookings retained, work orders, costs, documented completion/verification, multi-job release, calibration expiry, optional safety signoff | Regression tests and browser repair/return-to-service |
| Safety | SDS eligibility, training validity, quarantine, human compatibility reviews against SDS/SOP | API prerequisite/revocation/signoff/storage-review tests |
| Documents | Private local files, versions/metadata, MIME/signature/size checks, authorized downloads | Unsafe upload/foreign ID tests; real browser upload/download |
| Notifications | Persisted in-app center, read state, membership/workflow events, Mailpit outbox/backoff, per-lab email preference, deduplicated scheduled alerts | SMTP delivery and scheduler dedupe tests; in-app routes |
| Reporting | 7/30/90-day KPIs, real stock trend, approval/downtime/use metrics, costs, date-filtered reports, CSV formula protection | API aggregation/CSV tests; browser exports |
| Audit | Actor/roles/request/IP/before/after, module/own visibility, immutable SQL trigger, UI event detail | Privileged action and tamper tests; browser detail inspection |
| Administration | Member invitation/approval/roles, lab settings/opening hours/thresholds, storage hierarchy/suppliers, announcements, platform users/labs/orgs | API guards, invitation proof, UI route smoke |

UI uses the supplied White/Teal/Navy design, Thai/system fonts, desktop sidebar/mobile drawer, responsive cards, scrollable tables/calendar, labelled inputs, focus-trapped dialogs, explicit confirmations, loading/error/empty states. Data and actions use API/PostgreSQL; there is no localStorage database or source-coded fake KPI count.

## Database and local fixtures

Migrations:

1. `202610250001_initial` — normalized tables, Decimal quantities and indexes.
2. `202610250002_invariants` — non-negative/reservation checks, lab/entity FKs, btree_gist slot exclusion, immutable ledger/audit triggers.
3. `202610250003_reference_integrity` — actor/reference FKs, training/count constraints.
4. `202610250004_session_assurance` — per-session MFA verification proof.
5. `202610250005_safety_review` — human storage review and optional safety release signoff.

All five migrated successfully on local dev and isolated test databases. Prisma uses TypeScript ESM generated imports and TypeScript extension rewriting; native compiled Node startup is tested, in addition to tsx development startup.

Development seed: 1 organization; 3 separate labs (ห้องเคมีวิเคราะห์, ห้องวิจัยชีวภาพ, ห้องวัสดุศาสตร์); 19 users with distinct scoped roles; 9 chemicals; 18 containers; 12 instruments; 12 training records; 9 clearly fictional SDS; 3 bookings, issues, work orders and demo alerts. Running the seed twice again preserved all entity counts (`seed-idempotency.json`). Password is generated into ignored `.env` as DEV_SEED_PASSWORD, never committed or printed in the report. Normal startup never seeds.

Fresh `pg_dump` backup and isolated restore passed. The final restore created `labsphere_restore_1792916391307`; it did not overwrite the development database. Backup is private at `.local/backups/labsphere-2026-10-25T08-19-00-868Z.dump`.

## Actual checks

| Check | Actual result | Evidence |
|---|---|---|
| TypeScript strict | PASS | `npm run typecheck` |
| ESLint | PASS, no warnings | `npm run lint` |
| Unit | 7 PASS | `docs/evidence/vitest.json` |
| PostgreSQL API/integration | 31 PASS, 0 failed | `docs/evidence/vitest.json` |
| Build | PASS, web + API | `npm run build` (also invoked by E2E) |
| Playwright | 3 PASS, 0 failed/skipped/flaky; all three viewports | `docs/evidence/playwright.json` |
| Additional invitation and all-three-lab workflows | 16 checks PASS | `docs/evidence/manual-workflows.json` |
| Seed idempotency | PASS | `docs/evidence/seed-idempotency.json` |
| Backup / isolated restore | PASS | Commands and isolated target above |
| Runtime dependency audit | 0 known vulnerabilities in actual audit | `docs/evidence/npm-audit.json` |
| Local health | Web 200, API PostgreSQL OK; Compose services healthy | Final health receipt |

Browser targets: 1440×900, 768×1024, 390×844. Each scenario executes MFA enrollment; chemical creation/edit/search; two lot receipts; withdrawal approval/dispense and balance; equipment/QR; booking approval; safety-stop/repair/verification; document upload/download; all main routes; CSV; lab switching; double-booking denial; fourth unique-day quota denial; real check-in/out; weekly calendar and mobile navigation. Screenshots are saved without opening any preview UI.

## Review findings and corrections

Three bounded read-only Vera review calls were used (cap 3), with durable reservations and SHA256 manifests. The final core review accepted `protected-review-3`, limited to six auth/inventory/booking/maintenance/safety source files. The final UI controls received parent verification; they were not an independent full UI security review.

Fixed and regression-tested: admin manager-helper MFA bypass; stale pre-enrollment session privilege; missing safety/recipient checks between approval and dispense; multi-work-order verification deadlock; zero-minute check-in default; calibration expiry lost while other work remains; expired calibration override accepted against a valid prior date. Native Node ESM startup, React workspace duplication and endpoint rate-limit interference discovered during runtime testing were also corrected.

## Limitations and next validation

- This evidence proves the recorded local workflows and test matrix, not every possible input, failure mode, accessibility criterion or production operating condition. Real-user pilot UAT and EHS/SDS validation remain required before real laboratory use.
- LINE/OIDC are provider boundaries only and remain disabled. No external identities, university services or real SMTP were connected. Files explicitly remain NOT_SCANNED; a real malware scanner is not installed or claimed.
- The local database owner is the migration/runtime account. SQL triggers protect ordinary writes; future production needs separate least-privilege roles and secret management.
- The current web bundle triggers Vite's >500 KB warning (about 888 KB minified / 267 KB gzip). Build succeeds; further code splitting and performance/load testing are not claimed.
- Outbox SMTP delivery is at-least-once; acknowledgement loss can produce a duplicate. No false exactly-once email guarantee is made.

Next action: log in locally, enroll MFA for an administrator, and run pilot acceptance with laboratory owners. No production deployment or remote action is pending approval.

## Final receipt

WORK_STATUS: PASS for the implemented local platform and recorded acceptance workflows.

INDEPENDENT_REVIEW: protected-review-3 accept for six core sources; their hashes remain unchanged. Final UI controls are parent verified.

VERIFICATION: 38/38 Vitest tests, 3/3 expanded Playwright viewport scenarios, 16 additional manual API workflow checks, lint/typecheck/build, seed idempotency, backup/isolated restore, runtime dependency audit (0 known findings), local web/API/Mailpit health all passed. No environment blocker remains. Evidence is saved under docs/evidence. No claim of exhaustive or production certification is made.

LOCAL_STATE: dev servers remain available on 5173/3001; PostgreSQL and Mailpit remain healthy. No remote or production system was modified.
