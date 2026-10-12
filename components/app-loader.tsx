export function AppLoader() {
  return (
    <div className="flex min-h-dvh items-center justify-center" role="status">
      <div className="flex flex-col items-center gap-3">
        <div className="size-10 animate-spin rounded-full border-2 border-primary border-t-transparent" />
        <span className="text-sm text-muted-foreground">Chargement...</span>
      </div>
    </div>
  )
}
