import type { Metadata } from "next";
import { PlaceholderPage } from "@/components/placeholder-page";
export const metadata: Metadata = { title: "Your workspace" };
export default function Page() { return <PlaceholderPage {...{"title":"Your workspace","description":"A placeholder for a future workspace experience.","rows":[{"title":"Your projects","body":"Project content will appear here."},{"title":"Your activity","body":"Activity content will appear here."}]}} />; }
