export const LoadingScreen = () => (
  <div className="flex min-h-screen items-center justify-center bg-ink bg-mesh text-white">
    <div className="text-center">
      <div className="mx-auto h-14 w-14 animate-spin rounded-full border-4 border-white/20 border-t-command" />
      <p className="mt-4 text-sm uppercase tracking-[0.24em] text-white/70">Synchronizing command dashboard</p>
    </div>
  </div>
);
