export type Lang = "en" | "ar";
export type Mode = "School" | "Grower" | "Family" | "Simple";
export interface Reading {
  moisture: number;
  temperature: number;
  humidity: number;
  light: number;
  at: string;
}
export interface Thresholds {
  moisture: number;
  temperature: number;
  light: number;
}
export interface CareEvent {
  id: string;
  at: string;
  action: string;
  note: string;
}
export interface Plant {
  id: string;
  name: string;
  arName?: string;
  species: string;
  arSpecies: string;
  location: string;
  arLocation?: string;
  kind: "tomato" | "basil" | "mint" | "marigold";
  reading: Reading;
  thresholds: Thresholds;
  history: CareEvent[];
  trend: Reading[];
  nodeId: string;
  state: "online" | "offline" | "stale";
}
export interface Task {
  id: string;
  title: string;
  arTitle?: string;
  plantId: string;
  due: string;
  done: boolean;
  completedAt?: string;
  type: "check" | "repot" | "other";
}
export interface Device {
  id: string;
  name: string;
  type: "hub" | "node";
  battery: number;
  paired: boolean;
}
export interface DemoState {
  version: 1;
  plants: Plant[];
  tasks: Task[];
  devices: Device[];
  mode: Mode;
  lang: Lang;
  disconnected: boolean;
  interval: number;
  lastSync: string;
  localSample?: string;
  queued: number;
  checkins: string[];
  notificationEnabled: boolean;
  calibration: { dry: number; wet: number };
}
export const KEY = "gardening-buddy-v1";
export const uid = () => crypto.randomUUID();
export function dayKey(date = new Date()) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
}
export function offsetDay(offset: number) {
  const d = new Date();
  d.setDate(d.getDate() + offset);
  return dayKey(d);
}
export function streak(days: string[]) {
  let count = 0;
  const d = new Date();
  if (!days.includes(dayKey(d))) d.setDate(d.getDate() - 1);
  while (days.includes(dayKey(d))) {
    count++;
    d.setDate(d.getDate() - 1);
  }
  return count;
}
export function seedDemo(): DemoState {
  const now = Date.now();
  const defs = [
    [
      "Tomato buddy",
      "رفيق الطماطم",
      "Cherry tomato",
      "طماطم كرزية",
      "School greenhouse",
      "بيت المدرسة المحمي",
      "tomato",
      27,
      28,
      58,
      12500,
    ],
    [
      "Basil sunshine",
      "ريحان الشمس",
      "Sweet basil",
      "ريحان حلو",
      "Classroom windowsill",
      "نافذة الصف",
      "basil",
      62,
      25,
      64,
      8200,
    ],
    [
      "Mint to be",
      "رفيق النعناع",
      "Garden mint",
      "نعناع",
      "Herb garden · Zone A",
      "حديقة الأعشاب · المنطقة أ",
      "mint",
      55,
      26,
      61,
      850,
    ],
    [
      "Little marigold",
      "القطيفة الصغيرة",
      "French marigold",
      "قطيفة فرنسية",
      "Outdoor beds · Zone B",
      "الأحواض الخارجية · المنطقة ب",
      "marigold",
      48,
      36,
      45,
      18000,
    ],
  ] as const;
  const plants: Plant[] = defs.map((p, i) => {
    const at = new Date(now - (i === 2 ? 130 : 5 + i * 3) * 60000).toISOString();
    const reading = { moisture: p[7], temperature: p[8], humidity: p[9], light: p[10], at };
    return {
      id: `plant-${i}`,
      name: p[0],
      arName: p[1],
      species: p[2],
      arSpecies: p[3],
      location: p[4],
      arLocation: p[5],
      kind: p[6],
      reading,
      thresholds: { moisture: 35, temperature: 33, light: 1500 },
      nodeId: `GB-N0${i + 1}`,
      state: i === 2 ? "stale" : "online",
      history: [
        {
          id: uid(),
          at: new Date(now - 86400000).toISOString(),
          action: "Observation",
          note: "Demo: leaves checked; no visible changes.",
        },
      ],
      trend: Array.from({ length: 24 }, (_, j) => ({
        ...reading,
        at: new Date(new Date(at).getTime() - (23 - j) * 3600000).toISOString(),
        moisture: Math.max(
          0,
          Math.min(100, reading.moisture + Math.round(Math.sin(j / 4) * 6) + (23 - j) * 0.3),
        ),
        temperature: Math.round((reading.temperature + Math.sin(j / 4) * 2) * 10) / 10,
        light: Math.round(
          reading.light * (0.25 + 0.75 * Math.max(0, Math.sin(((j - 5) * Math.PI) / 18))),
        ),
      })),
    };
  });
  return {
    version: 1,
    plants,
    tasks: [
      {
        id: uid(),
        title: "Check tomato soil before watering",
        arTitle: "افحص تربة الطماطم قبل الري",
        plantId: "plant-0",
        due: offsetDay(0),
        done: false,
        type: "check",
      },
      {
        id: uid(),
        title: "Observe basil leaves",
        arTitle: "راقب أوراق الريحان",
        plantId: "plant-1",
        due: offsetDay(0),
        done: false,
        type: "check",
      },
      {
        id: uid(),
        title: "Rotate the mint pot",
        arTitle: "أدر وعاء النعناع",
        plantId: "plant-2",
        due: offsetDay(-1),
        done: false,
        type: "other",
      },
      {
        id: uid(),
        title: "Check marigold roots for repotting",
        arTitle: "افحص جذور القطيفة لتغيير الوعاء",
        plantId: "plant-3",
        due: offsetDay(7),
        done: false,
        type: "repot",
      },
    ],
    devices: [
      { id: "GB-H01", name: "Mother hub", type: "hub", battery: 91, paired: true },
      ...plants.map((p, i) => ({
        id: p.nodeId,
        name: `Plant node ${i + 1}`,
        type: "node" as const,
        battery: 82 - i * 9,
        paired: true,
      })),
    ],
    mode: "School",
    lang: "en",
    disconnected: false,
    interval: 15,
    lastSync: new Date(now - 300000).toISOString(),
    queued: 0,
    checkins: [],
    notificationEnabled: false,
    calibration: { dry: 3000, wet: 1200 },
  };
}
// A replaceable adapter boundary: no network calls and no claimed physical device connection.
export const demoAdapter = {
  load(): DemoState {
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) {
        const s = JSON.parse(raw);
        if (
          s.version === 1 &&
          Array.isArray(s.plants) &&
          Array.isArray(s.tasks) &&
          Array.isArray(s.devices) &&
          Array.isArray(s.checkins)
        )
          return s;
      }
    } catch {}
    return seedDemo();
  },
  save(state: DemoState): boolean {
    try {
      localStorage.setItem(KEY, JSON.stringify(state));
      return true;
    } catch {
      return false;
    }
  },
  reset(): DemoState {
    return seedDemo();
  },
};
export type Mood = "happy" | "thirsty" | "hot" | "low-light" | "unknown";
export function mood(plant: Plant, disconnected = false): Mood {
  if (
    disconnected ||
    plant.state !== "online" ||
    Date.now() - Date.parse(plant.reading.at) > 60 * 60000
  )
    return "unknown";
  if (plant.reading.moisture < plant.thresholds.moisture) return "thirsty";
  if (plant.reading.temperature > plant.thresholds.temperature) return "hot";
  if (plant.reading.light < plant.thresholds.light) return "low-light";
  return "happy";
}
