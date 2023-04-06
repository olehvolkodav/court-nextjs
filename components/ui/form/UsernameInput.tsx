import { Input, InputProps } from "./Input"

export const UsernameInput: React.FC<InputProps> = (props) => {
  return (
    <div className="relative rounded-md shadow-sm">
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-600">
        @
      </div>
      <Input
        className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md read-only:bg-gray-50 pl-8"
        {...props}
      />
    </div>
  )
}
