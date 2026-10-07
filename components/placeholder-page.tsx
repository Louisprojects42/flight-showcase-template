import Link from "next/link";
export function PlaceholderPage({ title, description, rows }: { title: string; description: string; rows: { title: string; body: string; href?: string }[] }) {
  return <div className="container document-page">
    <h1>{title}<span className="muted">, to come.</span></h1>
    <p className="document-intro">{description}</p>
    <p className="placeholder-notice">Placeholder content · This page is part of a visual showcase.</p>
    <div className="ruled-list">{rows.map(row => <section key={row.title}><h2>{row.title}</h2><div><p>{row.body}</p>{row.href && <Link className="text-link" href={row.href}>Open {row.title.toLowerCase()}</Link>}</div></section>)}</div>
    <Link className="text-link back-link" href="/">Back to the aircraft study</Link>
  </div>;
}
