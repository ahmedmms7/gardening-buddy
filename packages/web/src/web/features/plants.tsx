import { useState } from "react";
import { Link, useLocation } from "wouter";
import {
  ArrowLeft,
  ArrowUpRight,
  Plus,
  Droplets,
  Thermometer,
  Sun,
  Wind,
  MapPin,
  Pencil,
  Trash2,
  Leaf,
  Check,
  RotateCw,
  MessageSquare,
  Clock,
  Info,
} from "lucide-react";
import { useBuddy, actionAr } from "./context";
import { dayKey, mood, uid, streak, type Plant, type Mood } from "./demo";
import { PlantArt, Face, Tag, Modal } from "./ui";
export function usePlantWords() {
  const { s, t } = useBuddy();
  return {
    name: (p: Plant) => (s.lang === "ar" ? p.arName || p.name : p.name),
    location: (p: Plant) => (s.lang === "ar" ? p.arLocation || p.location : p.location),
    species: (p: Plant) => (s.lang === "ar" ? p.arSpecies : p.species),
    status: (m: Mood) =>
      ({
        happy: t("Feeling good", "بحالة جيدة"),
        thirsty: t("A little thirsty", "أحتاج فحص التربة"),
        hot: t("Feeling warm", "أشعر بالحرارة"),
        "low-light": t("Needs some light", "أحتاج بعض الضوء"),
        unknown: t("Reading unavailable", "القراءة غير متاحة"),
      })[m],
  };
}
export function readingTime(at: string, lang: string) {
  return new Date(at).toLocaleString(lang === "ar" ? "ar-BH" : "en-GB", {
    day: "numeric",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  });
}
export function PlantForm({ plant, onClose }: { plant?: Plant; onClose: () => void }) {
  const { t, update, notify } = useBuddy();
  const [name, setName] = useState(plant?.name || "");
  const [location, setLocation] = useState(plant?.location || "");
  const [kind, setKind] = useState<Plant["kind"]>(plant?.kind || "basil");
  const [thresholds, setThresholds] = useState(
    plant?.thresholds || { moisture: 35, temperature: 33, light: 1500 },
  );
  return (
    <Modal
      title={
        plant
          ? t("Edit plant profile", "تعديل ملف النبات")
          : t("A new little buddy", "رفيق صغير جديد")
      }
      onClose={onClose}
    >
      <form
        onSubmit={(e) => {
          e.preventDefault();
          if (!name.trim() || !location.trim()) return;
          update((old) => ({
            ...old,
            plants: plant
              ? old.plants.map((p) =>
                  p.id === plant.id
                    ? {
                        ...p,
                        name: name.trim(),
                        arName: undefined,
                        location: location.trim(),
                        arLocation: undefined,
                        thresholds,
                      }
                    : p,
                )
              : [
                  ...old.plants,
                  {
                    id: uid(),
                    name: name.trim(),
                    location: location.trim(),
                    kind,
                    species: kind,
                    arSpecies: {
                      basil: "ريحان",
                      tomato: "طماطم",
                      mint: "نعناع",
                      marigold: "قطيفة",
                    }[kind],
                    reading: {
                      moisture: 0,
                      temperature: 0,
                      humidity: 0,
                      light: 0,
                      at: new Date().toISOString(),
                    },
                    thresholds,
                    history: [],
                    trend: [],
                    nodeId: "Unpaired",
                    state: "offline",
                  },
                ],
          }));
          notify(
            t(
              plant ? "Plant profile saved" : "Your new buddy is added",
              plant ? "تم حفظ ملف النبات" : "تمت إضافة رفيقك الجديد",
            ),
          );
          onClose();
        }}
      >
        <label>
          {t("Plant name", "اسم النبات")}
          <input
            required
            maxLength={60}
            aria-label={t("Plant name", "اسم النبات")}
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </label>
        <label>
          {t("Location / zone", "الموقع / المنطقة")}
          <input
            required
            maxLength={80}
            aria-label={t("Location / zone", "الموقع / المنطقة")}
            value={location}
            onChange={(e) => setLocation(e.target.value)}
          />
        </label>
        {!plant && (
          <label>
            {t("Plant illustration", "رسم النبات")}
            <select value={kind} onChange={(e) => setKind(e.target.value as Plant["kind"])}>
              {(["basil", "tomato", "mint", "marigold"] as const).map((x, i) => (
                <option key={x} value={x}>
                  {t(x, ["ريحان", "طماطم", "نعناع", "قطيفة"][i]!)}
                </option>
              ))}
            </select>
          </label>
        )}
        <div className="callout">
          <Info size={18} />
          <p>
            {t(
              "Pilot settings: examples only, requiring calibration for your plant and soil. Not universal scientific recommendations.",
              "إعدادات تجريبية: أمثلة تحتاج إلى معايرة للنبات والتربة وليست توصيات علمية عامة.",
            )}
          </p>
        </div>
        <div className="form-grid">
          {(
            [
              {
                key: "moisture",
                label: t("Low moisture (%)", "حد الرطوبة الأدنى (%)"),
                min: 0,
                max: 100,
              },
              {
                key: "temperature",
                label: t("High temperature (°C)", "حد الحرارة الأعلى (°C)"),
                min: 0,
                max: 60,
              },
              {
                key: "light",
                label: t("Low light (lux)", "حد الضوء الأدنى (لوكس)"),
                min: 0,
                max: 100000,
              },
            ] as const
          ).map((x) => (
            <label key={x.key}>
              {x.label}
              <input
                type="number"
                required
                min={x.min}
                max={x.max}
                aria-label={x.label}
                value={thresholds[x.key]}
                onChange={(e) => setThresholds({ ...thresholds, [x.key]: Number(e.target.value) })}
              />
            </label>
          ))}
        </div>
        <p className="muted small">
          {t(
            "New plants have no sensor data until a validated device is integrated.",
            "النباتات الجديدة ليس لها بيانات حتى يتم ربط جهاز معتمد.",
          )}
        </p>
        <button className="button primary full" type="submit">
          {t("Save plant", "حفظ النبات")}
          <Check size={17} />
        </button>
      </form>
    </Modal>
  );
}
function Metrics({ plant }: { plant: Plant }) {
  const { t } = useBuddy();
  return (
    <div className="plant-metrics">
      <span>
        <Droplets size={15} />
        <strong>{plant.state === "offline" ? "—" : `${plant.reading.moisture}%`}</strong>
        <small>{t("Soil", "التربة")}</small>
      </span>
      <span>
        <Thermometer size={15} />
        <strong>{plant.state === "offline" ? "—" : `${plant.reading.temperature}°C`}</strong>
        <small>{t("Air", "الهواء")}</small>
      </span>
      <span>
        <Sun size={15} />
        <strong>{plant.state === "offline" ? "—" : plant.reading.light.toLocaleString()}</strong>
        <small>lux</small>
      </span>
    </div>
  );
}
export function Dashboard({ all = false }: { all?: boolean }) {
  const { s, t, update, notify } = useBuddy();
  const [adding, setAdding] = useState(false);
  const words = usePlantWords();
  const due = s.tasks.filter((x) => !x.done && x.due <= dayKey());
  const healthy = s.plants.filter((p) => mood(p, s.disconnected) === "happy").length;
  const checkin = () => {
    if (s.checkins.includes(dayKey())) return;
    update((old) => ({ ...old, checkins: [...old.checkins, dayKey()] }));
    notify(
      t(
        "A little care, a growing habit. Today’s check-in saved.",
        "تم تسجيل حضور اليوم. رعاية صغيرة وعادة تنمو.",
      ),
    );
  };
  return (
    <>
      <div className="page-heading">
        <div>
          <span className="eyebrow">{t("YOUR LITTLE CORNER OF GREEN", "ركنك الأخضر الصغير")}</span>
          <h1>
            {all
              ? t("Your plant family", "عائلة نباتاتك")
              : t("A good day to grow.", "يوم جميل للنمو.")}
            <span className="heading-leaf">
              <Leaf />
            </span>
          </h1>
          <p>
            {t(
              "Small check-ins. Happy plants. You’ve got this.",
              "زيارات صغيرة. نباتات سعيدة. أنت لها.",
            )}
          </p>
        </div>
        <button className="button primary" onClick={() => setAdding(true)}>
          <Plus size={18} />
          {t("Add a plant", "إضافة نبات")}
        </button>
      </div>
      {!all && (
        <div className="overview-grid">
          <div className="garden-greeting">
            <div>
              <Tag color="cream">
                {t("A LITTLE CARE GOES A LONG WAY", "قليل من الرعاية يصنع الفرق")}
              </Tag>
              <h2>
                {t("Let’s see how your", "لنطمئن على")}
                <br />
                {t("buddies are feeling.", "أصدقائك الصغار.")}
              </h2>
              <p>
                {due.length} {t("care tasks to check in on.", "مهام رعاية بانتظارك.")}
              </p>
              <Link href="/app/care" className="text-link">
                {t("View today’s care", "رعاية اليوم")}
                <ArrowUpRight size={18} />
              </Link>
            </div>
            <div className="greeting-art">
              <Face />
              <span className="leaf-sprig">
                <Sprig />
              </span>
            </div>
          </div>
          <div className="overview-stat">
            <span className="stat-icon sage">
              <Leaf size={21} />
            </span>
            <span className="stat-label">{t("Growing together", "ننمو معاً")}</span>
            <strong>
              {s.plants.length.toString().padStart(2, "0")}
              <small>{t("plant buddies", "رفقاء نباتات")}</small>
            </strong>
            <p>
              {healthy} {t("with happy demo signals", "بإشارات تجريبية سعيدة")}
            </p>
          </div>
          <div className="overview-stat streak-card">
            <span className="stat-icon peach">
              <Sun size={23} />
            </span>
            <span className="stat-label">{t("Your care streak", "سلسلة الرعاية")}</span>
            <strong>
              {streak(s.checkins)}
              <small>{t("local calendar days", "أيام تقويم محلية")}</small>
            </strong>
            <button
              className="text-link"
              onClick={checkin}
              disabled={s.checkins.includes(dayKey())}
            >
              {s.checkins.includes(dayKey()) ? (
                <>
                  <Check size={16} />
                  {t("Checked in today", "تم تسجيل اليوم")}
                </>
              ) : (
                <>
                  {t("Check in today", "سجّل حضور اليوم")}
                  <ArrowUpRight size={16} />
                </>
              )}
            </button>
          </div>
        </div>
      )}
      <div className="section-bar">
        <h2>
          {all
            ? t("All plant buddies", "كل رفقاء النباتات")
            : t("Meet your plant buddies", "تعرّف على رفقاء نباتاتك")}
          <span className="count-pill">{s.plants.length}</span>
        </h2>
        <div className="legend">
          <i />
          {t("Sample sensor readings", "قراءات مستشعر تجريبية")}
        </div>
      </div>
      <div className={`plant-grid ${s.mode === "Grower" ? "compact-plants" : ""}`}>
        {s.plants.map((p) => {
          const m = mood(p, s.disconnected);
          return (
            <Link key={p.id} href={`/app/plants/${p.id}`} className={`plant-card ${p.kind}`}>
              <div className="plant-card-top">
                <Tag color={m === "happy" ? "green" : m === "unknown" ? "gray" : "amber"}>
                  <span className="status-dot" />
                  {words.status(m)}
                </Tag>
                <ArrowUpRight size={18} />
              </div>
              <div className="plant-image">
                <PlantArt kind={p.kind} />
                <Face mood={m} small />
              </div>
              <div className="plant-card-copy">
                <h3>{words.name(p)}</h3>
                <span className="plant-location">
                  <MapPin size={12} />
                  {words.location(p)}
                </span>
                <Metrics plant={p} />
                <div className="last-reading">
                  <Clock size={11} />
                  {p.state === "offline"
                    ? t("No reading · unpaired", "لا قراءة · غير مقترن")
                    : readingTime(p.reading.at, s.lang)}
                  <span>
                    {s.disconnected
                      ? t("Offline", "دون اتصال")
                      : m === "unknown"
                        ? t("Stale", "قديمة")
                        : t("Demo online", "متصل تجريبياً")}
                  </span>
                </div>
              </div>
            </Link>
          );
        })}
      </div>
      <p className="measurement-note">
        <Info size={13} />
        {t(
          "Soil moisture is calibrated relative %, not volumetric water content. All readings are seeded examples, not live measurements.",
          "رطوبة التربة نسبة مئوية نسبية معايرة، وليست محتوى مائياً حجمياً. كل القراءات أمثلة وليست قياسات حية.",
        )}
      </p>
      {!all && (
        <div className="dashboard-bottom">
          <section className="panel">
            <div className="section-bar">
              <h2>{t("A little care for today", "قليل من الرعاية لليوم")}</h2>
              <Link href="/app/care" className="text-link">
                {t("View care plan", "عرض الخطة")}
                <ArrowUpRight size={16} />
              </Link>
            </div>
            {due.length ? (
              due.slice(0, 3).map((task) => (
                <div className="task-preview" key={task.id}>
                  <span className="task-preview-icon">
                    <Leaf size={18} />
                  </span>
                  <div>
                    <strong>{s.lang === "ar" ? task.arTitle || task.title : task.title}</strong>
                    <small>
                      {task.due < dayKey()
                        ? t("Overdue · a gentle nudge", "متأخر · تذكير لطيف")
                        : t("Today · a moment of care", "اليوم · لحظة رعاية")}
                    </small>
                  </div>
                  <Link
                    href="/app/care"
                    className="icon-btn"
                    aria-label={t("Open task", "فتح المهمة")}
                  >
                    <ArrowUpRight size={18} />
                  </Link>
                </div>
              ))
            ) : (
              <p className="muted">
                {t("All caught up. Time to enjoy your garden.", "أنجزت كل شيء. استمتع بحديقتك.")}
              </p>
            )}
          </section>
          <section className="tip-card">
            <span className="eyebrow">
              <Sun size={16} />
              {t("A GENTLE GROWING TIP", "نصيحة نمو لطيفة")}
            </span>
            <h3>{t("Look first. Water second.", "راقب أولاً. اسقِ ثانياً.")}</h3>
            <p>
              {t(
                "A low moisture signal is an invitation to check the soil—not an automatic instruction to water. Every plant and pot is different.",
                "إشارة الرطوبة المنخفضة دعوة لفحص التربة، وليست أمراً آلياً بالري. لكل نبات ووعاء ظروفه.",
              )}
            </p>
            <span className="tip-leaf">
              <Leaf size={55} />
            </span>
          </section>
        </div>
      )}
      {adding && <PlantForm onClose={() => setAdding(false)} />}
    </>
  );
}
function Sprig() {
  return (
    <svg width="65" height="80" viewBox="0 0 65 80">
      <path d="M30 75V21" stroke="#a2bd6a" strokeWidth="3" />
      <path d="M30 50Q-3 49 7 18q27 0 23 32M30 34q1-31 29-26 3 25-29 26" fill="#bdd78a" />
    </svg>
  );
}
export function PlantDetail({ id }: { id: string }) {
  const { s, t, update, notify } = useBuddy();
  const [, navigate] = useLocation();
  const p = s.plants.find((p) => p.id === id);
  const [edit, setEdit] = useState(false);
  const [observation, setObservation] = useState(false);
  const [metric, setMetric] = useState<"moisture" | "temperature" | "humidity" | "light">(
    "moisture",
  );
  const words = usePlantWords();
  if (!p)
    return (
      <div className="empty">
        <Leaf size={40} />
        <h1>{t("This buddy isn’t here", "هذا الرفيق غير موجود")}</h1>
        <Link href="/app/plants" className="button primary">
          {t("Back to plants", "العودة للنباتات")}
        </Link>
      </div>
    );
  const m = mood(p, s.disconnected);
  const log = (action: string, note = "") => {
    update((old) => ({
      ...old,
      plants: old.plants.map((x) =>
        x.id === p.id
          ? {
              ...x,
              history: [{ id: uid(), at: new Date().toISOString(), action, note }, ...x.history],
            }
          : x,
      ),
    }));
    notify(
      t(
        "Care note saved. Sensor readings are unchanged.",
        "تم حفظ الرعاية. قراءات المستشعر لم تتغير.",
      ),
    );
  };
  const triggers = [
    p.reading.moisture < p.thresholds.moisture
      ? `${t("Relative moisture", "الرطوبة النسبية")} ${p.reading.moisture}% < ${p.thresholds.moisture}%`
      : null,
    p.reading.temperature > p.thresholds.temperature
      ? `${t("Air temperature", "حرارة الهواء")} ${p.reading.temperature}°C > ${p.thresholds.temperature}°C`
      : null,
    p.reading.light < p.thresholds.light
      ? `${t("Light", "الضوء")} ${p.reading.light} lux < ${p.thresholds.light} lux`
      : null,
  ].filter(Boolean);
  const min = Math.min(...p.trend.map((x) => x[metric]));
  const max = Math.max(...p.trend.map((x) => x[metric]));
  const units = { moisture: "%", temperature: "°C", humidity: "%RH", light: "lux" };
  return (
    <>
      <Link href="/app/plants" className="text-link back">
        <ArrowLeft size={16} />
        {t("All plant buddies", "كل رفقاء النباتات")}
      </Link>
      <div className="page-heading">
        <div>
          <span className="eyebrow">{words.species(p)}</span>
          <h1>{words.name(p)}</h1>
          <p>
            <MapPin size={15} />
            {words.location(p)}
            <span> · {p.nodeId}</span>
          </p>
        </div>
        <div className="inline-actions">
          <button className="button outline" onClick={() => setEdit(true)}>
            <Pencil size={16} />
            {t("Edit profile", "تعديل الملف")}
          </button>
          <button
            className="icon-btn danger"
            aria-label={t("Delete plant", "حذف النبات")}
            onClick={() => {
              if (
                confirm(
                  t(
                    `Delete ${p.name} and its tasks? This cannot be undone.`,
                    `حذف ${words.name(p)} ومهامه؟ لا يمكن التراجع.`,
                  ),
                )
              ) {
                update((old) => ({
                  ...old,
                  plants: old.plants.filter((x) => x.id !== id),
                  tasks: old.tasks.filter((x) => x.plantId !== id),
                }));
                navigate("/app/plants");
                notify(t("Plant deleted", "تم حذف النبات"));
              }
            }}
          >
            <Trash2 size={19} />
          </button>
        </div>
      </div>
      <div className="detail-layout">
        <section className={`plant-profile panel ${p.kind}`}>
          <Tag color={m === "happy" ? "green" : "amber"}>{words.status(m)}</Tag>
          <div className="detail-art">
            <PlantArt kind={p.kind} />
            <Face mood={m} />
          </div>
          <h2>{words.name(p)}</h2>
          <p>{words.species(p)}</p>
          <div className="profile-meta">
            <span>{t("Last demo reading", "آخر قراءة تجريبية")}</span>
            <strong>
              {p.state === "offline"
                ? t("No reading", "لا قراءة")
                : readingTime(p.reading.at, s.lang)}
            </strong>
            <Tag color="gray">
              {s.disconnected
                ? t("Offline · cloud data stale", "دون اتصال · بيانات سحابية قديمة")
                : m === "unknown"
                  ? t("Stale / unavailable", "قديمة / غير متاحة")
                  : t("Demo online", "متصل تجريبياً")}
            </Tag>
          </div>
        </section>
        <div>
          <div className="reading-grid">
            {[
              {
                key: "moisture",
                icon: Droplets,
                label: t("Soil moisture", "رطوبة التربة"),
                unit: "%",
                note: t("Calibrated relative", "نسبية معايرة"),
              },
              {
                key: "temperature",
                icon: Thermometer,
                label: t("Air temperature", "حرارة الهواء"),
                unit: "°C",
                note: t("Ambient air", "الهواء المحيط"),
              },
              {
                key: "humidity",
                icon: Wind,
                label: t("Air humidity", "رطوبة الهواء"),
                unit: "%RH",
                note: t("Relative humidity", "رطوبة نسبية"),
              },
              {
                key: "light",
                icon: Sun,
                label: t("Light level", "مستوى الضوء"),
                unit: "lux",
                note: t("Illuminance", "شدة الإضاءة"),
              },
            ].map((x) => (
              <div className="reading-tile" key={x.key}>
                <x.icon size={20} />
                <span>{x.label}</span>
                <strong>
                  {p.state === "offline"
                    ? "—"
                    : p.reading[x.key as keyof Omit<Plant["reading"], "at">].toLocaleString()}
                  <small>{x.unit}</small>
                </strong>
                <small>{x.note}</small>
              </div>
            ))}
          </div>
          <section className="panel trend-panel">
            <div className="section-bar">
              <h2>{t("A day in your plant’s life", "يوم في حياة نباتك")}</h2>
              <Tag color="gray">{t("24h demo trend", "اتجاه تجريبي ٢٤ ساعة")}</Tag>
            </div>
            <div className="chart-tabs">
              {(["moisture", "temperature", "humidity", "light"] as const).map((v, i) => (
                <button
                  className={metric === v ? "active" : ""}
                  key={v}
                  onClick={() => setMetric(v)}
                >
                  {
                    [
                      t("Moisture", "الرطوبة"),
                      t("Temperature", "الحرارة"),
                      t("Humidity", "رطوبة الهواء"),
                      t("Light", "الضوء"),
                    ][i]
                  }
                </button>
              ))}
            </div>
            {p.trend.length ? (
              <>
                <div className="trend-chart" dir="ltr">
                  <div className="chart-y">
                    <span>
                      {Math.ceil(max + 3)} {units[metric]}
                    </span>
                    <span>
                      {Math.floor(Math.max(0, min - 3))} {units[metric]}
                    </span>
                  </div>
                  <svg
                    viewBox="0 0 660 150"
                    aria-label={t(
                      `24 hourly demo ${metric} values. Range ${min.toFixed(1)} to ${max.toFixed(1)} ${units[metric]}. Exact values in table below.`,
                      `٢٤ قراءة تجريبية. المدى ${min.toFixed(1)} إلى ${max.toFixed(1)} ${units[metric]}. القيم في الجدول أدناه.`,
                    )}
                  >
                    <defs>
                      <linearGradient id="chart-fill" x1="0" y1="0" x2="0" y2="1">
                        <stop stopColor="#a9ca7e" stopOpacity=".4" />
                        <stop offset="1" stopColor="#a9ca7e" stopOpacity="0" />
                      </linearGradient>
                    </defs>
                    {[20, 60, 100, 140].map((y) => (
                      <line
                        key={y}
                        x1="0"
                        x2="660"
                        y1={y}
                        y2={y}
                        stroke="#e7ebe4"
                        strokeDasharray="4 5"
                      />
                    ))}
                    <polygon
                      points={`0,145 ${p.trend.map((r, i) => `${(i * 660) / 23},${130 - ((r[metric] - min) / (max - min || 1)) * 105}`).join(" ")} 660,145`}
                      fill="url(#chart-fill)"
                    />
                    <polyline
                      points={p.trend
                        .map(
                          (r, i) =>
                            `${(i * 660) / 23},${130 - ((r[metric] - min) / (max - min || 1)) * 105}`,
                        )
                        .join(" ")}
                      fill="none"
                      stroke="#4c7543"
                      strokeWidth="3"
                      strokeLinejoin="round"
                    />
                  </svg>
                  <div className="chart-x">
                    <span>
                      {new Date(p.trend[0]!.at).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                    <span>{t("Sample hours · not live", "ساعات تجريبية · ليست حية")}</span>
                    <span>
                      {new Date(p.reading.at).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                  </div>
                </div>
                <details className="data-table">
                  <summary>
                    {t("View accessible data table", "عرض جدول البيانات القابل للوصول")}
                  </summary>
                  <div className="table-scroll">
                    <table>
                      <thead>
                        <tr>
                          <th>{t("Time", "الوقت")}</th>
                          <th>
                            {t("Value", "القيمة")} ({units[metric]})
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {p.trend.map((r) => (
                          <tr key={r.at}>
                            <td>{readingTime(r.at, s.lang)}</td>
                            <td>{r[metric].toFixed(1)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </details>
              </>
            ) : (
              <p className="empty">
                {t(
                  "No readings yet. A new plant starts with unknown conditions.",
                  "لا توجد قراءات بعد. حالة النبات الجديد غير معروفة.",
                )}
              </p>
            )}
          </section>
        </div>
      </div>
      <div className="two-columns">
        <section className="panel">
          <div className="section-bar">
            <h2>{t("A little guidance", "القليل من الإرشاد")}</h2>
            <Leaf size={20} />
          </div>
          <div className="advice">
            <Face mood={m} small />
            <div>
              <h3>{words.status(m)}</h3>
              <p>
                {m === "unknown"
                  ? t(
                      "Current conditions are unknown. Check the plant directly; do not act on stale sensor data.",
                      "الظروف الحالية غير معروفة. افحص النبات مباشرة ولا تعتمد على بيانات قديمة.",
                    )
                  : m === "thirsty"
                    ? t(
                        "Check the soil with a finger before deciding whether water is needed.",
                        "افحص التربة بإصبعك قبل تحديد الحاجة للري.",
                      )
                    : m === "hot"
                      ? t(
                          "Check heat exposure and consider a cooler, suitable position.",
                          "افحص التعرض للحرارة وفكّر في موضع مناسب أبرد.",
                        )
                      : m === "low-light"
                        ? t(
                            "Check the light conditions and consider a brighter suitable position.",
                            "افحص الإضاءة وفكّر في مكان أكثر إضاءة وملاءمة.",
                          )
                        : t(
                            "No pilot threshold is currently triggered. Keep observing your buddy.",
                            "لم يتم تجاوز أي حد تجريبي حالياً. واصل مراقبة رفيقك.",
                          )}
              </p>
            </div>
          </div>
          <div className="trigger-box">
            <strong>{t("What triggered this?", "ما سبب هذه الإشارة؟")}</strong>
            <p>
              {m === "unknown"
                ? t("No fresh cloud reading available.", "لا توجد قراءة سحابية حديثة.")
                : triggers.length
                  ? triggers.join(" · ")
                  : t(
                      "All three monitored values are within your editable pilot thresholds.",
                      "القيم الثلاث ضمن الحدود التجريبية القابلة للتعديل.",
                    )}
            </p>
          </div>
          <p className="small muted">
            {t(
              "Pilot thresholds need calibration. They are not universal plant recommendations.",
              "الحدود تجريبية وتحتاج معايرة، وليست توصيات عامة للنباتات.",
            )}
          </p>
        </section>
        <section className="panel">
          <div className="section-bar">
            <h2>{t("Care, one small action at a time", "رعاية بخطوة صغيرة كل مرة")}</h2>
          </div>
          <div className="care-actions">
            {[
              { icon: Droplets, en: "Log watering", ar: "تسجيل الري", action: "Watering logged" },
              { icon: Check, en: "Check soil", ar: "فحص التربة", action: "Soil checked" },
              { icon: RotateCw, en: "Rotate plant", ar: "تدوير النبات", action: "Plant rotated" },
            ].map((x) => (
              <button className="button outline" key={x.action} onClick={() => log(x.action)}>
                <x.icon size={18} />
                {t(x.en, x.ar)}
              </button>
            ))}
            <button className="button outline" onClick={() => setObservation(true)}>
              <MessageSquare size={18} />
              {t("Add observation", "إضافة ملاحظة")}
            </button>
          </div>
          <div className="callout">
            <Info size={18} />
            <p>
              {t(
                "Logging watering records your action only. It does not change the sensor moisture reading or reward extra watering.",
                "تسجيل الري يحفظ الإجراء فقط. لا يغيّر قراءة رطوبة المستشعر ولا يكافئ الري الزائد.",
              )}
            </p>
          </div>
        </section>
      </div>
      <section className="panel history-panel">
        <div className="section-bar">
          <h2>{t("Your story of care", "سجل الرعاية")}</h2>
          <Tag color="gray">
            {p.history.length} {t("entries", "سجلات")}
          </Tag>
        </div>
        {p.history.length ? (
          <div className="history-list">
            {p.history.map((e) => (
              <article key={e.id}>
                <span className="history-dot" />
                <div>
                  <strong>{s.lang === "ar" ? actionAr[e.action] || e.action : e.action}</strong>
                  {e.note && (
                    <p>
                      {e.note === "Demo: leaves checked; no visible changes."
                        ? t(e.note, "عرض تجريبي: تم فحص الأوراق، لا تغييرات مرئية.")
                        : e.note}
                    </p>
                  )}
                </div>
                <time>{readingTime(e.at, s.lang)}</time>
              </article>
            ))}
          </div>
        ) : (
          <p className="muted">
            {t("Your next observation starts the story.", "ملاحظتك التالية تبدأ القصة.")}
          </p>
        )}
      </section>
      {edit && <PlantForm plant={p} onClose={() => setEdit(false)} />}
      {observation && (
        <Modal
          title={t("What did you notice?", "ماذا لاحظت؟")}
          onClose={() => setObservation(false)}
        >
          <form
            onSubmit={(e) => {
              e.preventDefault();
              const f = new FormData(e.currentTarget);
              const note = String(f.get("note")).trim();
              if (!note) return;
              log("Observation", note);
              setObservation(false);
            }}
          >
            <label>
              {t("Observation", "الملاحظة")}
              <textarea
                aria-label={t("Observation", "الملاحظة")}
                name="note"
                required
                maxLength={500}
                placeholder={t(
                  "A new leaf, a change in colour, a little growth…",
                  "ورقة جديدة، تغير في اللون، نمو صغير…",
                )}
              />
            </label>
            <button className="button primary full">{t("Save observation", "حفظ الملاحظة")}</button>
          </form>
        </Modal>
      )}
    </>
  );
}
