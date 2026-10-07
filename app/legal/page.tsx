import type { Metadata } from "next";
import { PlaceholderPage } from "@/components/placeholder-page";
export const metadata: Metadata = { title: "Legal information" };
export default function Page() { return <PlaceholderPage {...{"title":"Legal information","description":"A placeholder for your own legal and policy documents.","rows":[{"title":"Terms","body":"Your terms will appear here."},{"title":"Privacy","body":"Your privacy information will appear here."}]}} />; }
