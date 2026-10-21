import { useEffect, useRef, type ReactNode } from "react";
import { Sprout, X, ArrowUpRight } from "lucide-react";
import { Link } from "wouter";
import type { Mood, Plant } from "./demo";
import { useBuddy } from "./context";
export function Logo({ light = false }: { light?: boolean }) {
  return (
    <Link href="/" className={`logo ${light ? "light" : ""}`} aria-label="Gardening Buddy home">
      <span className="logo-mark">
        <Sprout size={25} />
      </span>
      <span>
        gardening
        <span className="logo-buddy">
          buddy<span className="logo-dot">.</span>
        </span>
      </span>
    </Link>
  );
}
export function Face({ mood = "happy", small = false }: { mood?: Mood; small?: boolean }) {
  return (
    <span className={`buddy-face ${mood} ${small ? "small" : ""}`} aria-hidden="true">
      <span className="eyes">
        <i />
        <i />
      </span>
      <span className="cheeks">
        <i />
        <i />
      </span>
      <span className="mouth" />
    </span>
  );
}
export function PlantArt({
  kind = "basil",
  hero = false,
}: {
  kind?: Plant["kind"];
  hero?: boolean;
}) {
  const { t } = useBuddy();
  const leaves = kind === "mint" ? 14 : kind === "tomato" ? 13 : 12;
  return (
    <svg
      viewBox="0 0 360 420"
      className={`plant-art ${hero ? "hero-art" : ""}`}
      aria-label={t(
        `${kind} plant illustration`,
        `رسم نبات ${{ basil: "الريحان", tomato: "الطماطم", mint: "النعناع", marigold: "القطيفة" }[kind]}`,
      )}
    >
      <defs>
        <linearGradient id={`leaf-${kind}-${hero}`} x1="0" x2="1" y1="0" y2="1">
          <stop stopColor="#6d994e" />
          <stop offset="1" stopColor="#254e36" />
        </linearGradient>
        <linearGradient id={`pot-${kind}-${hero}`}>
          <stop stopColor="#d1a886" />
          <stop offset=".5" stopColor="#e7c5a2" />
          <stop offset="1" stopColor="#ba8d6f" />
        </linearGradient>
      </defs>
      <ellipse cx="180" cy="391" rx="104" ry="14" fill="#213d2e" opacity=".10" />
      <path d="M172 315 Q195 209 171 63" stroke="#527042" strokeWidth="6" fill="none" />
      {Array.from({ length: leaves }, (_, i) => {
        const side = i % 2 === 0 ? -1 : 1;
        const y = 75 + i * 17;
        const x = 178 + Math.sin(i) * 7;
        const tx = x + side * (45 + (i % 3) * 10);
        const ty = y - 32;
        return (
          <g key={i}>
            <path
              d={`M${x} ${y + 25} Q${tx} ${y + 5} ${tx} ${ty}`}
              stroke="#517341"
              strokeWidth="3"
              fill="none"
            />
            <path
              d={`M${x} ${y + 15} Q${x + side * 6} ${y - 48} ${tx + side * 29} ${ty - 15} Q${tx + side * 43} ${y + 17} ${x} ${y + 15}`}
              fill={`url(#leaf-${kind}-${hero})`}
              transform={`rotate(${side * (i % 3) * 5} ${x} ${y})`}
            />
            <path
              d={`M${x} ${y + 15} L${tx + side * 19} ${ty - 5}`}
              fill="none"
              stroke="#c2d69b"
              strokeWidth="1"
              opacity=".45"
            />
            {kind === "tomato" && i % 3 === 1 && (
              <g>
                <circle cx={tx + 12} cy={y + 15} r="14" fill="#ce6546" />
                <path d={`M${tx + 6} ${y + 2}l6 6 6-6-5 1-1-5-2 5z`} fill="#41673b" />
              </g>
            )}
            {kind === "marigold" && i % 3 === 0 && (
              <g>
                {Array.from({ length: 7 }, (_, j) => (
                  <ellipse
                    key={j}
                    cx={tx}
                    cy={ty - 5}
                    rx="10"
                    ry="19"
                    fill={j % 2 ? "#e4a83c" : "#f1bf4f"}
                    transform={`rotate(${j * 51} ${tx} ${ty + 5})`}
                  />
                ))}
                <circle cx={tx} cy={ty + 5} r="9" fill="#9d6325" />
              </g>
            )}
          </g>
        );
      })}
      <ellipse cx="180" cy="310" rx="77" ry="19" fill="#8c7156" />
      <path d="M103 309 L120 384 Q180 407 240 384 L257 309Z" fill={`url(#pot-${kind}-${hero})`} />
      <ellipse cx="180" cy="310" rx="77" ry="15" fill="#e2c5a4" />
      <ellipse cx="180" cy="309" rx="65" ry="10" fill="#66503b" />
      <path d="M177 310v-24" stroke="#557444" strokeWidth="6" />
      {Array.from({ length: 12 }, (_, i) => (
        <path
          key={i}
          d={`M${112 + i * 12} 324l${(6 - i) * 0.65} 56`}
          stroke="#ac8266"
          opacity=".23"
          strokeWidth="2"
        />
      ))}
    </svg>
  );
}
export function Tag({ children, color = "green" }: { children: ReactNode; color?: string }) {
  return <span className={`tag ${color}`}>{children}</span>;
}
export function Modal({
  title,
  children,
  onClose,
}: {
  title: string;
  children: ReactNode;
  onClose: () => void;
}) {
  const ref = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    const d = ref.current;
    d?.showModal();
    return () => {
      d?.close();
    };
  }, []);
  return (
    <dialog ref={ref} className="modal" aria-label={title} onCancel={onClose}>
      <header>
        <h2>{title}</h2>
        <button className="icon-btn" onClick={onClose} aria-label="Close / إغلاق">
          <X />
        </button>
      </header>
      {children}
    </dialog>
  );
}
export function SectionTitle({
  eyebrow,
  title,
  children,
}: {
  eyebrow?: string;
  title: string;
  children?: ReactNode;
}) {
  return (
    <div className="section-title">
      {eyebrow && <span className="eyebrow">{eyebrow}</span>}
      <div>
        <h2>{title}</h2>
        {children}
      </div>
    </div>
  );
}
export function PlantName({ plant }: { plant: Plant }) {
  const { s } = useBuddy();
  return <>{s.lang === "ar" ? plant.arName || plant.name : plant.name}</>;
}
export function ArrowLink({ href, children }: { href: string; children: ReactNode }) {
  return (
    <Link className="text-link" href={href}>
      {children}
      <ArrowUpRight size={17} />
    </Link>
  );
}
