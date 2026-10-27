# UI routes

Public: login, register, verify-email, forgot-password, reset-password, invite/accept. Authenticated: select-lab, profile, account/security, notifications. Platform: overview, labs, users, organizations, audit.

Lab prefix `/app/:labId/`: dashboard, chemicals/new/detail; containers/detail; inventory/receive, inventory/returns, inventory/transactions, inventory/stocktakes/new/detail, inventory/transfers/new/detail, inventory/waste/new/detail; withdrawals/new/detail; equipment/new/detail; equipment/issues/new/detail; bookings/calendar, bookings/new/detail, bookings/exceptions/new/detail; maintenance/new/detail; calibrations/detail; safety; documents/new/detail; training/new/detail; approvals; members; reports; activity; settings; settings/locations; settings/suppliers; announcements.

Forms use shared server validation; React Hook Form and Zod drive browser submission. State-changing actions go to API and invalidate TanStack Query caches. Tables use TanStack Table with server paging. Modal primitives provide focus trap/Escape handling. Error states retain server messages and no simulated action buttons are used. Calendar is OSS equivalent month grid with booking links and quota summary.

White/Teal/Navy tokens, Thai/system offline-safe fonts, 252px desktop sidebar, mobile drawer, horizontal table/calendar scroll, keyboard focus, live error/status messages and responsive metrics follow the supplied HTML reference. Screen evidence is recorded by Playwright without opening user-facing preview tabs.
