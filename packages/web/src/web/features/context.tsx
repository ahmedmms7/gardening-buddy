import { createContext, useContext } from "react";
import type { DemoState } from "./demo";
export type T = (en: string, ar: string) => string;
export interface BuddyContext {
  s: DemoState;
  update: (fn: (s: DemoState) => DemoState) => void;
  t: T;
  notify: (message: string) => void;
  setLang: () => void;
}
export const Context = createContext<BuddyContext>(null!);
export const useBuddy = () => useContext(Context);
export const modeAr: Record<string, string> = {
  School: "المدرسة",
  Grower: "المزارع",
  Family: "العائلة",
  Simple: "البسيط",
};
export const actionAr: Record<string, string> = {
  "Watering logged": "تسجيل الري",
  "Soil checked": "فحص التربة",
  "Plant rotated": "تدوير النبات",
  Observation: "ملاحظة",
  "Task completed": "إنجاز المهمة",
};
