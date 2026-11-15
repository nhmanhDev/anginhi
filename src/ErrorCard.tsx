export function ErrorCard({
  title,
  message,
  closeLabel,
  onClose,
}: {
  title: string
  message: string
  closeLabel: string
  onClose: () => void
}) {
  return (
    <div className="error-card glass-panel" role="alert">
      <div>
        <p className="error-card-title">{title}</p>
        <p className="error-card-body">{message}</p>
      </div>
      <button type="button" className="ghost" onClick={onClose}>
        {closeLabel}
      </button>
    </div>
  )
}
