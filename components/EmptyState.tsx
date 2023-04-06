import { ShieldExclamationIcon } from "@heroicons/react/outline";

interface IEmptyStateProps {
  title?: string;
  message?: string;
}

export const EmptyState: React.FC<IEmptyStateProps> = ({title, message}) => {
  return (
    <div className="text-center">
      <ShieldExclamationIcon className="mx-auto h-12 w-12 text-gray-400" />
      <h3 className="mt-2 text-sm font-medium text-gray-900">{title}</h3>
      <p className="mt-1 text-sm text-gray-500">{message}</p>
    </div>
  )
}

EmptyState.defaultProps = {
  title: "No data available",
  message: "Get started by creating a new data."
}
