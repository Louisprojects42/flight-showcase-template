"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState, useSyncExternalStore } from "react";
import { Menu, X, Sun, Moon } from "lucide-react";
import { site } from "@/lib/site";
const subscribeTheme = (callback: () => void) => { const observer = new MutationObserver(callback); observer.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] }); return () => observer.disconnect(); };
export function SiteShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const light = useSyncExternalStore(subscribeTheme, () => document.documentElement.classList.contains("light"), () => false);
  useEffect(() => {
    if (!open) return;
    const close = (event: KeyboardEvent) => { if (event.key === "Escape") setOpen(false); };
    window.addEventListener("keydown", close);
    return () => window.removeEventListener("keydown", close);
  }, [open]);
  const toggleTheme = () => {
    const next = !light;
    document.documentElement.classList.toggle("light", next);
    try { localStorage.setItem("showcase-theme", next ? "light" : "dark"); } catch {}
  };
  return <>
    <a className="skip-link" href="#main-content">Skip to content</a>
    <header className="site-header">
      <div className="container nav-row">
        <Link className="wordmark" href="/" onClick={() => setOpen(false)}>{site.name}</Link>
        <nav className="desktop-nav" aria-label="Primary navigation">
          {site.links.map(link => <Link key={link.href} href={link.href} aria-current={pathname === link.href ? "page" : undefined}>{link.label}</Link>)}
        </nav>
        <div className="nav-actions">
          <button className="icon-button" type="button" aria-label={light ? "Use dark theme" : "Use light theme"} onClick={toggleTheme}>{light ? <Moon size={17}/> : <Sun size={17}/>}</button>
          <button className="icon-button menu-button" type="button" aria-label={open ? "Close navigation" : "Open navigation"} aria-expanded={open} aria-controls="mobile-navigation" onClick={() => setOpen(!open)}>{open ? <X size={20}/> : <Menu size={20}/>}</button>
        </div>
      </div>
      <nav id="mobile-navigation" hidden={!open} className="mobile-nav container" aria-label="Mobile navigation">
        {site.links.map(link => <Link key={link.href} href={link.href} onClick={() => setOpen(false)} aria-current={pathname === link.href ? "page" : undefined}>{link.label}</Link>)}
      </nav>
    </header>
    <main id="main-content" tabIndex={-1}>{children}</main>
    <footer className="container site-footer">
      <div><Link className="wordmark" href="/">{site.name}</Link><p>{site.description}</p></div>
      <nav aria-label="Footer navigation"><Link href="/docs">Documentation</Link><Link href="/pricing">Pricing</Link><Link href="/contact">Contact</Link><Link href="/legal">Legal</Link></nav>
      <div className="footer-note"><span>Aircraft study · Illustrative visuals</span><span>All product content is placeholder</span></div>
    </footer>
  </>;
}
