# Engineering decisions

- Authority: complete master specification and current user authorization supersede the earlier setup-only scope. Local services only; no git initialization, commit, push or production access.
- Execution: solo, protected assurance (authentication/migration/inventory). Parent serially verifies schema before service and services before UI. Worker packet: N/A — no worker dispatched. Independent read-only review reserved for final candidate.
- Model recommendation: GPT-6.1 Sol/high. Actual parent runtime model/effort is not exposed and is not inferred from configuration.
- Router classified this as software/auth/database/high complexity. The project-local router skill is present; its referenced setup route script and Superpowers subskills are not installed. Equivalent test-first and fresh verification practices are applied directly; no cross-project runtime is loaded.
- Quantities use PostgreSQL NUMERIC and Prisma Decimal. Slot protection uses PostgreSQL btree_gist exclusion constraints; user/lab quota serialization uses transaction advisory locks. Service-level tenant checks supplement foreign keys.
- Local API binds loopback. SMTP connects only to loopback Mailpit; optional external channels remain disabled. No production deployment.
- Existing secretary files and design reference are preserved. UI implementation follows White/Teal/Navy tokens and Thai copy from the supplied HTML reference.
