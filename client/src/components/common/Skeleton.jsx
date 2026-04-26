export const Skeleton = ({ className = "h-24 w-full" }) => (
  <div className={`animate-pulse rounded-2xl bg-slate-200/70 dark:bg-slate-700/40 ${className}`} />
);
