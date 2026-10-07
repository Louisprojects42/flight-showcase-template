export const site = {
  name: "Your project",
  description: "An aircraft study in colour, space and motion.",
  links: [
    { href: "/", label: "Overview" },
    { href: "/capabilities", label: "Capabilities" },
    { href: "/workspace", label: "Workspace" },
    { href: "/docs", label: "Docs" },
    { href: "/pricing", label: "Pricing" },
  ],
};
export const assetPath = (p: string) => (process.env.NEXT_PUBLIC_BASE_PATH || "") + p;
