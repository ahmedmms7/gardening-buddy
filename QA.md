# Verification record — 21 October 2026

## Automated checks

- `bun run build`: passes TypeScript and production Vite build. Web JavaScript bundle approximately 345 kB before gzip.
- `bun run lint`: zero errors and warnings; managed-template integrity passes.
- Chromium browser interaction tests: no application runtime errors.

## Passed workflows

1. Four seeded plants and persistent demo banner.
2. Watering, soil check, rotation and observation update history; watering does not change moisture.
3. Profile edits, editable thresholds, derived mood and reload persistence.
4. 24 chart readings in accessible table; metric switching.
5. Add plant starts unknown; confirmed deletion removes plant and linked tasks.
6. Add repot task with user-scheduled label; complete and persist completion.
7. Participation awards one local-calendar-day check-in.
8. Class group selection, adding challenges, printable unofficial certificate preview.
9. Simulated connection loss marks all plant conditions unknown; local sample queues; simulated reconnect clears queue.
10. Three-step simulated pairing adds a sample node.
11. Calibration rejects equal dry/wet references and persists valid settings.
12. Local image preview and human observation saving to care history; no diagnosis generated.
13. Grower compact rows; Simple navigation limited to overview, care, settings.
14. Language persistence and RTL; all seven main routes fit 390px in Arabic.
15. Seven main routes fit 390px, 768px and 1440px English without horizontal document overflow.
16. Production service worker installs/controls the page and caches the shell, fonts and icons. With actual browser networking disabled, direct care-route navigation, task creation and reload persistence work.
17. Browser print produces the participation certificate PDF.

Production offline checks were run against a local server only. The live development preview uses HMR and intentionally does not install a service worker. Physical devices, real backend sync, cross-device data, native notifications, actual mobile OS installs and assistive-technology testing are not validated by these checks.
