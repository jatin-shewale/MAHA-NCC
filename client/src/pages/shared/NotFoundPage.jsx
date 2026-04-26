import { Link } from "react-router-dom";

export const NotFoundPage = () => (
  <div className="flex min-h-screen flex-col items-center justify-center bg-ink bg-mesh px-4 text-white">
    <h1 className="font-display text-6xl font-bold">404</h1>
    <p className="mt-4 text-slate-300">The requested route is outside command scope.</p>
    <Link to="/" className="mt-6 rounded-2xl bg-brand-500 px-5 py-3 font-semibold text-white">
      Return Home
    </Link>
  </div>
);
