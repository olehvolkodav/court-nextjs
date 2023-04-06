import { ReactProps } from "@/interfaces/react.props";

export const Content: React.FC<ReactProps> = ({ children }) => {
  return (
    <div className="h-full flex">
      <div className="flex-1 flex items-stretch overflow-hidden">
        <main className="flex-1 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  )
}
