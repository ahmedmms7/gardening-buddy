import { useEffect, useState } from "react";
import { Link, useLocation } from "wouter";
import {
  LayoutDashboard,
  Sprout,
  CalendarDays,
  GraduationCap,
  Camera,
  Settings2,
  Globe2,
  ArrowUpRight,
  ChevronRight,
  Info,
  X,
  Menu,
  WifiOff,
  Bell,
  Check,
} from "lucide-react";
import { Context, useBuddy, modeAr } from "./context";
import { demoAdapter, type DemoState, type Mode } from "./demo";
import { Logo } from "./ui";
import Landing from "./landing";
import { Dashboard, PlantDetail } from "./plants";
import { CarePlan, Schools } from "./care";
import { Devices, PhotoTool } from "./tools";
function Workspace() {
  const { s, t, setLang } = useBuddy();
  const [loc] = useLocation();
  const [menu, setMenu] = useState(false);
  const [reminders, setReminders] = useState(false);
  const simple = s.mode === "Simple" || s.mode === "Family";
  const nav = [
    { path: "/app", label: t("Garden overview", "نظرة على الحديقة"), icon: LayoutDashboard },
    { path: "/app/plants", label: t("My plant buddies", "نباتاتي"), icon: Sprout },
    { path: "/app/care", label: t("Care plan", "خطة الرعاية"), icon: CalendarDays },
    { path: "/app/schools", label: t("The classroom", "الصف الدراسي"), icon: GraduationCap },
    { path: "/app/photos", label: t("Photo journal", "دفتر الصور"), icon: Camera },
    { path: "/app/devices", label: t("Devices & settings", "الأجهزة والإعدادات"), icon: Settings2 },
  ].filter((x) =>
    s.mode === "Simple"
      ? ["/app", "/app/care", "/app/devices"].includes(x.path)
      : s.mode === "Family"
        ? x.path !== "/app/schools"
        : true,
  );
  const title = nav.find((x) => x.path === loc)?.label || t("My plant buddies", "نباتاتي");
  const detail = loc.match(/^\/app\/plants\/([^/]+)$/);
  const due = s.tasks.filter((x) => !x.done && x.due <= localDay());
  return (
    <div
      className={`app-shell ${simple ? "simple-mode" : ""} ${s.mode === "Grower" ? "grower-mode" : ""}`}
    >
      <aside className={`sidebar ${menu ? "open" : ""}`}>
        <Logo light />
        <div className="workspace-label">{t("A LITTLE SPACE TO GROW", "مساحة صغيرة للنمو")}</div>
        <nav>
          {nav.map((x) => (
            <Link
              href={x.path}
              onClick={() => setMenu(false)}
              key={x.path}
              className={loc === x.path || (x.path === "/app/plants" && detail) ? "active" : ""}
            >
              <x.icon size={20} />
              {x.label}
              {x.path === "/app/care" && due.length > 0 && (
                <span className="nav-count">{due.length}</span>
              )}
            </Link>
          ))}
        </nav>
        <div className="sidebar-bottom">
          <div className="sidebar-seedling">
            <Sprout size={32} />
            <h3>
              {t("A little better,", "أفضل قليلاً،")}
              <br />
              {t("every growing day.", "كل يوم ينمو.")}
            </h3>
            <p>{t("Your care makes the difference.", "رعايتك تصنع الفرق.")}</p>
          </div>
          <Link href="/" className="sidebar-home">
            {t("Meet Gardening Buddy", "تعرّف على رفيق الزراعة")}
            <ArrowUpRight size={16} />
          </Link>
          <div className="sidebar-foot">
            {t("Bahrain · Pilot prototype", "البحرين · نموذج تجريبي")}
            <span>v0.1</span>
          </div>
        </div>
      </aside>
      {menu && (
        <button
          className="sidebar-scrim"
          aria-label={t("Close menu", "إغلاق القائمة")}
          onClick={() => setMenu(false)}
        />
      )}
      <div className="app-body">
        <header className="app-topbar">
          <div className="breadcrumbs">
            <button
              className="icon-btn mobile-menu"
              aria-label={t("Open menu", "فتح القائمة")}
              onClick={() => setMenu(!menu)}
            >
              <Menu size={21} />
            </button>
            <span>{t("My garden", "حديقتي")}</span>
            <ChevronRight size={13} />
            <strong>{title}</strong>
          </div>
          <div className="topbar-actions">
            <ModeSelect />
            <button className="lang-button" onClick={setLang}>
              <Globe2 size={16} />
              {s.lang === "en" ? "العربية" : "English"}
            </button>
            <div className="notification-wrap">
              <button
                className="icon-btn notification-button"
                aria-label={t("In-app reminders", "تذكيرات التطبيق")}
                aria-expanded={reminders}
                onClick={() => setReminders(!reminders)}
              >
                <Bell size={19} />
                {due.length > 0 && <i />}
              </button>
              {reminders && (
                <div className="reminder-popover">
                  <h3>{t("A gentle nudge", "تذكير لطيف")}</h3>
                  <p>
                    {due.length} {t("tasks due today or overdue.", "مهام مستحقة اليوم أو متأخرة.")}
                  </p>
                  <Link href="/app/care" className="text-link" onClick={() => setReminders(false)}>
                    {t("Open care plan", "افتح خطة الرعاية")}
                    <ArrowUpRight size={16} />
                  </Link>
                </div>
              )}
            </div>
            <span className="avatar" aria-label={t("Demo garden profile", "ملف حديقة تجريبي")}>
              <Sprout size={19} />
            </span>
          </div>
        </header>
        <output className="demo-banner">
          <span>
            <Info size={14} />
            <strong>
              {t("Demo data — no device connected", "بيانات تجريبية — لا يوجد جهاز متصل")}
            </strong>
            <span className="demo-banner-description">
              {t("Your changes are saved on this browser.", "تُحفظ تغييراتك في هذا المتصفح.")}
            </span>
          </span>
          <Link href="/app/devices">
            {t("About this demo", "عن هذا العرض")}
            <ArrowUpRight size={13} />
          </Link>
        </output>
        {s.disconnected && (
          <div className="offline-banner">
            <WifiOff size={15} />
            {t(
              "Connection-loss simulation on · Cloud data stale · Local sensing continues (simulated)",
              "محاكاة فقدان الاتصال مفعّلة · بيانات سحابية قديمة · الاستشعار المحلي مستمر (محاكاة)",
            )}
          </div>
        )}
        <main className="app-main">
          {detail ? (
            <PlantDetail id={decodeURIComponent(detail[1]!)} />
          ) : loc === "/app/care" ? (
            <CarePlan />
          ) : loc === "/app/schools" ? (
            <Schools />
          ) : loc === "/app/devices" ? (
            <Devices />
          ) : loc === "/app/photos" ? (
            <PhotoTool />
          ) : loc === "/app" || loc === "/app/plants" ? (
            <Dashboard all={loc === "/app/plants"} />
          ) : (
            <section className="empty">
              <h1>{t("A little off the garden path", "خرجت قليلاً عن مسار الحديقة")}</h1>
              <Link href="/app" className="button primary">
                {t("Back to your garden", "العودة إلى حديقتك")}
              </Link>
            </section>
          )}
        </main>
        <footer className="app-footer">
          <span>
            gardening buddy.{" "}
            <span>{t("Small signals. Happier plants.", "إشارات صغيرة. نباتات أسعد.")}</span>
          </span>
          <span>{t("Pilot prototype · Local-first demo", "نموذج أولي · عرض محلي")}</span>
        </footer>
      </div>
    </div>
  );
}
function localDay() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}
function ModeSelect() {
  const { s, t, update } = useBuddy();
  return (
    <label className="mode-select">
      <span>{t("Mode", "الوضع")}</span>
      <select
        aria-label={t("Garden mode", "وضع الحديقة")}
        value={s.mode}
        onChange={(e) => update((old) => ({ ...old, mode: e.target.value as Mode }))}
      >
        {["School", "Grower", "Family", "Simple"].map((m) => (
          <option key={m} value={m}>
            {t(m, modeAr[m]!)}
          </option>
        ))}
      </select>
    </label>
  );
}
export default function Buddy() {
  useEffect(() => {
    if (import.meta.env.PROD && "serviceWorker" in navigator) {
      navigator.serviceWorker.register("/sw.js").catch(() => {
        /* In-app local state remains usable when service workers are unavailable. */
      });
    }
  }, []);
  const [s, setState] = useState<DemoState>(() => demoAdapter.load());
  const [toast, setToast] = useState("");
  const [loc] = useLocation();
  const t = (en: string, ar: string) => (s.lang === "ar" ? ar : en);
  const update = (fn: (s: DemoState) => DemoState) => setState(fn);
  useEffect(() => {
    if (!demoAdapter.save(s))
      setToast(
        s.lang === "en"
          ? "Browser storage is unavailable or full. Changes will not persist."
          : "مساحة تخزين المتصفح غير متاحة أو ممتلئة. لن تُحفظ التغييرات.",
      );
    document.documentElement.lang = s.lang;
    document.documentElement.dir = s.lang === "ar" ? "rtl" : "ltr";
  }, [s]);
  useEffect(() => {
    if (!toast) return;
    const id = setTimeout(() => setToast(""), 5500);
    return () => clearTimeout(id);
  }, [toast]);
  useEffect(() => {
    window.scrollTo(0, 0);
    document.title = loc.startsWith("/app")
      ? "Your garden · Gardening Buddy"
      : "Gardening Buddy — Small signals. Happier plants.";
  }, [loc]);
  return (
    <Context.Provider
      value={{
        s,
        t,
        update,
        notify: setToast,
        setLang: () => update((old) => ({ ...old, lang: old.lang === "en" ? "ar" : "en" })),
      }}
    >
      {loc.startsWith("/app") ? <Workspace /> : <Landing />}
      {toast && (
        <output className="toast">
          <Check size={19} />
          <span>{toast}</span>
          <button
            className="icon-btn"
            onClick={() => setToast("")}
            aria-label={t("Dismiss message", "إغلاق الرسالة")}
          >
            <X size={17} />
          </button>
        </output>
      )}
    </Context.Provider>
  );
}
