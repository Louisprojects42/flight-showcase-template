import Link from "next/link";
export default function NotFound() { return <div className="container document-page"><h1>A little off course.</h1><p className="document-intro">There is no page at this address.</p><Link href="/" className="button">Back to the overview</Link></div>; }
