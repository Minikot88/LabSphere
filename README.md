# LabSphere — Laboratory Management Platform

Local multi-laboratory resource management. Thai UI, White/Teal/Navy design, React + Vite + TypeScript + Tailwind + shadcn-style Radix components; Fastify + Prisma 7.10.1 + PostgreSQL 17.

## Start on Windows / Node 24

```powershell
npm install
npm run setup:local
npm run db:up
npm run db:generate
npm run db:migrate
npm run db:seed:dev
npm run dev
```

- App: http://localhost:5173
- API: http://localhost:3001/api/v1/health
- Swagger: http://localhost:3001/api/docs
- Mailpit: http://localhost:8025 (SMTP 127.0.0.1:1025; never real SMTP)
- PostgreSQL: 127.0.0.1:5433, database `labsphere`, named Compose volume `labsphere-local_labsphere_pg`.

`setup:local` generates random DB/session/demo secrets into ignored `.env` and never overwrites an existing file. Read `DEV_SEED_PASSWORD` there to sign in. Do not share or commit that file. Example emails: `member.chem@labsphere.test`, `admin.chem@labsphere.test`, `chemical.chem@labsphere.test`, `equipment.chem@labsphere.test`, `safety.chem@labsphere.test`, `viewer.chem@labsphere.test`; substitute `bio` / `mat` for other labs. `platform@labsphere.test` has platform authority. Seed is explicit, idempotent, synthetic and prohibited in production; ordinary startup never seeds.

Register → open verification link in Mailpit → verify → lab admin approves membership in Members → choose lab. Password recovery, invitations and event emails are also in Mailpit. The outbox is processed every 10 seconds with bounded retry backoff. Daily alerts are deduplicated by Bangkok calendar day.

For a clean installation without demo, set `BOOTSTRAP_ADMIN_EMAIL` and `BOOTSTRAP_ADMIN_PASSWORD` in local environment, then run `npm run bootstrap-admin` once. Existing platform administrator prevents another bootstrap. Administrators must enroll TOTP under Account Security before privileged actions; recovery codes appear once. Existing pre-enrollment sessions are revoked.

## Workflows

1. Create chemical; receive two bottles/lots. Withdraw as member, approve as chemical manager, then separately dispense. Approval reserves stock; it does not decrement physical balance. Partial dispense and cancellation are supported.
2. Stocktake records expected/count differences; approval creates adjustment ledger. Transfers dispatch from source and require destination acceptance. Rejected in-transit transfers require source receipt of the return. Waste is quarantined before documented disposal.
3. Create equipment; book a future interval; approve. Quota counts unique Bangkok dates Monday–Sunday per user/lab, including pending requests, default three days. Ask for a weekly exception when needed. Check-in is within 30 minutes before start until end; check-out records actual use.
4. Safety-stop issue immediately blocks equipment and flags affected bookings. Create repair work, complete it, then verify with a documented test result before service resumes.
5. Upload private SDS/SOP/certificates, approve training, inspect safety, reports/CSV, notifications and audit. File allowlist: PDF, PNG, JPEG, text, 10 MB. Malware scan is explicitly NOT_SCANNED, not represented as safe.

## Checks

```powershell
docker compose exec -T postgres createdb -U labsphere labsphere_test
# Test scripts apply migrations only to the isolated labsphere_test database.
npm run lint
npm run typecheck
npm test
npm run build
npx playwright install chromium
npm run test:e2e
```

Tests require an existing local `labsphere_test` database; test scripts deploy its migrations before running. Run `npm test` before the complete screen suite: integration tests supply histories for every detail-route family. Playwright starts its own API/web on 23002/25174 and runs three viewports. See docs/TEST-PLAN.md, docs/LABSPHERE-GAP-ANALYSIS.md and docs/LABSPHERE-COMPLETE-IMPLEMENTATION-REPORT.md for evidence. Unit tests alone: `npm run test:unit`.

One-time isolated test migration in PowerShell (do not print the URL):

```powershell
$taskDatabaseUrl = (Get-Content .env | Where-Object { $_ -like 'DATABASE_URL=*' }).Substring(13)
$env:DATABASE_URL = $taskDatabaseUrl -replace '/labsphere$', '/labsphere_test'
npm run db:migrate
Remove-Item Env:DATABASE_URL
```

`test:e2e` first builds both applications, then runs the native compiled API and Vite preview. This also verifies the generated Prisma ESM runtime rather than relying only on the development TypeScript runner.

Backup: `npm run db:backup:local`; restore: `npm run db:restore:isolated -- .local/backups/<file>.dump`. Restore always creates a new database name and never overwrites `labsphere`. To stop just this project's services use `docker compose stop`. Do not delete named volumes for routine setup.

No production deployment, git push, remote DB or public exposure is part of this implementation. Local guard rejects non-loopback DB/SMTP and databases other than `labsphere` / `labsphere_test`. Production needs a separate deployment and security/EHS/UAT review.

## Complete design integration

All 51 reference screens map to application routes. `/screens` lists pages allowed by the account. Details show scoped reference names, documents, bookings, training, actual usage, work orders and audit timelines. Equipment supports cards/table, the weekly calendar shows hourly slots, and booking forms preview candidate quota and confirmed conflicts. Platform pages include lab lifecycle management and measured PostgreSQL/storage/SMTP health at `/platform/health` (Super Admin + MFA).

New documents default to PRIVATE; select LAB deliberately for shared SDS/SOP. Issue forms accept PNG/JPEG evidence explicitly shared within the lab. Migration 006 preserves existing document visibility. Container custody moves preserve quantities and append audit; quantity transfers retain paired ledger movements. Account forms include password confirmation and an Authenticator enrollment QR.

Browser test accounts are unique per run in `labsphere_test`. Traces are disabled to avoid retaining passwords/MFA codes. Synthetic screenshots and route evidence cover 1440×900, 768×1024 and 390×844. Run `node scripts/audit-design.mjs` to extract all 51 reference contracts headlessly without opening a window.

Final verification evidence: docs/LABSPHERE-COMPLETE-IMPLEMENTATION-REPORT.md and docs/evidence/playwright-final-verified.json. Reference selectors/calendar follow API pagination, and equipment-to-booking preselection waits for options. Audit supports actor/date filters and atomic invitation-acceptance records. Tests use real local PostgreSQL and synthetic data only.
