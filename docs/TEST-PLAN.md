# Verification profile

Authority: AGENTS.md; complete 2026-10-25 Master Build Specification; local-only user build instruction.

- Focused: TypeScript strict, ESLint, exact quantity and Bangkok calendar-date tests, Fastify inject against real PostgreSQL `labsphere_test`.
- Candidate: `npm run lint`, `npm run typecheck`, `npm test`, `npm run build`, `npm run test:e2e`.
- Runtime: local API health, SMTP Mailpit outbox, browser flows at 1440×900, 768×1024, 390×844. Tests generate separate synthetic records; they never truncate or reset the development volume.
- Test DB preparation (one time): `docker compose exec -T postgres createdb -U labsphere labsphere_test`. Use the same URL with pathname `/labsphere_test` for `prisma migrate deploy`. `npm test` and Playwright select that database automatically.
- External boundary: no public deployment, remote services, real email recipients, push or production migrations.
- Evidence: `docs/evidence/vitest.json`, `docs/evidence/playwright.json`, viewport PNGs and implementation report. Test reports are overwritten by fresh runs, not interpreted as historic passes.
- Invalidate candidate after code, authority, Compose, entrypoint, migrations, scripts or dependency changes; rerun relevant checks before any final claim.
