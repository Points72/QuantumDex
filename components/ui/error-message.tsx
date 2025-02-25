interface ErrorMessageProps {
  message: string
}

export function ErrorMessage({ message }: ErrorMessageProps) {
  return (
    <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4 text-red-500">
      <p>{message}</p>
    </div>
  )
}

