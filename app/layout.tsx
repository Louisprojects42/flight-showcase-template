import type { Metadata } from "next";
import { Archivo, Geist, Geist_Mono } from "next/font/google";
import { SiteShell } from "@/components/site-shell";
import { site } from "@/lib/site";
import "./globals.css";
const sans = Geist({ variable: "--font-sans", subsets: ["latin"], display: "optional" });
const display = Archivo({ variable: "--font-display", subsets: ["latin"], weight: "600", display: "swap" });
const mono = Geist_Mono({ variable: "--font-mono", subsets: ["latin"], display: "optional" });
export const metadata: Metadata = {
  title: { default: "Flight showcase", template: "%s · Flight showcase" },
  description: site.description,
};
const init = `try{const c=document.documentElement.classList;c.add("js");if(!matchMedia("(prefers-reduced-motion: reduce)").matches)c.add("motion");if(localStorage.getItem("showcase-motion")==="off")c.add("film-off");if(localStorage.getItem("showcase-theme")==="light")c.add("light");}catch{}`;
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en" suppressHydrationWarning className={sans.variable+" "+display.variable+" "+mono.variable}>
    <body><script dangerouslySetInnerHTML={{ __html: init }} /><SiteShell>{children}</SiteShell></body>
  </html>;
}
