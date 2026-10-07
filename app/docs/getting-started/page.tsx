import type { Metadata } from "next";
import { PlaceholderPage } from "@/components/placeholder-page";
export const metadata: Metadata = { title: "Getting started" };
export default function Page() { return <PlaceholderPage {...{"title":"Getting started","description":"Your introductory guide belongs here.","rows":[{"title":"Welcome","body":"Add a short introduction for your readers."},{"title":"First steps","body":"Add the first steps when your content is ready."}]}} />; }
