export const CaseDetailPlaceholder: React.FC = () => {
  return (
    <div className="space-y-4">
      <div className="border border-indigo-300 shadow rounded-md p-6 w-full mx-auto">
        <div className="animate-pulse">
          <div className="grid grid-cols-4 gap-4 items-center">
            <div className="space-y-2">
              <div className="h-8 bg-slate-200 rounded"></div>
              <div className="h-4 bg-slate-200 rounded"></div>
            </div>

            <div className="space-y-2">
              <div className="h-4 bg-slate-200 rounded"></div>
              <div className="h-4 bg-slate-200 rounded"></div>
            </div>

            <div className="space-y-2">
              <div className="h-4 bg-slate-200 rounded"></div>
              <div className="h-4 bg-slate-200 rounded"></div>
            </div>

            <div className="space-y-2">
              <div className="h-4 bg-slate-200 rounded"></div>
              <div className="h-4 bg-slate-200 rounded"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
