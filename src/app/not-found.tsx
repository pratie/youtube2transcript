import Link from "next/link";

export default function NotFound() {
  return (
    <main className="legal-page">
      <span className="eyebrow">404</span>
      <h1>That page isn’t here.</h1>
      <p>The transcript tool is waiting on the homepage.</p>
      <Link className="button button-primary" href="/">Go to YouTube2Transcript</Link>
    </main>
  );
}
