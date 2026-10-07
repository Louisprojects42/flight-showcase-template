export type FrameFn = (now: number, dtSeconds: number) => boolean;

const subs: FrameFn[] = [];
let raf = 0;
let last = 0;

function tick(now: number) {
  raf = 0;
  const dt = last ? Math.min(0.1, (now - last) / 1000) : 1 / 60;
  last = now;
  let again = false;
  for (const fn of subs.slice()) if (fn(now, dt)) again = true;
  if (again) raf = requestAnimationFrame(tick);
  else last = 0;
}


export function wake(): void {
  if (!raf && typeof requestAnimationFrame !== "undefined") raf = requestAnimationFrame(tick);
}

export function subscribeFrame(fn: FrameFn): () => void {
  subs.push(fn);
  wake();
  return () => {
    const i = subs.indexOf(fn);
    if (i >= 0) subs.splice(i, 1);
  };
}
