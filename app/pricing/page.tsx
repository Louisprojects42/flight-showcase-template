import type { Metadata } from "next";
import { PlaceholderPage } from "@/components/placeholder-page";
export const metadata: Metadata = { title: "Pricing" };
export default function Page() { return <PlaceholderPage {...{"title":"Pricing","description":"A placeholder for future plans and pricing.","rows":[{"title":"First plan","body":"Plan details and a price will appear here."},{"title":"Second plan","body":"Plan details and a price will appear here."},{"title":"Questions","body":"Answers about plans will appear here."}]}} />; }
