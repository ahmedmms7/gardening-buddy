import { Link } from "wouter";
import {
  ArrowRight,
  ArrowUpRight,
  Globe2,
  Leaf,
  Radio,
  Heart,
  Sun,
  Droplets,
  WifiOff,
  GraduationCap,
  Sprout,
  ChevronDown,
  Menu,
} from "lucide-react";
import { useState } from "react";
import { useBuddy } from "./context";
import { Logo, PlantArt, Face, Tag } from "./ui";
export default function Landing() {
  const { t, setLang, s } = useBuddy();
  const [menu, setMenu] = useState(false);
  return (
    <div className="marketing">
      <header className="marketing-header">
        <div className="nav-inner">
          <Logo light />
          <nav className={menu ? "open" : ""}>
            <a href="#how">{t("How it works", "كيف يعمل")}</a>
            <a href="#made-for">{t("Made for you", "صُمم لك")}</a>
            <a href="#features">{t("Our little device", "جهازنا الصغير")}</a>
            <a href="#faq">{t("FAQs", "الأسئلة الشائعة")}</a>
          </nav>
          <div className="nav-actions">
            <button className="lang-button" onClick={setLang}>
              <Globe2 size={15} />
              {s.lang === "en" ? "العربية" : "English"}
            </button>
            <Link href="/app" className="button lime small-btn">
              {t("Open demo app", "افتح التطبيق")}
              <ArrowUpRight size={16} />
            </Link>
            <button
              className="icon-btn mobile-menu"
              onClick={() => setMenu(!menu)}
              aria-label={t("Toggle navigation", "قائمة التنقل")}
            >
              <Menu />
            </button>
          </div>
        </div>
      </header>
      <main>
        <section className="landing-hero">
          <div className="hero-copy">
            <span className="eyebrow">
              <span className="tiny-leaf">
                <Leaf size={13} />
              </span>
              {t("A LITTLE TECH. A LOT OF GROWTH.", "تقنية صغيرة. نمو كبير.")}
            </span>
            <h1>
              {t("Good things", "الأشياء الجميلة")}
              <br />
              {t("grow with a", "تنمو مع")}
              <br />
              <span className="title-buddy">
                {t("little buddy.", "رفيق صغير.")}
                <svg viewBox="0 0 380 17" aria-hidden="true">
                  <path
                    d="M3 10Q170-3 375 9M35 15Q235 1 355 13"
                    fill="none"
                    stroke="#a8bf68"
                    strokeWidth="3"
                    strokeLinecap="round"
                  />
                </svg>
              </span>
            </h1>
            <p className="hero-description">
              {t(
                "Your plants have a lot to say. Meet the friendly little companion that helps you listen, learn, and grow together.",
                "لنباتاتك الكثير لتقوله. تعرّف على الرفيق الصغير الذي يساعدك على الاستماع والتعلّم والنمو معاً.",
              )}
            </p>
            <div className="hero-ctas">
              <Link href="/app" className="button primary">
                {t("Meet your gardening buddy", "تعرّف على رفيقك")}
                <ArrowUpRight size={20} />
              </Link>
              <a href="#how" className="button ghost">
                {t("See how it works", "شاهد كيف يعمل")}
                <ArrowRight size={17} />
              </a>
            </div>
            <div className="hero-note">
              <span className="status-dot" />
              {t(
                "Growing in Bahrain. Built for curious minds.",
                "ننمو في البحرين. صُمم للعقول الفضولية.",
              )}
              <span className="note-line" />
              {t("Pilot-stage prototype", "نموذج أولي تجريبي")}
            </div>
          </div>
          <div className="hero-scene">
            <div className="scene-circle" />
            <div className="orbit orbit-one" />
            <div className="orbit orbit-two" />
            <span className="scene-top-note">
              {t("a happier kind of growing", "طريقة أسعد للنمو")}
              <svg width="60" height="35" viewBox="0 0 60 35">
                <path
                  d="M2 5q40-10 45 21m-10-7 11 9 4-13"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                />
              </svg>
            </span>
            <div className="hero-plant">
              <PlantArt hero />
            </div>
            <div className="floating-label moisture">
              <span className="circle-icon">
                <Droplets size={19} />
              </span>
              <div>
                <span>{t("Soil feels good", "التربة بحالة جيدة")}</span>
                <strong>
                  62<span>%</span>
                  <small>{t("relative moisture", "رطوبة نسبية")}</small>
                </strong>
              </div>
            </div>
            <div className="floating-label sunlight">
              <Sun size={20} />
              <div>
                <span>{t("A little sunshine", "القليل من الشمس")}</span>
                <strong>
                  8,200 <small>lux</small>
                </strong>
              </div>
            </div>
            <div className="device-hero">
              <div className="device-body">
                <span className="device-screw" />
                <div className="device-screen">
                  <Face />
                  <span>{t("I'm feeling good!", "أشعر بالسعادة!")}</span>
                </div>
                <div className="device-brand">
                  <Sprout size={13} /> gardening buddy
                </div>
                <div className="device-led" />
              </div>
              <div className="device-stick" />
            </div>
            <div className="scene-bottom-note">
              <span className="sketch-heart">♡</span>
              {t("small signals. happier plants.", "إشارات صغيرة. نباتات أسعد.")}
            </div>
            <div className="demo-scene-tag">
              {t("Illustration · sample readings", "رسم توضيحي · قراءات تجريبية")}
            </div>
          </div>
        </section>
        <section className="values-strip">
          <span>
            <Sprout />
            {t("Rooted in curiosity", "جذوره الفضول")}
          </span>
          <span>
            <GraduationCap />
            {t("Made for learning", "صُنع للتعلّم")}
          </span>
          <span>
            <Heart />
            {t("A friend to every plant", "صديق لكل نبات")}
          </span>
          <span>
            <WifiOff />
            {t("Designed to sense offline", "مصمّم للاستشعار دون إنترنت")}
          </span>
        </section>
        <section id="how" className="section how-section">
          <div className="center-heading">
            <span className="eyebrow">
              {t("LESS GUESSWORK. MORE GREEN.", "تخمين أقل. خضرة أكثر.")}
            </span>
            <h2>
              {t("A little understanding goes a long way.", "القليل من الفهم يصنع فرقاً كبيراً.")}
            </h2>
            <p>
              {t(
                "From a tiny signal to a thoughtful action. That’s the buddy way.",
                "من إشارة صغيرة إلى رعاية مدروسة. هذه طريقة الرفيق.",
              )}
            </p>
          </div>
          <div className="steps-grid">
            {[
              {
                icon: Radio,
                n: "01",
                title: t("Sense the small things", "استشعر التفاصيل"),
                body: t(
                  "A little plant node samples relative soil moisture, air temperature, humidity, and light.",
                  "تقيس عقدة النبات رطوبة التربة النسبية وحرارة الهواء والرطوبة والضوء.",
                ),
              },
              {
                icon: Leaf,
                n: "02",
                title: t("Understand the feeling", "افهم الشعور"),
                body: t(
                  "A friendly face turns readings into easy-to-understand signals. No complicated dashboards needed.",
                  "يحوّل وجه ودود القراءات إلى إشارات سهلة الفهم دون تعقيد.",
                ),
              },
              {
                icon: Heart,
                n: "03",
                title: t("Grow a caring habit", "نمِّ عادة الرعاية"),
                body: t(
                  "Check the soil, notice a new leaf, or complete a care task. Small actions make a meaningful routine.",
                  "افحص التربة، لاحظ ورقة جديدة أو أنجز مهمة رعاية. خطوات صغيرة تصنع روتيناً مفيداً.",
                ),
              },
            ].map((x) => (
              <article className="step" key={x.n}>
                <div className="step-head">
                  <span className="step-icon">
                    <x.icon size={24} />
                  </span>
                  <span>{x.n}</span>
                </div>
                <h3>{x.title}</h3>
                <p>{x.body}</p>
              </article>
            ))}
          </div>
        </section>
        <section id="made-for" className="section audiences">
          <div className="center-heading">
            <span className="eyebrow">
              {t("DIFFERENT GARDENS. ONE LITTLE BUDDY.", "حدائق مختلفة. رفيق واحد.")}
            </span>
            <h2>{t("For growing plants. And growing minds.", "لنمو النباتات. ولنمو العقول.")}</h2>
          </div>
          <div className="audience-grid">
            <article className="school-feature">
              <div>
                <Tag>{t("FOR SCHOOLS", "للمدارس")}</Tag>
                <h3>
                  {t("Bring learning", "اجعل التعلّم")}
                  <br />
                  {t("to life. Literally.", "ينبض بالحياة.")}
                </h3>
                <p>
                  {t(
                    "Turn a school garden into a living classroom. Observe, work in teams, and celebrate participation—not how much you water.",
                    "حوّل حديقة المدرسة إلى صف حي. راقب واعمل بفريق واحتفل بالمشاركة، لا بكمية الري.",
                  )}
                </p>
                <Link href="/app/schools" className="text-link">
                  {t("Explore the classroom", "استكشف الصف")}
                  <ArrowUpRight size={18} />
                </Link>
              </div>
              <div className="school-illustration">
                <div className="window">
                  <Sun size={28} />
                  <span />
                </div>
                <PlantArt kind="marigold" />
                <div className="illustration-caption">
                  {t("Curiosity, in full bloom.", "فضول يزهر.")}
                </div>
              </div>
            </article>
            <article className="grower-feature">
              <div>
                <Tag color="cream">{t("FOR GROWERS & FAMILIES", "للمزارعين والعائلات")}</Tag>
                <h3>
                  {t("A greener day,", "يوم أكثر خضرة،")}
                  <br />
                  {t("a simpler way.", "بطريقة أبسط.")}
                </h3>
                <p>
                  {t(
                    "From a kitchen herb to a growing collection. Find your rhythm with plant insights, gentle reminders, and a little encouragement.",
                    "من أعشاب المطبخ إلى حديقة كاملة. اعتنِ بها مع قراءات واضحة وتذكيرات لطيفة.",
                  )}
                </p>
                <Link href="/app" className="text-link">
                  {t("Find your growing rhythm", "اكتشف روتينك")}
                  <ArrowUpRight size={18} />
                </Link>
              </div>
              <div className="mini-pots">
                <PlantArt kind="mint" />
                <PlantArt kind="tomato" />
              </div>
            </article>
          </div>
        </section>
        <section id="features" className="section feature-section">
          <div className="feature-device">
            <span className="eyebrow">
              {t("SMALL DEVICE. BIG PERSONALITY.", "جهاز صغير. شخصية كبيرة.")}
            </span>
            <div className="feature-face">
              <Face />
              <Sprout className="face-sprout" size={50} />
            </div>
            <span className="feature-label">
              {t("Your plant’s feelings, at a glance.", "مشاعر نباتك، بنظرة واحدة.")}
            </span>
          </div>
          <div>
            <h2>{t("Thoughtful by nature.", "مدروس بطبيعته.")}</h2>
            <div className="feature-list">
              {[
                [
                  t("More than a number", "أكثر من مجرد رقم"),
                  t(
                    "Expressive faces and clear, threshold-based suggestions help you know what to check next.",
                    "وجوه معبّرة واقتراحات تعتمد على حدود قابلة للتعديل لتعرف ما يجب فحصه.",
                  ),
                ],
                [
                  t("Designed for real life", "مصمّم للحياة اليومية"),
                  t(
                    "The planned local sensing and face keep running without Wi-Fi. Queued readings sync when connectivity returns.",
                    "الاستشعار المحلي والوجه مصممان للعمل دون واي فاي، مع مزامنة القراءات عند عودة الاتصال.",
                  ),
                ],
                [
                  t("One garden. Your way.", "حديقة واحدة. بطريقتك."),
                  t(
                    "School, Grower, Family, or Simple mode. English and Arabic. A buddy that feels right for you.",
                    "وضع المدرسة أو المزارع أو العائلة أو البسيط. بالعربية والإنجليزية.",
                  ),
                ],
              ].map(([title, body], i) => (
                <article key={title}>
                  <span className="feature-number">0{i + 1}</span>
                  <div>
                    <h3>{title}</h3>
                    <p>{body}</p>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>
        <section className="pilot-banner">
          <div>
            <Tag color="cream">{t("HONESTLY, WE’RE STILL GROWING", "بصراحة، ما زلنا ننمو")}</Tag>
            <h2>{t("A small start. A greener possibility.", "بداية صغيرة. مستقبل أكثر خضرة.")}</h2>
            <p>
              {t(
                "We’re a Bahrain INJAZ university student startup, building a pilot for schools in grades 1–12 and growers. This app is a working demo, not a connected hardware product.",
                "نحن مشروع طلاب جامعيين في إنجاز البحرين، نطوّر تجربة للمدارس من الصف الأول إلى الثاني عشر والمزارعين. هذا التطبيق عرض تجريبي عملي، وليس منتجاً متصلاً بأجهزة فعلية.",
              )}
            </p>
          </div>
          <Link href="/app/devices" className="button lime">
            {t("Take a peek at the prototype", "استكشف النموذج الأولي")}
            <ArrowUpRight size={18} />
          </Link>
        </section>
        <section id="faq" className="section faq-section">
          <div>
            <span className="eyebrow">
              {t("A FEW THINGS YOU MIGHT WONDER", "أشياء قد تتساءل عنها")}
            </span>
            <h2>{t("Let’s clear the soil.", "لنوضح الأمور.")}</h2>
            <p>
              {t("A little clarity before we grow together.", "قليل من الوضوح قبل أن ننمو معاً.")}
            </p>
          </div>
          <div className="faqs">
            {[
              [
                t("Can I buy a Gardening Buddy today?", "هل يمكنني شراء الجهاز الآن؟"),
                t(
                  "Not yet. We are at the pilot stage, validating the hardware, power design, and device integration. There is no checkout or confirmed launch date.",
                  "ليس بعد. نحن في المرحلة التجريبية للتحقق من الأجهزة والطاقة والربط. لا يوجد متجر أو موعد إطلاق مؤكد.",
                ),
              ],
              [
                t("Is this demo connected to a real plant?", "هل العرض متصل بنبات حقيقي؟"),
                t(
                  "No. Every reading is clearly marked demo data and saved on your device. You can edit thresholds, add plants, and try care tasks without any hardware.",
                  "لا. جميع القراءات بيانات تجريبية محفوظة على جهازك. يمكنك تعديل الحدود وإضافة نباتات وتجربة مهام الرعاية دون أجهزة.",
                ),
              ],
              [
                t("Does it identify diseases or measure pH?", "هل يشخّص الأمراض أو يقيس الحموضة؟"),
                t(
                  "No. Our selected prototype has no pH sensor. Photo identification and disease analysis are optional future services and are not connected.",
                  "لا. النموذج المختار لا يحتوي على مستشعر حموضة. التعرف على الصور وتحليل الأمراض خدمات مستقبلية اختيارية غير متصلة.",
                ),
              ],
              [
                t("Does it work without the internet?", "هل يعمل دون إنترنت؟"),
                t(
                  "This demo stores your changes locally and supports an offline app shell after the first production load. Physical nodes are designed to keep sensing locally; real hardware behavior still needs validation.",
                  "يحفظ العرض التغييرات محلياً ويدعم واجهة دون اتصال بعد أول تحميل للإصدار المبني. العقد مصممة لمواصلة القياس محلياً؛ السلوك الفعلي يحتاج إلى اختبار.",
                ),
              ],
            ].map(([q, a]) => (
              <details key={q}>
                <summary>
                  {q}
                  <ChevronDown size={18} />
                </summary>
                <p>{a}</p>
              </details>
            ))}
          </div>
        </section>
        <section className="bottom-cta">
          <Sprout size={34} />
          <h2>
            {t(
              "Every great garden starts with a little care.",
              "كل حديقة جميلة تبدأ بقليل من الرعاية.",
            )}
          </h2>
          <Link href="/app" className="button primary">
            {t("Let’s grow something good", "لنزرع شيئاً جميلاً")}
            <ArrowUpRight size={18} />
          </Link>
          <p>
            {t(
              "Free to explore. No account. Just a little curiosity.",
              "استكشف مجاناً. دون حساب. بقليل من الفضول.",
            )}
          </p>
        </section>
      </main>
      <footer className="marketing-footer">
        <Logo light />
        <span>{t("Small signals. Happier plants.", "إشارات صغيرة. نباتات أسعد.")}</span>
        <span>
          {t("Bahrain · Student-built · Pilot stage", "البحرين · مشروع طلابي · مرحلة تجريبية")}
        </span>
        <button className="lang-button" onClick={setLang}>
          <Globe2 size={16} />
          {s.lang === "en" ? "العربية" : "English"}
        </button>
      </footer>
    </div>
  );
}
