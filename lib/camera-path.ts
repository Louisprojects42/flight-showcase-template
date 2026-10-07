export type V3 = [number, number, number];

export interface Shot {
  
  t: number;
  position: V3;
  target: V3;
  
  fov: number;
}


export const SHOTS: Shot[] = [
  
  
  
  
  { t: 0.0, position: [-55, 7.5, 45], target: [-0.5, -7.8, -6.5], fov: 30 },
  { t: 0.09, position: [-44, 6, 35.7], target: [-0.9, -7, -7], fov: 30 },
  
  
  
  { t: 0.2, position: [-12, 30, 56], target: [-5, -4, 6], fov: 32 },
  { t: 0.29, position: [36, 15, 60], target: [1, -5, 9], fov: 32 },
  
  
  { t: 0.35, position: [6, 15, 1], target: [3, -2, 13], fov: 34 },
  { t: 0.42, position: [12, 15, 11], target: [3, -2, 14], fov: 32 },
  { t: 0.48, position: [24, 11, 29], target: [4, -1.5, 13], fov: 30 },
  
  
  
  { t: 0.56, position: [51, 19, 46], target: [5, -6, 15.5], fov: 30 },
  { t: 0.74, position: [48, 17.5, 44], target: [5, -5.6, 16], fov: 30 },
  
  
  
  { t: 0.8, position: [8, 30, 86], target: [-2, -9, 2], fov: 30 },
  { t: 0.86, position: [-24, 24, 74], target: [-5, -9, -3], fov: 30 },
  { t: 0.92, position: [-52, 26, 68], target: [-10, -11, -11], fov: 30 },
  { t: 1.0, position: [-68, 30, 82], target: [-12, -13, -14], fov: 30 },
];

const ease = (x: number) => {
  const s = Math.min(1, Math.max(0, x));
  return s * s * (3 - 2 * s);
};


function catmullRom(p0: V3, p1: V3, p2: V3, p3: V3, u: number): V3 {
  const alpha = 0.5;
  
  const tj = (ti: number, a: V3, b: V3) => ti + Math.max(1e-3, Math.pow(Math.hypot(b[0] - a[0], b[1] - a[1], b[2] - a[2]), alpha));
  const t0 = 0;
  const t1 = tj(t0, p0, p1);
  const t2 = tj(t1, p1, p2);
  const t3 = tj(t2, p2, p3);
  const t = t1 + (t2 - t1) * u;
  const lerp = (a: V3, b: V3, ta: number, tb: number): V3 => {
    const d = tb - ta || 1e-6;
    const wa = (tb - t) / d;
    const wb = (t - ta) / d;
    return [a[0] * wa + b[0] * wb, a[1] * wa + b[1] * wb, a[2] * wa + b[2] * wb];
  };
  const a1 = lerp(p0, p1, t0, t1);
  const a2 = lerp(p1, p2, t1, t2);
  const a3 = lerp(p2, p3, t2, t3);
  const b1 = lerp(a1, a2, t0, t2);
  const b2 = lerp(a2, a3, t1, t3);
  return lerp(b1, b2, t1, t2);
}

export interface CameraPose {
  position: V3;
  target: V3;
  fov: number;
}


export function cameraAt(t: number, shots: Shot[] = SHOTS): CameraPose {
  const x = Math.min(1, Math.max(0, t));
  let i = 0;
  while (i < shots.length - 2 && x > shots[i + 1].t) i++;
  const a = shots[i];
  const b = shots[i + 1];
  const u = ease((x - a.t) / (b.t - a.t || 1));
  const p = (k: number) => shots[Math.min(shots.length - 1, Math.max(0, k))];
  return {
    position: catmullRom(p(i - 1).position, a.position, b.position, p(i + 2).position, u),
    target: catmullRom(p(i - 1).target, a.target, b.target, p(i + 2).target, u),
    fov: a.fov + (b.fov - a.fov) * u,
  };
}


export const COMPOSE_ASPECT = 1.6;

export const POSTER_ASPECT = 2.4;


export function posterCropX(aspect: number): number {
  if (aspect >= COMPOSE_ASPECT) return 50;
  const right = (1 + COMPOSE_ASPECT / POSTER_ASPECT) / 2;
  const visible = aspect / POSTER_ASPECT;
  return ((right - visible) / (1 - visible)) * 100;
}
