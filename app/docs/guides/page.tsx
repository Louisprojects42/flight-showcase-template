import type { Metadata } from "next";
import { PlaceholderPage } from "@/components/placeholder-page";
export const metadata: Metadata = { title: "Guides" };
export default function Page() { return <PlaceholderPage {...{"title":"Guides","description":"Your step-by-step guides belong here.","rows":[{"title":"Your first guide","body":"Add guide content when it is ready."}]}} />; }
