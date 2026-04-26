export const SectionHeader = ({ eyebrow, title, description, action }) => (
  <div className="mb-5 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
    <div>
      {eyebrow ? <p className="text-xs font-semibold uppercase tracking-[0.24em] text-command">{eyebrow}</p> : null}
      <h2 className="mt-2 font-display text-2xl font-semibold text-slate-900 dark:text-white">{title}</h2>
      {description ? <p className="mt-2 max-w-2xl text-sm text-slate-500 dark:text-slate-300">{description}</p> : null}
    </div>
    {action}
  </div>
);
