import type { Metadata } from "next";
import { PlaceholderPage } from "@/components/placeholder-page";
export const metadata: Metadata = { title: "Reference" };
export default function Page() { return <PlaceholderPage {...{"title":"Reference","description":"Your reference material belongs here.","rows":[{"title":"Your first reference","body":"Add reference content when it is ready."}]}} />; }
