# Gardening Buddy

**Small signals. Happier plants.** A bilingual, local-first pilot prototype for a Bahrain INJAZ university student startup. Marketing website plus responsive web app/PWA. No actual hardware, external API keys, paid services, accounts or checkout are used by the gardening experience. Nothing has been publicly published.

## Run

From this managed project:

```sh
bun install
bun run dev           # website + template Hono API, assigned port in __ports.cjs (4200)
bun run build         # TypeScript + production build
bun run lint          # template integrity and code checks
```

Open the generated project preview. `/` is the marketing website and `/app` is the gardening app. Use **Open demo app** on the home page. The project uses the managed Bun/Vite/React/TypeScript/Hono template. Expo/Electron scaffolds remain unused; this deliverable is a responsive web prototype, not a native mobile binary.

## Implemented

- Editorial botanical landing page: original plant/device illustrations, process, schools/growers, features, honest pilot status, FAQ and working app links.
- English/Arabic with document-level RTL, saved language and School/Grower/Family/Simple modes. Simple/Family reduce navigation and enlarge controls; Grower uses compact plant rows.
- Four first-load seeded plants, static timestamped demo readings and status. The persistent banner makes it explicit no physical device is connected.
- Plant CRUD with delete confirmation; editable profiles/thresholds; faces and explanations; all four metrics with correct units. New plants start without readings.
- 24-hour demo charts for each metric plus an expandable exact-value table. History and four care actions, including human observations. Watering history never changes sensor moisture or awards streaks.
- Care task checklist, local-calendar dates/calendar filtering, overdue state, actual completion/reopening/deletion, user-scheduled repot reminders. Daily check-in streaks count local days, at most once per day. Task completion also counts as participation; watering volume does not.
- School teacher view, fictional teams explicitly marked, group selector, shared-garden participation progress, challenges added to care tasks, printable certificate preview without official logos or endorsements. Scores for your garden derive from saved observations and currently completed tasks; comparison teams are fixed fictional samples. No student personal data collection.
- Simulated hub/nodes, three-step pairing, sampling preference, dry/wet ADC reference validation, relative-percent calibration explanation and architecture. Offline simulation marks cloud readings unknown/stale; manual local samples queue, and reconnect clears the simulated queue. Seed values never become claimed live measurements.
- Local photo selection/preview, user-entered plant identification and observations saved to a chosen plant history. Photos never upload and are not persisted. No automated identification, disease diagnosis, or treatment output.
- Reset with confirmation, validation, native keyboard-accessible dialogs, accessible charts, self-hosted fonts and responsive layouts.
- Installable PWA manifest and generated production service worker. The production shell/assets cache after a successful first online visit. Offline navigation and local edits work thereafter on browsers supporting service workers. Dev/HMR preview intentionally does not register a service worker to avoid stale development assets. The device-disconnection toggle is a separate, clearly labeled demo, not the browser network state.

## State and replacement boundary

`packages/web/src/web/features/demo.ts` defines typed `Reading`, `Plant`, `Thresholds`, `Task`, `Device` and `DemoState` models plus a separated `demoAdapter` (`load`, `save`, `reset`). It seeds only when a valid saved dataset does not exist. UI state is persisted under `gardening-buddy-v1` in localStorage. It is browser/origin-specific, not a secure database or cross-device account. Clearing browser data resets it; storage failure shows a warning. Avoid confidential data in this prototype.

`features/context.tsx` is the UI state boundary. Replace the adapter and state actions with authenticated oRPC query/mutation hooks when implementing a backend; no hand-written API requests exist in the demo. The managed Hono backend is not presented as an integrated device backend.

Major UI files: `landing.tsx`, `buddy.tsx` (shell/provider), `plants.tsx`, `care.tsx`, `tools.tsx`, `ui.tsx`. Styles in `src/web/styles.css`; `design.md` documents the visual system. Public fonts, icons and manifest live in `packages/web/public/`. `packages/web/pwa-plugin.ts` emits the production worker.

## Limitations and next steps

- **Hardware:** ESP32-C3 plant nodes, capacitive moisture probe, AHT20 + BMP280 combo, light sensor, LCD, USB-C rechargeable power; ESP32-S3 hub with screen/buttons. No pH sensing. Verify exact board/display variants, sensor drivers, pin mapping, charging, battery safety and power budget on a bench. Validate scheduled sampling, on-device face logic, offline queue durability and transport.
- **Readings:** moisture is calibrated relative %, not volumetric water content. Pilot thresholds are examples needing plant/soil calibration, not universal recommendations. The 24 trend values are deterministic seeded samples, not a time-series service. Demo timestamps age naturally; fresh means less than one hour and online in the demo. Device settings save locally only, never to firmware. Manual simulated samples track queue/sync timestamps only and do not mutate readings.
- **Integration/auth:** implement secure pairing, device identity, authenticated node → mother hub → backend → app transport, authorization, replay protection, durable sync, user accounts, tenancy and audited storage before real use. No secrets are embedded in the gardening frontend.
- **Notifications:** in-app overdue/due reminders work; the user can explicitly request browser permission if supported. No scheduled OS notifications or background push exist. Permission alone does not enable delivery. Secure context, platform support and delivery infrastructure are still required.
- **Photos:** an optional future service would need user consent, secure backend integration and diagnostic safety review. No AI is connected here. Images are preview-only; only human text notes persist.
- **Schools:** demonstration only; no official certificates, ministry partnership, awards, secured prizes or performance claims. Before real student use, validate age-appropriate UX, teacher controls and privacy policies.
- **Packaging:** PWA installation depends on browser/OS support. Native iOS/Android packaging, device testing, stores, permissions and push setup remain future work through the platform publishing flow. No APK/IPA was built.

## Verification

Production build and lint pass. Browser interaction checks cover plant CRUD, all care actions, unchanged moisture after watering, profile/threshold persistence, 24 chart rows, task persistence/completion, one-day streak, school groups/challenges/certificate, pairing, offline queue/reconnect, calibration validation, local photo observations and modes. Seven routes checked at 390/768/1440px without horizontal document overflow, with separate Arabic/RTL checks. A local production server test verifies actual worker install and offline app navigation. See `QA.md` for the final test record.
