export const BillingPlaceholder: React.FC = () => {
  return (
    <div className="bg-white shadow-sm rounded-lg">
      <div className="px-4 py-2 animate-pulse">
        <div className="flex justify-between items-center mb-4">
          <span className="h-6 rounded-lg bg-slate-200 w-48" />

          <span className="h-4 rounded bg-slate-200 w-8" />
        </div>

        <div className="flex flex-col text-sm text-gray-600 space-y-2">
          <span className="h-4 rounded-lg bg-slate-200 w-32" />
          <span className="h-4 rounded-lg bg-slate-200 w-40" />
          <span className="h-4 rounded-lg bg-slate-200 w-40" />
        </div>
      </div>
    </div>
  )
}
