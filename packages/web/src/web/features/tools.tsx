import { useRef, useState } from "react";
import {
  Wifi,
  WifiOff,
  Cpu,
  Radio,
  Battery,
  Check,
  ArrowRight,
  Plus,
  Info,
  Bell,
  RotateCcw,
  Camera,
  ImagePlus,
  Leaf,
  ShieldCheck,
  Smartphone,
  Settings2,
  X,
} from "lucide-react";
import { useBuddy } from "./context";
import { uid } from "./demo";
import { Modal, Tag, Face } from "./ui";
import { readingTime, usePlantWords } from "./plants";
export function Devices() {
  const { s, t, update, notify } = useBuddy();
  const [pair, setPair] = useState(false);
  const [step, setStep] = useState(0);
  const [dry, setDry] = useState(s.calibration.dry);
  const [wet, setWet] = useState(s.calibration.wet);
  const [error, setError] = useState("");
  const [permission, setPermission] = useState(
    typeof Notification === "undefined" ? "unsupported" : Notification.permission,
  );
  return (
    <>
      <div className="page-heading">
        <div>
          <span className="eyebrow">{t("BEHIND THE LITTLE FACE", "خلف الوجه الصغير")}</span>
          <h1>{t("Devices & little details", "الأجهزة والتفاصيل الصغيرة")}</h1>
          <p>
            {t(
              "Explore the planned setup. Everything here is simulated.",
              "استكشف الإعداد المخطط. كل ما هنا محاكاة.",
            )}
          </p>
        </div>
        <button
          className="button primary"
          onClick={() => {
            setPair(true);
            setStep(0);
          }}
        >
          <Plus size={18} />
          {t("Try simulated pairing", "جرّب الاقتران المحاكى")}
        </button>
      </div>
      <div className="callout">
        <Info size={20} />
        <p>
          {t(
            "No hardware is connected. Pairing, connectivity, battery levels, and sync are demo examples. No Wi-Fi credentials are collected.",
            "لا توجد أجهزة متصلة. الاقتران والاتصال والبطاريات والمزامنة أمثلة تجريبية. لا يتم جمع بيانات الواي فاي.",
          )}
        </p>
      </div>
      <div className="two-columns">
        <section className="panel">
          <div className="section-bar">
            <h2>{t("Your demo device family", "عائلة أجهزتك التجريبية")}</h2>
            <Tag color="gray">{t("Simulated", "محاكاة")}</Tag>
          </div>
          <div className="devices-list">
            {s.devices.map((d) => (
              <div className="device-row" key={d.id}>
                <span className={`device-icon ${d.type === "hub" ? "hub" : ""}`}>
                  {d.type === "hub" ? <Cpu size={25} /> : <Face small />}
                </span>
                <div>
                  <strong>
                    {d.type === "hub"
                      ? t("Mother hub", "المحطة الأم")
                      : t(d.name, d.name.replace("Plant node", "عقدة نبات"))}
                  </strong>
                  <small>
                    {d.id} · {d.type === "hub" ? "ESP32-S3" : "ESP32-C3"}
                  </small>
                  <span className="small">
                    {s.disconnected
                      ? t(
                          "Demo offline · local sensing continues",
                          "دون اتصال تجريبياً · الاستشعار المحلي مستمر",
                        )
                      : t(
                          "Demo paired · not physically connected",
                          "مقترن تجريبياً · غير متصل فعلياً",
                        )}
                  </span>
                </div>
                <span className="battery">
                  <Battery size={17} />
                  {d.battery}%
                </span>
              </div>
            ))}
          </div>
        </section>
        <div>
          <section className="panel connection-panel">
            <div className="section-bar">
              <h2>{t("Connection-loss demo", "محاكاة فقدان الاتصال")}</h2>
              {s.disconnected ? <WifiOff size={21} /> : <Wifi size={21} />}
            </div>
            <div className="toggle-row">
              <div>
                <strong>{t("Simulate Wi-Fi unavailable", "محاكاة غياب الواي فاي")}</strong>
                <small>
                  {t(
                    "Local sensing stays on. Cloud readings become stale.",
                    "الاستشعار المحلي مستمر. القراءات السحابية تصبح قديمة.",
                  )}
                </small>
              </div>
              <button
                className={`switch ${s.disconnected ? "on" : ""}`}
                role="switch"
                aria-label={t("Simulate connection loss", "محاكاة فقدان الاتصال")}
                aria-checked={s.disconnected}
                onClick={() => {
                  update((old) => ({
                    ...old,
                    disconnected: !old.disconnected,
                    lastSync: old.disconnected ? new Date().toISOString() : old.lastSync,
                    queued: old.disconnected ? 0 : old.queued,
                  }));
                  notify(
                    s.disconnected
                      ? t(
                          "Demo connection restored; queued samples marked synced. Cloud sample values are unchanged.",
                          "استعيد الاتصال التجريبي ووُسمت العينات بالمزامنة. قيم القراءات لم تتغير.",
                        )
                      : t(
                          "Demo offline. Local sensing is still running.",
                          "دون اتصال تجريبياً. الاستشعار المحلي مستمر.",
                        ),
                  );
                }}
              >
                <span />
              </button>
            </div>
            <div className="sync-info">
              <div>
                <span>{t("Local sensing", "الاستشعار المحلي")}</span>
                <Tag>{t("Running · simulated", "يعمل · محاكاة")}</Tag>
              </div>
              <div>
                <span>{t("Cloud sample status", "حالة العينة السحابية")}</span>
                <strong>
                  {s.disconnected
                    ? t("Stale", "قديمة")
                    : t("Demo sync available", "مزامنة تجريبية متاحة")}
                </strong>
              </div>
              <div>
                <span>{t("Latest demo sync", "آخر مزامنة تجريبية")}</span>
                <strong>{readingTime(s.lastSync, s.lang)}</strong>
              </div>
              <div>
                <span>{t("Queued local samples", "العينات المحلية المنتظرة")}</span>
                <strong>{s.queued}</strong>
              </div>
              {s.localSample && (
                <div>
                  <span>{t("Last simulated local sample", "آخر عينة محلية محاكاة")}</span>
                  <strong>{readingTime(s.localSample, s.lang)}</strong>
                </div>
              )}
            </div>
            <button
              className="button outline full"
              onClick={() => {
                const at = new Date().toISOString();
                update((old) => ({
                  ...old,
                  localSample: at,
                  queued: old.disconnected ? old.queued + 1 : 0,
                  lastSync: old.disconnected ? old.lastSync : at,
                }));
                notify(
                  t(
                    "Simulated local sample recorded. Seeded measurement values remain unchanged.",
                    "تم تسجيل عينة محلية محاكاة. القيم النموذجية لم تتغير.",
                  ),
                );
              }}
            >
              <Radio size={17} />
              {t("Simulate a local sample", "محاكاة عينة محلية")}
            </button>
            <p className="small muted">
              {t(
                "This is a manual simulation, not a running sensor or a real sync service. Reconnecting clears the simulated queue only.",
                "هذه محاكاة يدوية وليست مستشعراً أو خدمة مزامنة فعلية. إعادة الاتصال تمسح قائمة الانتظار التجريبية فقط.",
              )}
            </p>
          </section>
          <section className="panel">
            <h2>{t("Sampling rhythm", "جدول أخذ العينات")}</h2>
            <label>
              {t("Planned sampling interval", "الفاصل المخطط للقياس")}
              <select
                value={s.interval}
                onChange={(e) => {
                  update((old) => ({ ...old, interval: Number(e.target.value) }));
                  notify(
                    t(
                      "Demo interval saved. No hardware settings were sent.",
                      "تم حفظ الفاصل التجريبي. لم ترسل إعدادات لأجهزة.",
                    ),
                  );
                }}
              >
                {[5, 15, 30, 60].map((n) => (
                  <option key={n} value={n}>
                    {n} {t("minutes", "دقيقة")}
                  </option>
                ))}
              </select>
            </label>
            <p className="small muted">
              {t(
                "Saved locally as a pilot preference; physical scheduling requires firmware validation.",
                "يحفظ محلياً كتفضيل تجريبي؛ جدولة الأجهزة تحتاج للتحقق من البرنامج الثابت.",
              )}
            </p>
          </section>
        </div>
      </div>
      <div className="two-columns">
        <section className="panel">
          <div className="section-bar">
            <h2>{t("Get to know your soil", "تعرّف على تربتك")}</h2>
            <Settings2 size={20} />
          </div>
          <p>
            {t(
              "A capacitive probe needs dry/wet reference points for each soil and setup. Calibrate in a dry reference, then in a wet reference following safe bench procedures. Do not submerge electronics.",
              "يحتاج المسبار السعوي إلى مرجع جاف ورطب لكل تربة وإعداد. عاير بمرجع جاف ثم رطب وفق إجراءات اختبار آمنة. لا تغمر الإلكترونيات.",
            )}
          </p>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (dry === wet) {
                setError(
                  t("Dry and wet values must be different.", "يجب أن تختلف قيمة الجاف عن الرطب."),
                );
                return;
              }
              setError("");
              update((old) => ({ ...old, calibration: { dry, wet } }));
              notify(
                t("Pilot calibration references saved locally", "تم حفظ مراجع المعايرة محلياً"),
              );
            }}
          >
            <div className="form-grid">
              <label>
                {t("Dry reference (raw ADC)", "مرجع جاف (ADC خام)")}
                <input
                  type="number"
                  min="0"
                  max="4095"
                  required
                  aria-label={t("Dry reference (raw ADC)", "مرجع جاف (ADC خام)")}
                  value={dry}
                  onChange={(e) => setDry(Number(e.target.value))}
                />
              </label>
              <label>
                {t("Wet reference (raw ADC)", "مرجع رطب (ADC خام)")}
                <input
                  type="number"
                  min="0"
                  max="4095"
                  required
                  aria-label={t("Wet reference (raw ADC)", "مرجع رطب (ADC خام)")}
                  value={wet}
                  onChange={(e) => setWet(Number(e.target.value))}
                />
              </label>
            </div>
            {error && (
              <p role="alert" className="error">
                {error}
              </p>
            )}
            <div className="formula" dir="ltr">
              relative % = clamp((raw − dry) ÷ (wet − dry) × 100, 0, 100)
            </div>
            <p className="small muted">
              {t(
                "Illustrative 12-bit ADC examples; exact board configuration is pending validation. Relative percentage is not laboratory volumetric water content. Saving does not recompute seeded readings.",
                "أمثلة توضيحية لمحول ١٢ بت؛ إعداد اللوحة الفعلي قيد التحقق. النسبة النسبية ليست محتوى مائياً حجمياً مخبرياً. الحفظ لا يعيد حساب القراءات التجريبية.",
              )}
            </p>
            <button className="button outline" type="submit">
              <Check size={17} />
              {t("Save pilot references", "حفظ المراجع التجريبية")}
            </button>
          </form>
        </section>
        <section className="panel">
          <div className="section-bar">
            <h2>{t("App preferences", "تفضيلات التطبيق")}</h2>
            <Bell size={20} />
          </div>
          <h3>{t("Notification permission", "إذن الإشعارات")}</h3>
          <p>
            {t(
              "In-app reminders work here. Browser notification permission depends on your platform and secure context. Background push has not been implemented.",
              "تعمل التذكيرات داخل التطبيق. إذن إشعارات المتصفح يعتمد على المنصة والاتصال الآمن. الدفع في الخلفية لم يتم تنفيذه.",
            )}
          </p>
          <Tag color="gray">
            {t("Browser permission", "إذن المتصفح")}:{" "}
            {t(
              permission,
              { default: "لم يحدد", granted: "مسموح", denied: "مرفوض", unsupported: "غير مدعوم" }[
                permission
              ] || permission,
            )}
          </Tag>
          <button
            className="button outline full"
            disabled={
              permission === "unsupported" || permission === "denied" || permission === "granted"
            }
            onClick={async () => {
              try {
                const p = await Notification.requestPermission();
                setPermission(p);
                update((old) => ({ ...old, notificationEnabled: p === "granted" }));
                notify(
                  p === "granted"
                    ? t(
                        "Permission granted. Background push is still not connected.",
                        "تم منح الإذن. الدفع في الخلفية غير متصل.",
                      )
                    : t(
                        "Permission was not granted. In-app reminders still work.",
                        "لم يمنح الإذن. التذكيرات داخل التطبيق تعمل.",
                      ),
                );
              } catch {
                notify(
                  t(
                    "This platform could not request notifications.",
                    "تعذر طلب الإشعارات على هذه المنصة.",
                  ),
                );
              }
            }}
          >
            <Bell size={17} />
            {t("Request browser permission", "طلب إذن المتصفح")}
          </button>
          <hr />
          <h3>{t("A fresh start", "بداية جديدة")}</h3>
          <p>
            {t(
              "Reset removes your local plants, tasks, history, and preferences and restores the seeded demo.",
              "إعادة الضبط تزيل النباتات والمهام والسجل والتفضيلات المحلية وتستعيد العرض الأصلي.",
            )}
          </p>
          <button
            className="button danger-outline"
            onClick={() => {
              if (
                confirm(
                  t(
                    "Reset all local demo data? This cannot be undone.",
                    "إعادة ضبط كل البيانات المحلية؟ لا يمكن التراجع.",
                  ),
                )
              ) {
                localStorage.removeItem("gardening-buddy-v1");
                window.location.href = "/app";
              }
            }}
          >
            <RotateCcw size={16} />
            {t("Reset demo data", "إعادة ضبط العرض")}
          </button>
        </section>
      </div>
      <section className="panel architecture">
        <div className="section-bar">
          <h2>{t("The bigger picture", "الصورة الأكبر")}</h2>
          <Tag color="amber">{t("Planned architecture", "البنية المخططة")}</Tag>
        </div>
        <div className="architecture-flow">
          {[
            { icon: Leaf, title: t("Plant node", "عقدة النبات"), sub: "ESP32-C3" },
            { icon: Cpu, title: t("Mother hub", "المحطة الأم"), sub: "ESP32-S3" },
            {
              icon: ShieldCheck,
              title: t("Authenticated backend", "خادم موثّق"),
              sub: t("Not connected", "غير متصل"),
            },
            {
              icon: Smartphone,
              title: t("Your app", "تطبيقك"),
              sub: t("Local demo adapter", "محوّل بيانات محلي"),
            },
          ].map((x, i) => (
            <div className="architecture-item" key={x.title}>
              <x.icon size={27} />
              <strong>{x.title}</strong>
              <small>{x.sub}</small>
              {i < 3 && <ArrowRight className="flow-arrow" size={18} />}
            </div>
          ))}
        </div>
        <div className="hardware-note">
          <p>
            <strong>{t("Selected prototype hardware: ", "أجهزة النموذج المختارة: ")}</strong>
            {t(
              "ESP32-C3 nodes, capacitive moisture probe, AHT20 + BMP280 temperature/humidity combo, a light sensor, small LCD, and USB-C rechargeable battery. ESP32-S3 mother hub with display and buttons. No pH sensor.",
              "عقد ESP32-C3 ومسبار رطوبة سعوي ووحدة AHT20 + BMP280 للحرارة والرطوبة ومستشعر ضوء وشاشة LCD صغيرة وبطارية قابلة للشحن عبر USB-C. محطة ESP32-S3 بشاشة وأزرار. دون مستشعر حموضة.",
            )}
          </p>
          <p>
            {t(
              "Exact board/display variants and power design await bench verification. Device transport, queue persistence, authenticated backend, and real synchronization remain pending physical validation.",
              "إصدارات اللوحات والشاشات وتصميم الطاقة بانتظار الاختبار. نقل بيانات الأجهزة وحفظ الطابور والخادم الموثّق والمزامنة الحقيقية تحتاج تحققاً فعلياً.",
            )}
          </p>
        </div>
      </section>
      {pair && (
        <Modal title={t("A simulated hello", "ترحيب محاكى")} onClose={() => setPair(false)}>
          <div className="pair-progress">
            {[0, 1, 2].map((i) => (
              <span key={i} className={step >= i ? "active" : ""} />
            ))}
          </div>
          <div className="pair-body">
            <div className="pair-device">
              <Face />
            </div>
            <Tag color="amber">{t("SIMULATION ONLY", "محاكاة فقط")}</Tag>
            <h2>
              {
                [
                  t("Wake up your buddy", "أيقظ رفيقك"),
                  t("Find the mother hub", "اعثر على المحطة الأم"),
                  t("Give your node a home", "امنح العقدة موطناً"),
                ][step]
              }
            </h2>
            <p>
              {
                [
                  t(
                    "In a real setup, charge the node and start its pairing flow. Here, tap next to simulate that step.",
                    "في الإعداد الفعلي اشحن العقدة وابدأ الاقتران. هنا اضغط التالي لمحاكاة الخطوة.",
                  ),
                  t(
                    "The planned node-to-hub transport is not yet validated. No Bluetooth or Wi-Fi scanning is occurring.",
                    "وسيلة اتصال العقدة بالمحطة لم تتحقق بعد. لا يوجد مسح بلوتوث أو واي فاي.",
                  ),
                  t(
                    "Finish to add a sample node to your local demo device list. It will not create real readings.",
                    "أكمل لإضافة عقدة نموذجية لقائمة الأجهزة المحلية. لن تُنشئ قراءات حقيقية.",
                  ),
                ][step]
              }
            </p>
          </div>
          <button
            className="button primary full"
            onClick={() => {
              if (step < 2) setStep(step + 1);
              else {
                update((old) => ({
                  ...old,
                  devices: [
                    ...old.devices,
                    {
                      id: `DEMO-${uid().slice(0, 6)}`,
                      name: `Plant node ${old.devices.length}`,
                      type: "node",
                      battery: 100,
                      paired: true,
                    },
                  ],
                }));
                setPair(false);
                notify(
                  t(
                    "Sample node added. No hardware connected.",
                    "تمت إضافة عقدة نموذجية. لا جهاز فعلي متصل.",
                  ),
                );
              }
            }}
          >
            {step < 2
              ? t("Next simulated step", "الخطوة المحاكاة التالية")
              : t("Finish simulated pairing", "إنهاء الاقتران المحاكى")}
            <ArrowRight size={18} />
          </button>
        </Modal>
      )}
    </>
  );
}
export function PhotoTool() {
  const { s, t, update, notify } = useBuddy();
  const [image, setImage] = useState("");
  const [error, setError] = useState("");
  const [saved, setSaved] = useState(false);
  const input = useRef<HTMLInputElement>(null);
  const words = usePlantWords();
  return (
    <>
      <div className="page-heading">
        <div>
          <span className="eyebrow">{t("NOTICE THE LITTLE THINGS", "لاحظ التفاصيل الصغيرة")}</span>
          <h1>{t("A moment, captured.", "لحظة، محفوظة.")}</h1>
          <p>{t("Bring your own photo. Add your own observations.", "أضف صورتك واكتب ملاحظاتك.")}</p>
        </div>
        <Camera size={32} />
      </div>
      <div className="two-columns photo-layout">
        <section className="panel">
          <div className="section-bar">
            <h2>{t("Your plant photo", "صورة نباتك")}</h2>
            <Tag color="green">{t("Stays in your browser", "تبقى في متصفحك")}</Tag>
          </div>
          <input
            className="sr-only"
            ref={input}
            type="file"
            accept="image/jpeg,image/png,image/webp,image/gif"
            aria-label={t("Choose a local plant image", "اختر صورة نبات محلية")}
            onChange={(e) => {
              setError("");
              setSaved(false);
              const file = e.target.files?.[0];
              if (!file) return;
              if (!file.type.startsWith("image/") || file.size > 5 * 1024 * 1024) {
                setError(
                  t("Choose an image smaller than 5 MB.", "اختر صورة بحجم أقل من ٥ ميغابايت."),
                );
                e.target.value = "";
                return;
              }
              const r = new FileReader();
              r.onload = () => setImage(String(r.result));
              r.readAsDataURL(file);
            }}
          />
          {image ? (
            <div className="photo-preview">
              <img
                src={image}
                alt={t("Your selected plant photograph", "صورة النبات التي اخترتها")}
              />
              <button
                className="icon-btn"
                onClick={() => {
                  setImage("");
                  setSaved(false);
                  if (input.current) input.current.value = "";
                }}
                aria-label={t("Remove selected photo", "إزالة الصورة")}
              >
                <X size={19} />
              </button>
            </div>
          ) : (
            <button className="photo-dropzone" onClick={() => input.current?.click()}>
              <span className="stat-icon sage">
                <ImagePlus size={35} />
              </span>
              <h3>{t("A little photo of your buddy", "صورة صغيرة لرفيقك")}</h3>
              <p>{t("Choose a photo from this device", "اختر صورة من هذا الجهاز")}</p>
              <span className="button outline">{t("Choose local image", "اختيار صورة محلية")}</span>
              <small>JPG, PNG, WebP, GIF · {t("Up to 5 MB", "حتى ٥ ميغابايت")}</small>
            </button>
          )}
          {error && (
            <p className="error" role="alert">
              {error}
            </p>
          )}
          <p className="small muted">
            {t(
              "Photos are previewed only, never uploaded. Saved observations persist, but the image itself is not retained after you leave this tool.",
              "الصور للمعاينة فقط ولا تُرفع. الملاحظات المحفوظة تبقى، لكن الصورة لا تُحفظ بعد مغادرة الأداة.",
            )}
          </p>
        </section>
        <div>
          <section className="panel">
            <h2>{t("What do you see?", "ماذا ترى؟")}</h2>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                const f = new FormData(e.currentTarget);
                const name = String(f.get("name")).trim();
                const note = String(f.get("note")).trim();
                const plantId = String(f.get("plant"));
                if (!name || !note || !image) return;
                update((old) => ({
                  ...old,
                  plants: old.plants.map((p) =>
                    p.id === plantId
                      ? {
                          ...p,
                          history: [
                            {
                              id: uid(),
                              at: new Date().toISOString(),
                              action: "Observation",
                              note: `${name}: ${note}`,
                            },
                            ...p.history,
                          ],
                        }
                      : p,
                  ),
                }));
                setSaved(true);
                notify(
                  t(
                    "Your photo observation was saved to the plant’s care history. Image was not uploaded.",
                    "حفظت ملاحظتك في سجل رعاية النبات. لم تُرفع الصورة.",
                  ),
                );
              }}
            >
              <label>
                {t("Plant name (your identification)", "اسم النبات (تحديدك أنت)")}
                <input
                  aria-label={t("Plant name (your identification)", "اسم النبات (تحديدك أنت)")}
                  name="name"
                  required
                  maxLength={60}
                  placeholder={t("e.g. Sweet basil", "مثلاً: ريحان حلو")}
                />
              </label>
              <label>
                {t("Save observation to", "حفظ الملاحظة في")}
                <select required name="plant">
                  <option value="">{t("Choose a saved plant", "اختر نباتاً محفوظاً")}</option>
                  {s.plants.map((p) => (
                    <option value={p.id} key={p.id}>
                      {words.name(p)}
                    </option>
                  ))}
                </select>
              </label>
              <label>
                {t("Your observations", "ملاحظاتك")}
                <textarea
                  aria-label={t("Your observations", "ملاحظاتك")}
                  name="note"
                  maxLength={500}
                  required
                  placeholder={t(
                    "What changed? What would you like to check?",
                    "ما الذي تغير؟ ماذا تريد أن تفحص؟",
                  )}
                />
              </label>
              <button
                disabled={!image || saved || s.plants.length === 0}
                className="button primary full"
              >
                {saved ? <Check size={18} /> : <Leaf size={18} />}
                {saved
                  ? t("Observation saved", "تم حفظ الملاحظة")
                  : t("Save my observation", "حفظ ملاحظتي")}
              </button>
              {!image && (
                <p className="small muted">
                  {t("Select a photo to save a photo observation.", "اختر صورة لحفظ ملاحظة مصوّرة.")}
                </p>
              )}
            </form>
          </section>
          <section className="future-feature">
            <Tag color="amber">{t("NOT CONNECTED", "غير متصل")}</Tag>
            <h3>{t("Your eye is the expert here.", "عينك هي الخبير هنا.")}</h3>
            <p>
              {t(
                "Automated plant identification and disease analysis are future optional services. This prototype does not identify plants, diagnose disease, or suggest treatments from images.",
                "التعرف الآلي على النباتات وتحليل الأمراض خدمات مستقبلية اختيارية. هذا النموذج لا يحدد النباتات أو يشخص الأمراض أو يقترح علاجات من الصور.",
              )}
            </p>
            <p className="small">
              {t(
                "Repotting is a user-scheduled reminder in the care plan—not something these sensors detect.",
                "تغيير الوعاء تذكير يحدده المستخدم في خطة الرعاية، وليس أمراً تكتشفه هذه المستشعرات.",
              )}
            </p>
          </section>
        </div>
      </div>
    </>
  );
}
