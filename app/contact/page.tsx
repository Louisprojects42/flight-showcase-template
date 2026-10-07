import type { Metadata } from "next";
import { PlaceholderPage } from "@/components/placeholder-page";
export const metadata: Metadata = { title: "Contact" };
export default function Page() { return <PlaceholderPage {...{"title":"Contact","description":"A place for your public contact information.","rows":[{"title":"Get in touch","body":"Add your preferred contact method when you are ready."}]}} />; }
