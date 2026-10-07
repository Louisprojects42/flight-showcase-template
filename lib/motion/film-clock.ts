import { subscribeFrame, wake } from "./frame-loop";

export interface Chapter {
  id: string;
  
  from: number;
  to: number;
}

export const clamp01 = (x: number) => Math.min(1, Math.max(0, x));
export const smoothstep = (x: number) => {
  const s = clamp01(x);
  return s * s * (3 - 2 * s);
};
export const localOf = (t: number, c: Chapter) => clamp01((t - c.from) / (c.to - c.from));

export interface FilmSnapshot {
  
  raw: number;
  
  t: number;
  
  chapter: number;
  
  local: number[];
  
  moving: boolean;
}


export function filmTimeFor(progress: number, span: [number, number]): number {
  return span[0] + (span[1] - span[0]) * clamp01(progress);
}


export function follow(current: number, target: number, dt: number, tau: number): number {
  const next = current + (target - current) * (1 - Math.exp(-dt / Math.max(tau, 1e-4)));
  return Math.abs(target - next) < 5e-5 ? target : next;
}

export interface FilmClock {
  subscribe(fn: (s: FilmSnapshot) => void): () => void;
  
  readonly snapshot: FilmSnapshot;
  
  scrollYFor(t: number): number;
  
  rawNow(): number;
  destroy(): void;
}

export function createFilmClock(o: {
  track: HTMLElement;
  stage: HTMLElement;
  chapters: Chapter[];
  span?: [number, number];
  tau?: number;
}): FilmClock {
  const { track, stage, chapters } = o;
  const span = o.span ?? [0, 1];
  const tau = o.tau ?? 0.08;
  const subs = new Set<(s: FilmSnapshot) => void>();
  const snap: FilmSnapshot = { raw: span[0], t: span[0], chapter: 0, local: chapters.map(() => 0), moving: false };
  let geometry = { top: 0, scrollSpan: 1 };
  let dirty = true;

  const measure = () => {
    const r = track.getBoundingClientRect();
    geometry = { top: r.top + window.scrollY, scrollSpan: Math.max(1, track.offsetHeight - stage.offsetHeight) };
  };
  const rawNow = () => filmTimeFor((window.scrollY - geometry.top) / geometry.scrollSpan, span);

  const write = () => {
    chapters.forEach((c, i) => {
      snap.local[i] = localOf(snap.t, c);
      stage.style.setProperty(`--c${i}`, snap.local[i].toFixed(4));
    });
    stage.style.setProperty("--t", snap.t.toFixed(4));
    const idx = chapters.findIndex((c) => snap.t < c.to);
    snap.chapter = idx < 0 ? chapters.length - 1 : idx;
    stage.dataset.chapter = chapters[snap.chapter]?.id ?? "";
  };

  measure();
  snap.raw = snap.t = rawNow();
  write();

  const unsubscribe = subscribeFrame((_now, dt) => {
    if (dirty) {
      measure();
      dirty = false;
    }
    snap.raw = rawNow();
    const before = snap.t;
    snap.t = follow(snap.t, snap.raw, dt, tau);
    snap.moving = snap.t !== snap.raw;
    if (snap.t !== before || snap.moving) write();
    subs.forEach((fn) => fn(snap));
    return snap.moving;
  });

  const onScroll = () => wake();
  const onResize = () => {
    dirty = true;
    wake();
  };
  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("resize", onResize);
  const ro = new ResizeObserver(onResize);
  ro.observe(track);

  return {
    subscribe(fn) {
      subs.add(fn);
      fn(snap);
      return () => {
        subs.delete(fn);
      };
    },
    get snapshot() {
      return snap;
    },
    scrollYFor(t: number) {
      measure();
      return geometry.top + ((t - span[0]) / (span[1] - span[0])) * geometry.scrollSpan;
    },
    rawNow,
    destroy() {
      unsubscribe();
      ro.disconnect();
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
    },
  };
}
