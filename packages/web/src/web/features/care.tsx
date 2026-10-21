import { useState } from "react";
import {
  Plus,
  CalendarDays,
  Check,
  Leaf,
  Sun,
  Bell,
  Trash2,
  ChevronLeft,
  ChevronRight,
  Award,
  Printer,
  GraduationCap,
  Trophy,
  ArrowUpRight,
} from "lucide-react";
import { useBuddy } from "./context";
import { dayKey, uid, streak, type Task } from "./demo";
import { Modal, Tag } from "./ui";
import { usePlantWords } from "./plants";
export function CarePlan() {
  const { s, t, update, notify } = useBuddy();
  const [adding, setAdding] = useState(false);
  const [filter, setFilter] = useState<"all" | "today" | "done">("all");
  const [month, setMonth] = useState(new Date(new Date().getFullYear(), new Date().getMonth(), 1));
  const [selected, setSelected] = useState<string | null>(null);
  const words = usePlantWords();
  const overdue = s.tasks.filter((x) => !x.done && x.due < dayKey()).length;
  const visible = s.tasks
    .filter(
      (x) =>
        (filter === "done" ? x.done : !x.done) &&
        (filter !== "today" || x.due <= dayKey()) &&
        (!selected || x.due === selected),
    )
    .sort((a, b) => a.due.localeCompare(b.due));
  const complete = (task: Task) => {
    update((old) => ({
      ...old,
      tasks: old.tasks.map((x) =>
        x.id === task.id
          ? { ...x, done: !x.done, completedAt: !x.done ? new Date().toISOString() : undefined }
          : x,
      ),
      checkins:
        !task.done && !old.checkins.includes(dayKey()) ? [...old.checkins, dayKey()] : old.checkins,
      plants: !task.done
        ? old.plants.map((p) =>
            p.id === task.plantId
              ? {
                  ...p,
                  history: [
                    {
                      id: uid(),
                      at: new Date().toISOString(),
                      action: "Task completed",
                      note: task.title,
                    },
                    ...p.history,
                  ],
                }
              : p,
          )
        : old.plants,
    }));
    notify(
      task.done
        ? t("Task reopened", "أعيد فتح المهمة")
        : t("A little care, completed.", "تمت خطوة رعاية صغيرة."),
    );
  };
  const totalDays = new Date(month.getFullYear(), month.getMonth() + 1, 0).getDate();
  return (
    <>
      <div className="page-heading">
        <div>
          <span className="eyebrow">
            {t("MAKE A LITTLE ROOM FOR CARE", "افسح مجالاً صغيراً للرعاية")}
          </span>
          <h1>{t("Your care rhythm", "روتين الرعاية")}</h1>
          <p>
            {t(
              "Gentle reminders. Thoughtful habits. No overwatering rewards.",
              "تذكيرات لطيفة وعادات مدروسة، دون مكافأة الري الزائد.",
            )}
          </p>
        </div>
        <button className="button primary" onClick={() => setAdding(true)}>
          <Plus size={18} />
          {t("Add care task", "إضافة مهمة")}
        </button>
      </div>
      <div className="care-stats">
        <div>
          <CalendarDays />
          <strong>{s.tasks.filter((x) => !x.done).length}</strong>
          <span>{t("Upcoming & open", "قادمة ومفتوحة")}</span>
        </div>
        <div>
          <Bell />
          <strong>{overdue}</strong>
          <span>{t("Gentle overdue nudges", "تذكيرات متأخرة")}</span>
        </div>
        <div>
          <Check />
          <strong>{s.tasks.filter((x) => x.done).length}</strong>
          <span>{t("Moments of care", "لحظات رعاية")}</span>
        </div>
        <div>
          <Sun />
          <strong>{streak(s.checkins)}</strong>
          <span>{t("Day care streak", "أيام رعاية متتالية")}</span>
        </div>
      </div>
      <div className="care-layout">
        <section className="panel">
          <div className="section-bar">
            <h2>{t("Little things to do", "أشياء صغيرة لفعلها")}</h2>
            <div className="segmented">
              {(["all", "today", "done"] as const).map((v, i) => (
                <button
                  className={filter === v ? "active" : ""}
                  onClick={() => setFilter(v)}
                  key={v}
                >
                  {
                    [t("Upcoming", "القادمة"), t("Due now", "المستحقة"), t("Completed", "المنجزة")][
                      i
                    ]
                  }
                </button>
              ))}
            </div>
          </div>
          {selected && (
            <button className="text-link" onClick={() => setSelected(null)}>
              {selected} · {t("Clear date filter", "مسح مرشح التاريخ")} ×
            </button>
          )}
          {visible.length ? (
            visible.map((task) => {
              const plant = s.plants.find((p) => p.id === task.plantId);
              return (
                <div className={`task-row ${task.done ? "done" : ""}`} key={task.id}>
                  <button
                    className="task-check"
                    aria-label={t(
                      task.done ? "Reopen task" : "Complete task",
                      task.done ? "إعادة فتح المهمة" : "إنجاز المهمة",
                    )}
                    aria-pressed={task.done}
                    onClick={() => complete(task)}
                  >
                    {task.done && <Check size={16} />}
                  </button>
                  <div>
                    <strong>{s.lang === "ar" ? task.arTitle || task.title : task.title}</strong>
                    <span>
                      {plant ? words.name(plant) : t("Whole garden", "الحديقة كاملة")} · {task.due}
                    </span>
                    {!task.done && task.due < dayKey() && (
                      <Tag color="amber">{t("Overdue", "متأخر")}</Tag>
                    )}
                    {task.type === "repot" && (
                      <small>
                        {t(
                          "User-scheduled repot reminder · not sensed",
                          "تذكير تغيير وعاء حدده المستخدم · ليس مستشعراً",
                        )}
                      </small>
                    )}
                  </div>
                  <button
                    className="icon-btn subtle"
                    aria-label={t("Delete task", "حذف المهمة")}
                    onClick={() => {
                      if (confirm(t("Delete this care task?", "حذف مهمة الرعاية؟")))
                        update((old) => ({
                          ...old,
                          tasks: old.tasks.filter((x) => x.id !== task.id),
                        }));
                    }}
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              );
            })
          ) : (
            <div className="empty">
              <Leaf size={35} />
              <h3>{t("A little breathing room", "مساحة صغيرة للراحة")}</h3>
              <p>
                {t(
                  "No tasks in this view. Add a care moment when you need one.",
                  "لا توجد مهام في هذا العرض. أضف لحظة رعاية عند الحاجة.",
                )}
              </p>
            </div>
          )}
        </section>
        <aside>
          <section className="panel calendar">
            <div className="section-bar">
              <button
                className="icon-btn"
                aria-label={t("Previous month", "الشهر السابق")}
                onClick={() => setMonth(new Date(month.getFullYear(), month.getMonth() - 1, 1))}
              >
                <ChevronLeft size={18} />
              </button>
              <h3>
                {month.toLocaleDateString(s.lang === "ar" ? "ar-BH" : "en-GB", {
                  month: "long",
                  year: "numeric",
                })}
              </h3>
              <button
                className="icon-btn"
                aria-label={t("Next month", "الشهر التالي")}
                onClick={() => setMonth(new Date(month.getFullYear(), month.getMonth() + 1, 1))}
              >
                <ChevronRight size={18} />
              </button>
            </div>
            <div className="calendar-grid">
              {(s.lang === "en"
                ? ["S", "M", "T", "W", "T", "F", "S"]
                : ["ح", "ن", "ث", "ر", "خ", "ج", "س"]
              ).map((v, i) => (
                <span className="weekday" key={`w${i}`}>
                  {v}
                </span>
              ))}
              {Array.from({ length: month.getDay() }, (_, i) => (
                <span key={`pad${i}`} />
              ))}
              {Array.from({ length: totalDays }, (_, i) => {
                const key = dayKey(new Date(month.getFullYear(), month.getMonth(), i + 1));
                return (
                  <button
                    key={key}
                    className={`${key === dayKey() ? "today" : ""} ${selected === key ? "selected" : ""}`}
                    onClick={() => setSelected(selected === key ? null : key)}
                    aria-label={`${key} · ${s.tasks.filter((x) => x.due === key).length} ${t("tasks", "مهام")}`}
                    aria-pressed={selected === key}
                  >
                    {i + 1}
                    {s.tasks.some((x) => x.due === key && !x.done) && <i />}
                  </button>
                );
              })}
            </div>
            <p className="small muted">
              {t(
                "Select a day to filter tasks. Dots mark open tasks.",
                "اختر يوماً لتصفية المهام. النقاط تعني مهام مفتوحة.",
              )}
            </p>
          </section>
          <div className="tip-card">
            <Bell size={23} />
            <h3>{t("Reminders, right here.", "تذكيرات هنا، تماماً.")}</h3>
            <p>
              {t(
                "Overdue and due-today tasks appear inside the app. Browser notifications require permission and platform support; background push is not connected.",
                "المهام المتأخرة والمستحقة اليوم تظهر في التطبيق. إشعارات المتصفح تحتاج إذناً ودعماً من المنصة؛ الدفع في الخلفية غير متصل.",
              )}
            </p>
          </div>
        </aside>
      </div>
      {adding && (
        <Modal
          title={t("Plan a little care", "خطط لقليل من الرعاية")}
          onClose={() => setAdding(false)}
        >
          <form
            onSubmit={(e) => {
              e.preventDefault();
              const f = new FormData(e.currentTarget);
              const title = String(f.get("title")).trim();
              if (!title) return;
              update((old) => ({
                ...old,
                tasks: [
                  ...old.tasks,
                  {
                    id: uid(),
                    title,
                    plantId: String(f.get("plant")),
                    due: String(f.get("due")),
                    type: String(f.get("type")) as Task["type"],
                    done: false,
                  },
                ],
              }));
              notify(t("Care task added", "تمت إضافة مهمة"));
              setAdding(false);
            }}
          >
            <label>
              {t("What would you like to do?", "ماذا تريد أن تفعل؟")}
              <input
                aria-label={t("Care task title", "عنوان مهمة الرعاية")}
                name="title"
                required
                maxLength={100}
              />
            </label>
            <label>
              {t("Plant buddy", "رفيق النبات")}
              <select name="plant">
                <option value="">{t("Whole garden", "الحديقة كاملة")}</option>
                {s.plants.map((p) => (
                  <option value={p.id} key={p.id}>
                    {words.name(p)}
                  </option>
                ))}
              </select>
            </label>
            <div className="form-grid">
              <label>
                {t("Date (local calendar)", "التاريخ (التقويم المحلي)")}
                <input
                  type="date"
                  aria-label={t("Date (local calendar)", "التاريخ (التقويم المحلي)")}
                  name="due"
                  required
                  defaultValue={dayKey()}
                />
              </label>
              <label>
                {t("Care type", "نوع الرعاية")}
                <select name="type">
                  <option value="check">{t("Observation / check", "ملاحظة / فحص")}</option>
                  <option value="repot">{t("Repot reminder", "تذكير تغيير الوعاء")}</option>
                  <option value="other">{t("Other care", "رعاية أخرى")}</option>
                </select>
              </label>
            </div>
            <button className="button primary full">
              {t("Add to care plan", "إضافة لخطة الرعاية")}
            </button>
          </form>
        </Modal>
      )}
    </>
  );
}
export function Schools() {
  const { s, t, update, notify } = useBuddy();
  const [certificate, setCertificate] = useState(false);
  const [group, setGroup] = useState("A");
  const completed = s.tasks.filter((x) => x.done).length;
  const observations = s.plants.reduce(
    (n, p) =>
      n + p.history.filter((e) => e.action === "Observation" && !e.note.startsWith("Demo:")).length,
    0,
  );
  const points = completed + observations;
  const teams = [
    { name: t("The Green Shoots", "البراعم الخضراء"), n: 8, color: "sage" },
    { name: t("Sunshine Crew", "فريق الشمس"), n: 6, color: "peach" },
    { name: t("Your garden team", "فريق حديقتك"), n: points, color: "lime" },
  ].sort((a, b) => b.n - a.n);
  return (
    <>
      <div className="page-heading">
        <div>
          <span className="eyebrow">
            {t("TEACHER VIEW · GRADES 1–12", "عرض المعلم · الصفوف ١–١٢")}
          </span>
          <h1>{t("Growing minds, together.", "عقول تنمو معاً.")}</h1>
          <p>
            {t(
              "A living classroom, one curious observation at a time.",
              "صف حي، بملاحظة فضولية كل مرة.",
            )}
          </p>
        </div>
        <button className="button outline" onClick={() => setCertificate(true)}>
          <Award size={18} />
          {t("Certificate preview", "معاينة الشهادة")}
        </button>
      </div>
      <div className="callout demo-school">
        <GraduationCap size={20} />
        <p>
          {t(
            "Demo school workspace. Team names and sample scores are fictional. No student names or personal information are collected.",
            "مساحة مدرسة تجريبية. أسماء الفرق والنقاط النموذجية خيالية. لا نجمع أسماء الطلاب أو معلوماتهم الشخصية.",
          )}
        </p>
      </div>
      <div className="school-overview">
        <section className="garden-greeting">
          <div>
            <Tag color="cream">{t("LEARNING THAT GROWS", "تعلّم ينمو")}</Tag>
            <h2>
              {t("A classroom full", "صف مليء")}
              <br />
              {t("of possibility.", "بالاحتمالات.")}
            </h2>
            <p>{t("Notice. Discuss. Take a thoughtful action.", "لاحظ. ناقش. اتخذ خطوة مدروسة.")}</p>
          </div>
          <GraduationCap size={100} strokeWidth={1} />
        </section>
        <section className="panel class-groups">
          <h2>{t("Class groups", "مجموعات الصف")}</h2>
          <div className="segmented">
            {["A", "B", "C"].map((x) => (
              <button key={x} className={group === x ? "active" : ""} onClick={() => setGroup(x)}>
                {t("Group", "مجموعة")} {x}
              </button>
            ))}
          </div>
          <p>
            {group === "A"
              ? t("Herb explorers · demo class", "مستكشفو الأعشاب · صف تجريبي")
              : group === "B"
                ? t("Pollinator pals · demo class", "أصدقاء التلقيح · صف تجريبي")
                : t("Seed detectives · demo class", "محققو البذور · صف تجريبي")}
          </p>
          <span className="small muted">
            {t(
              "Shared garden participation — no individual student tracking.",
              "مشاركة الحديقة المشتركة — دون تتبع طلاب أفراد.",
            )}
          </span>
          <div className="progress-bar">
            <span style={{ width: `${Math.min(100, (points / 10) * 100)}%` }} />
          </div>
          <strong>
            {points} / 10 {t("class participation goal", "هدف مشاركة الصف")}
          </strong>
        </section>
      </div>
      <div className="two-columns">
        <section className="panel">
          <div className="section-bar">
            <h2>{t("Participation leaderboard", "ترتيب المشاركة")}</h2>
            <Trophy size={21} />
          </div>
          <p className="small muted">
            {t(
              "One point per observation or completed task. Never water quantity. Demo comparison teams are fixed examples.",
              "نقطة لكل ملاحظة أو مهمة منجزة. ليس لكمية الري. فرق المقارنة أمثلة ثابتة.",
            )}
          </p>
          {teams.map((team, i) => (
            <div className="leaderboard-row" key={team.name}>
              <span className="rank">{i + 1}</span>
              <span className={`stat-icon ${team.color}`}>
                <SproutIcon />
              </span>
              <div>
                <strong>{team.name}</strong>
                <small>
                  {team.name === t("Your garden team", "فريق حديقتك")
                    ? t("Your saved activity", "نشاطك المحفوظ")
                    : t("Fictional demo team", "فريق تجريبي خيالي")}
                </small>
              </div>
              <b>
                {team.n}
                <small>{t("points", "نقاط")}</small>
              </b>
            </div>
          ))}
        </section>
        <section className="panel">
          <div className="section-bar">
            <h2>{t("Little growing challenges", "تحديات نمو صغيرة")}</h2>
            <Leaf size={21} />
          </div>
          {[
            {
              title: t("The leaf detective", "محقق الأوراق"),
              body: t(
                "Observe one plant and describe a leaf’s shape or colour.",
                "راقب نباتاً وصف شكل ورقة أو لونها.",
              ),
              key: "leaf",
            },
            {
              title: t("A soil story", "قصة تربة"),
              body: t(
                "Compare the moisture signal to a gentle soil check.",
                "قارن إشارة الرطوبة بفحص لطيف للتربة.",
              ),
              key: "soil",
            },
          ].map((x) => (
            <article className="challenge" key={x.key}>
              <span className="stat-icon sage">
                <Leaf size={21} />
              </span>
              <div>
                <h3>{x.title}</h3>
                <p>{x.body}</p>
                <button
                  className="text-link"
                  disabled={s.tasks.some((task) => task.title === x.title)}
                  onClick={() => {
                    update((old) => ({
                      ...old,
                      tasks: [
                        ...old.tasks,
                        {
                          id: uid(),
                          title: x.title,
                          plantId: old.plants[0]?.id || "",
                          due: dayKey(),
                          done: false,
                          type: "check",
                        },
                      ],
                    }));
                    notify(t("Challenge added to the care plan", "تمت إضافة التحدي لخطة الرعاية"));
                  }}
                >
                  {s.tasks.some((task) => task.title === x.title)
                    ? t("Added to care plan", "أضيف لخطة الرعاية")
                    : t("Add challenge to care plan", "أضف التحدي لخطة الرعاية")}
                  <ArrowUpRight size={14} />
                </button>
              </div>
            </article>
          ))}
          <div className="callout">
            <Trophy size={18} />
            <p>
              {t(
                "Competition prizes are future proposals only. No prizes, sponsorships, or official endorsements are secured.",
                "جوائز المسابقات مقترحات مستقبلية فقط. لا توجد جوائز أو رعاية أو اعتماد رسمي مضمون.",
              )}
            </p>
          </div>
        </section>
      </div>
      {certificate && (
        <Modal
          title={t("Participation certificate preview", "معاينة شهادة المشاركة")}
          onClose={() => setCertificate(false)}
        >
          <div className="certificate" id="certificate">
            <Leaf size={44} />
            <span className="eyebrow">GARDENING BUDDY</span>
            <h2>{t("A little care. A lot of curiosity.", "قليل من الرعاية. كثير من الفضول.")}</h2>
            <p>{t("Certificate of participation", "شهادة مشاركة")}</p>
            <h3>{t("Your garden team", "فريق حديقتك")}</h3>
            <p>
              {t(
                "For taking part in thoughtful plant observations and everyday care.",
                "للمشاركة في مراقبة النباتات بعناية ورعايتها اليومية.",
              )}
            </p>
            <strong>
              {t("Class group", "مجموعة الصف")} {group} · {dayKey()}
            </strong>
            <hr />
            <small>
              {t(
                "Demo participation preview · Student startup prototype",
                "معاينة مشاركة تجريبية · نموذج مشروع طلابي",
              )}
              <br />
              {t(
                "Not an official qualification. No ministry endorsement.",
                "ليست مؤهلاً رسمياً. دون اعتماد وزاري.",
              )}
            </small>
          </div>
          <button className="button primary full no-print" onClick={() => window.print()}>
            <Printer size={18} />
            {t("Print participation preview", "طباعة معاينة المشاركة")}
          </button>
        </Modal>
      )}
    </>
  );
}
function SproutIcon() {
  return <Leaf size={19} />;
}
