import { CheckCircleIcon, XIcon } from "@heroicons/react/outline";
import { Loading } from "../loading/Loading";

interface Props {
  onClose?: () => void;
  files?: any[];
}

export const FixedUploadedList: React.FC<Props> = ({files, onClose}) => {
  return (
    <div className="fixed bottom-0 right-0 pr-8 w-96">
      <div className="bg-white shadow-sm border rounded-md">
        <div className="px-4 py-3 border-b flex justify-between">
          <span className="text-natural-13 font-medium">{files?.length} Upload Completed</span>

          <button type="button" onClick={onClose}>
            <XIcon className="h-5 w-5" />
          </button>
        </div>

        <div>
          <ul className="divide-y divide-y-200">
            {
              files?.map(file => (
                <li className="flex justify-between items-center px-4 py-2" key={file.key}>
                  <span>{file.file?.name ?? file.name}</span>

                  <span>
                    {file.status === "progress" ? <Loading /> : <CheckCircleIcon className="h-6 w-6 text-green-600" />}
                  </span>
                </li>
              ))
            }
          </ul>
        </div>
      </div>
    </div>
  )
}
