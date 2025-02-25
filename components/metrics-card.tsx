interface MetricsCardProps {
  title: string
  value: string
  className?: string
}

export function MetricsCard({ title, value, className }: MetricsCardProps) {
  return (
    <div className={`bg-slate-800 rounded-xl p-6 ${className}`}>
      <h3 className="text-gray-400 text-sm mb-2">{title}</h3>
      <p className="text-2xl font-bold">{value}</p>
    </div>
  )
}

