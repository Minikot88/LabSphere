# Local security contract

- Every lab list/detail/write/report/download checks authenticated account, lab status and active membership. UUID possession is not authorization. Platform and organization authority are separate. Viewers cannot mutate; module managers are scoped. Session revocation and account suspension take immediate effect.
- Argon2id password hashes, normalized email, HttpOnly cookie, SameSite=Lax, production Secure flag, CSRF token and Origin checking, CORS allowlist, helmet, bounded request/upload size and auth throttling. No credentials in frontend VITE variables or localStorage.
- Verification/reset/invitation tokens: random, hash at rest, expiry, serialized single use. Recovery avoids account enumeration. Password reset invalidates sessions. Existing-account invitation requires login as that account.
- TOTP secret encrypted at rest, bounded clock tolerance, last counter prevents replay, one-use recovery hashes. Enroll via Account Security; never commit authenticators or test credentials.
- Decimal inventory, FEFO eligibility, transaction locks, append-only ledger/audit, stock constraints. Quota serialized per user+lab, approved slot overlap protected by PostgreSQL exclusion. Safety-stop blocks approvals and flags rather than deletes existing bookings.
- Files stored with random key outside web root; authenticated download, visibility, allowlisted MIME/signature, safe filename, size limit. Scan status remains NOT_SCANNED; a real malware scanner is optional and is not installed or claimed.
- SMTP only loopback Mailpit; LINE transport disabled. Daily deduplication prevents repeated same-item/day alerts. Outbox retry is at-least-once; SMTP acknowledgement loss may deliver a duplicate despite database dedupe.
- No remote DB, production SMTP, deployment, push, firewall changes or unrelated container changes. Random `.env` is ignored. Backup restores into a newly created isolated local DB only.

Production requires independent security review, TLS/session secret management, least-privilege runtime DB role, audited retention/backups/restore, actual document scanning, EHS validation and pilot UAT. Local test results are not a production certification.

## Design integration verification

New upload defaults are PRIVATE at API and database level; migration 006 changes future defaults without rewriting existing records. Private SDS uploaded by another account cannot satisfy a recipient prerequisite unless the recipient can read it. Shared lab safety overview tracks LAB-visible SDS. Issue-photo sharing is explicit in the form label. Public booking slots expose time/status/equipment, without requester private purpose or audit history.

Context APIs first invoke the same scoped detail authorization as the resource, then resolve references from authorized identifiers. Timelines return action/time/actor name, not before/after payloads. String request/semantic entity references are never cast to UUID for name lookup. Platform lifecycle/health require Super Admin and MFA proof on that session. Profile, organization creation and custody moves append audit.

Browser evidence uses synthetic records, per-run isolated test users, disabled traces and no credentials in reports. Expected negative 401/403/409 and injected offline failures are distinguished from unexpected browser/API errors. The development database, named Docker volume and existing balances are preserved. This is local validation, not independent penetration testing or a production readiness certificate.
