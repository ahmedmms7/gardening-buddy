# Copilot instructions — Gardening Buddy

Project: bilingual (EN/AR, RTL) marketing site + mobile-first PWA demo for a plant-monitoring device. Pilot-stage INJAZ Bahrain student startup. Demo data only.

## Stack & Code Cleanup Rules
- Remove or strip all Runnable branding, watermarks, scripts, headers, footers, or external Runnable dependencies.
- Vite + React + TypeScript (strict), React Router (HashRouter for GitHub Pages deployment).
- Self-contained local state; no external runtime API calls or paid services.

## Hard Content & UI Rules
- Show "Demo data — no device connected" persistently in the app header banner.
- Never invent live readings, testimonials, awards, or official ministry/INJAZ endorsements.
- Moisture = "calibrated relative %" (never volumetric water content). Air temp °C, humidity %RH, light lux. No pH sensing.
- Watering logs never change sensor moisture. Leaderboards score observations/tasks/check-ins, NEVER water amount.
- Photo tool: label "Automated identification/analysis — not connected, future optional service". Never fabricate AI diagnoses.
- No student names or personal data collected. No Wi-Fi passwords collected (pairing is simulated).
- Notifications: state browser notifications need permission; background push is NOT implemented.

## Code Rules
- All UI strings through i18n keys (en.json + ar.json). Full sentences, no string concatenation of fragments.
- Use CSS logical properties (margin-inline, padding-inline, inset-inline) — no physical left/right CSS. Mirror directional icons in RTL.
- Persist state to localStorage under versioned key `gb:v1:*`; seed demo data only on first load.