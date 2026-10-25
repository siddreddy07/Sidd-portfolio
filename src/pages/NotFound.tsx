import { Link } from "react-router";

export default function NotFound() {
  return (
    <section className="mx-auto max-w-5xl px-5 py-24 md:px-8">
      <p className="font-mono text-xs uppercase tracking-widest text-text-secondary">404</p>
      <h1 className="mt-3 font-display text-5xl">That page doesn't exist.</h1>
      <Link to="/" className="mt-8 inline-block font-mono text-sm text-accent-text underline underline-offset-4">
        Back to home
      </Link>
    </section>
  );
}
