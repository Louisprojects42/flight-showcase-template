import type { Metadata } from "next";
import { PlaceholderPage } from "@/components/placeholder-page";
export const metadata: Metadata = { title: "Documentation" };
export default function Page() { return <PlaceholderPage {...{"title":"Documentation","description":"A place for guides, examples and reference material.","rows":[{"title":"Getting started","body":"An introductory guide will appear here.","href":"/docs/getting-started"},{"title":"Guides","body":"Step-by-step content will appear here.","href":"/docs/guides"},{"title":"Reference","body":"Reference content will appear here.","href":"/docs/reference"}]}} />; }
