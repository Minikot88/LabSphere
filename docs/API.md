# API contract

REST `/api/v1`, Swagger `/api/docs` and `/api/docs/json`. Success `{data, meta}`, errors `{code,message,details?,requestId}`. IDs are UUIDs. Amounts use decimal strings (up to 6 places). UTC ISO timestamps; UI shows Asia/Bangkok.

Cookie authentication: login sets an HttpOnly SameSite=Lax session cookie and returns csrfToken. On reload GET `/auth/csrf`; send `x-csrf-token` on every authenticated POST/PATCH/DELETE. Session tokens and CSRF hashes persist server-side. Expired/revoked sessions fail 401. Input 422, scope 403 or resource 404, state/conflict 409, rate 429. No hashes or secrets in user responses.

## Account / platform

- POST `/auth/register`, `/auth/verify-email`, `/auth/resend-verification`, `/auth/forgot-password`, `/auth/reset-password`, `/auth/login`, `/auth/logout`, `/auth/change-password`.
- GET `/auth/labs` (public enrollment directory), `/auth/me`, `/auth/csrf`, `/labs`, `/sessions`, `/notifications`; PATCH `/profile`; DELETE `/sessions/:id`; POST `/notifications/:id/read`.
- POST `/auth/mfa/setup`, `/auth/mfa/confirm`, `/auth/mfa/disable`; TOTP SHA1/6-digit/30-sec, bounded clock window and counter replay protection; hashed one-use recovery codes.
- POST `/invite/accept`; existing accounts must authenticate as the invited email. POST `/labs/:labId/invitations` by lab admin.
- GET/POST `/organizations`, POST `/labs` require platform guard. GET `/platform/summary|labs|users|organizations|audit`, PATCH `/platform/users/:id`.

## Lab context (`/labs/:labId`)

All requests validate active lab/account and active membership, or scoped organization/platform authority. `labId` is never accepted as a mutable body field.

- GET lists and GET `/:id`: chemicals, containers, withdrawals, stocktakes, stock-transfers, waste, equipment, bookings, exceptions, issues, maintenance, calibrations, training, documents.
- GET `stock/transactions`, members, locations, suppliers, announcements, audit-logs. Lists accept page/pageSize (max 100), search/status and allowed sort. Module-specific filters are documented in route implementations (chemicalId/locationId/expiryDays; equipmentId/from/to).
- POST chemicals/equipment; PATCH chemicals/:id, equipment/:id. Catalog write guards: Chemical Manager / Equipment Manager respectively, with Lab Admin override.
- POST stock/receive: chemicalId, code, lotNumber, qty, unit, reason, idempotencyKey; optional expiry/location/supplier. POST stock/return references a DISPENSE transaction with qty/usable/reason/idempotencyKey.
- POST withdrawals: purpose + items[{chemicalId,qty,unit}]. POST withdrawals/:id/approve|reject|dispense|cancel. Approve optionally narrows per-item quantities. Dispense requires idempotencyKey and optionally items[{itemId,qty}].
- POST stocktakes: reason + lines[{containerId,countedQty}]; POST :id/approve. Stale expected balance rejects rather than overwriting concurrent movement.
- POST stock-transfers: containerId,destinationLabId,qty,reason,destinationLocationId?; POST :id/dispatch|receive|reject|return|cancel. Source and receiver permissions are enforced independently.
- POST waste: containerId,qty,wasteType,reason,destination,documentId?; POST :id/dispose. POST containers/:id/status requires reason.
- POST bookings: equipmentId,startsAt,endsAt,purpose. POST :id/approve|reject|cancel|reschedule|check-in|check-out|no-show|waive-no-show. GET quota/preview, availability; POST availability creates authorized maintenance block. POST exceptions and :id/approve|reject.
- POST issues; POST maintenance; POST maintenance/:id/complete|verify. Calibration uses work type CALIBRATION. POST training and :id/approve|revoke.
- POST documents: multipart metadata fields first, file last. GET documents/:id/download enforces lab and visibility. GET qr/equipment/:id or qr/containers/:id produces authenticated SVG QR.
- GET dashboard, safety, approvals, settings, roles; PATCH settings. POST locations, suppliers, announcements. PATCH members/:id status/roles/reason.
- GET reports?kind=stock|chemical-usage|bookings|downtime|costs&from=ISO&to=ISO&format=json|csv. CSV escapes values and neutralizes formula prefixes; scope and roles are enforced server-side.

Service source files contain full request schemas. Multi-step effects and audit/outbox records commit in the same transaction. PostgreSQL constraints and advisory locks provide race protection; a 409 means refresh and resolve the business conflict.

Additional lab routes: GET/POST `/storage-compatibility`, GET `/storage-compatibility/:id`; POST `/maintenance/:id/safety-signoff`; GET `/transfer-destinations` (same organization directory, Chemical Manager guard); GET `/stock/return` and `/:id` for return history. Reports also accept `kind=catalog&ids=<comma-separated UUIDs>` for selected catalog exports. Dashboard accepts `days=7|30|90`; settings include opening hours/days, alert thresholds and email preference. Administrator mutations require MFA assurance on the current session; enrollment revokes other sessions.

## 51-screen integration additions

- GET /labs/:labId/records/:kind/:id/context: authorized reference labels, related rows and payload-free audit timeline. A public booking slot omits private history. Document rows omit storage keys and honor visibility. Related operational histories return the latest 100 rows; use paginated list APIs for longer histories.
- POST /labs/:labId/containers/:id/move: whole-container custody change, same-lab location validation, inventory lock and immutable audit. Quantity and stock ledger remain unchanged.
- GET/PATCH /platform/labs/:id: Super Admin + session MFA, actual organization/resource counts, audited archive/reactivate and metadata update.
- GET /platform/health: measured PostgreSQL query, private-storage access check, local SMTP handshake, outbox totals and applied migrations. No secrets, connection strings or host storage paths returned.
- POST /notifications/read-all and GET /notifications?unread=true: own-account scope.
- Integer page/pageSize validation, actual search on operational and administrative lists; reference names are resolved only from authorized rows and UUID-valued references.
- Uploads default PRIVATE. An issue photo explicitly shared in its form is uploaded as LAB evidence before linking to the issue. Mandatory SDS is revalidated for the recipient's readable documents at request, approval and dispense.

Final audit/large-reference behavior: INVITE_ACCEPT records membership status/roles atomically with token consumption; actor/date filters enforce member/lab/module scope. Calendar and form reference selectors follow all API pages; controlled selects preserve equipment deep-link values when options arrive asynchronously. Latest E2E verification is docs/evidence/playwright-final-verified.json, which links preserved raw screen results and the passing workflow reruns.
