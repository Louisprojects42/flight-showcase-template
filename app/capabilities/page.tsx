import type { Metadata } from "next";
import { PlaceholderPage } from "@/components/placeholder-page";
export const metadata: Metadata = { title: "Capabilities" };
export default function Page() { return <PlaceholderPage {...{"title":"Capabilities","description":"A place for the features and ideas you want to share.","rows":[{"title":"First capability","body":"Describe a feature here when your content is ready."},{"title":"Second capability","body":"Add another feature and explain what it offers."},{"title":"The details","body":"Use this space for supporting information."}]}} />; }
