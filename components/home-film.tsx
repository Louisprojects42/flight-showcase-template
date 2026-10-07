"use client";
import Link from "next/link";
import { useEffect, useRef, useSyncExternalStore } from "react";
import { createFilmClock, smoothstep } from "@/lib/motion/film-clock";
import { assetPath } from "@/lib/site";

const chapters = [
  { id: "intro", from: 0, to: .1, title: ["Your idea.", "In motion."], body: "A place for your introduction. Set the scene, share your vision and invite people to explore.", poster: "intro", action: { href: "/capabilities", label: "Explore the showcase" } },
  { id: "perspective", from: .1, to: .3, title: ["A different", "perspective."], body: "A place for your next idea. Let the aircraft set the pace as your story unfolds.", poster: "pitch" },
  { id: "story", from: .3, to: .5, title: ["Make space", "for your story."], body: "Introduce a feature, a process or a point of view. The details here are yours to add.", poster: "detail" },
  { id: "work", from: .5, to: .64, title: ["Show the work.", "Keep the focus."], body: "A place for selected work and supporting details. All content here is placeholder.", poster: "wide" },
  { id: "chapter", from: .64, to: .78, title: ["Your next chapter.", "Starts here."], body: "Use this space for another part of your story, with room for the details that matter.", poster: "wide", action: { href: "/docs", label: "Explore the documentation" } },
  { id: "future", from: .78, to: .89, title: ["Room for", "what comes next."], body: "A place for your future plans. Pricing and product details are placeholders.", poster: "close", action: { href: "/pricing", label: "View pricing placeholder" } },
  { id: "close", from: .89, to: 1, title: ["Make it", "your own."], body: "Your name, your words, your next step. This showcase is a starting point.", poster: "close", action: { href: "/contact", label: "View contact placeholder" } },
];

const subscribeMotion = (callback: () => void) => { const observer = new MutationObserver(callback); observer.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] }); return () => observer.disconnect(); };
export function HomeFilm() {
  const track = useRef<HTMLElement>(null);
  const stage = useRef<HTMLDivElement>(null);
  const canvas = useRef<HTMLCanvasElement>(null);
  const motionOff = useSyncExternalStore(subscribeMotion, () => document.documentElement.classList.contains("film-off"), () => false);
  useEffect(() => {
    const media = window.matchMedia("(min-width: 1024px) and (prefers-reduced-motion: no-preference)");
    let cleanup = () => {};
    let revision = 0;
    let disposed = false;
    const refresh = () => {
      cleanup();
      const version = ++revision;
      const parent = track.current, surface = stage.current, target = canvas.current;
      if (!parent || !surface || !target) return;
      const copies = Array.from(surface.querySelectorAll<HTMLElement>("[data-copy]"));
      surface.removeAttribute("data-live");
      copies.forEach(copy => { copy.removeAttribute("aria-hidden"); copy.style.removeProperty("--visibility"); copy.style.removeProperty("--offset"); delete copy.dataset.active; });
      if (!media.matches || document.documentElement.classList.contains("film-off")) return;
      const clock = createFilmClock({ track: parent, stage: surface, chapters });
      const unsubscribe = clock.subscribe(snapshot => {
        copies.forEach((copy, i) => {
          const chapter = chapters[i];
          const enter = i === 0 ? 1 : smoothstep((snapshot.t - chapter.from) / .025);
          const exit = i === chapters.length - 1 ? 1 : 1 - smoothstep((snapshot.t - chapter.to + .025) / .025);
          const visible = enter * exit;
          copy.style.setProperty("--visibility", String(visible));
          copy.style.setProperty("--offset", String((1 - enter) * -20 + (1 - exit) * 20) + "px");
          copy.setAttribute("aria-hidden", visible < .5 ? "true" : "false");
          copy.dataset.active = visible >= .5 ? "true" : "false";
        });
        const output = surface.querySelector<HTMLElement>("[data-scene-position]");
        if (output) output.textContent = String(Math.round(snapshot.t * 100)) + " %";
        surface.style.setProperty("--progress", String(snapshot.t));
      });
      let renderer: Awaited<ReturnType<typeof import("@/lib/aircraft-scene").createAircraftScene>> | undefined;
      let unrender = () => {};
      const onContextLost = () => { surface.removeAttribute("data-live"); unrender(); };
      target.addEventListener("webglcontextlost", onContextLost);
      import("@/lib/aircraft-scene").then(module => module.createAircraftScene(target)).then(scene => {
        if (disposed || version !== revision) { scene.dispose(); return; }
        renderer = scene;
        unrender = clock.subscribe(snapshot => scene.render(snapshot.t));
        surface.dataset.live = "true";
      }).catch(error => { surface.removeAttribute("data-live"); console.warn("Aircraft visual unavailable:", error instanceof Error ? error.message : String(error)); });
      cleanup = () => {
        target.removeEventListener("webglcontextlost", onContextLost);
        unsubscribe(); unrender(); clock.destroy(); renderer?.dispose();
      };
    };
    refresh();
    media.addEventListener("change", refresh);
    const observer = new MutationObserver(refresh);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });
    return () => { disposed = true; ++revision; cleanup(); media.removeEventListener("change", refresh); observer.disconnect(); };
  }, []);
  const toggle = () => {
    const next = !document.documentElement.classList.contains("film-off");
    document.documentElement.classList.toggle("film-off", next);
    try { localStorage.setItem("showcase-motion", next ? "off" : "on"); } catch {}
  };
  return <section ref={track} className="film-track" aria-label="Aircraft showcase">
    <div ref={stage} className="film-stage">
      <div className="live-scene" aria-hidden="true">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img className="fallback-poster" src={assetPath("/posters/intro.webp")} width={1600} height={900} alt="" fetchPriority="high" />
        <canvas ref={canvas} />
        <div className="scene-scrim" />
      </div>
      <div className="film-chapters">
        {chapters.map((chapter, i) => <article key={chapter.id} data-copy={chapter.id} className="film-copy">
          <figure className="stacked-poster">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={assetPath("/posters/"+chapter.poster+".webp")} width={1600} height={900} alt="An unbranded aircraft in a dark scene with ice-blue lighting" loading={i === 0 ? "eager" : "lazy"} fetchPriority={i === 0 ? "high" : "auto"} />
            <figcaption>Aircraft study · Illustrative</figcaption>
          </figure>
          <div className="container copy-content">
            {i === 0 ? <h1>{chapter.title[0]}<span>{chapter.title[1]}</span></h1> : <h2>{chapter.title[0]}<span>{chapter.title[1]}</span></h2>}
            <p>{chapter.body}</p>
            {chapter.action && <Link className={i === 0 ? "button" : "text-link"} href={chapter.action.href}>{chapter.action.label}</Link>}
          </div>
        </article>)}
      </div>
      <aside className="film-hud">
        <div className="container hud-row">
          <div><span>Scene</span><strong>Aircraft study</strong></div>
          <div><span>Visuals</span><strong>Illustrative</strong></div>
          <div className="position-readout"><span>Scene position</span><strong data-scene-position>0 %</strong></div>
          <button className="text-link motion-toggle" type="button" onClick={toggle} aria-pressed={motionOff}>{motionOff ? "Enable motion" : "Reduce motion"}</button>
        </div>
        <div className="container hud-foot"><span>All product content is placeholder</span><span className="scroll-hint">Scroll to explore</span></div>
        <div className="film-progress" aria-hidden="true"/>
      </aside>
    </div>
  </section>;
}
