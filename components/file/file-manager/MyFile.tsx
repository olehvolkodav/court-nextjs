import { DEFAULT_FILE_QUERY } from "@/graphql/query/file"
import { $gql } from "@/plugins/http";
import { useEffect, useState } from "react";
import { FileCover } from "../FileCover";

const ROOT_FOLDER_QUERY = `
  query {
    folder: my_root_file {
      ${DEFAULT_FILE_QUERY}
      children(orderBy: [{column: TYPE, order: DESC}]) {
        ${DEFAULT_FILE_QUERY}
      }
    }
  }
`

export const MyFile: React.FC = () => {
  const [folder, setFolder] = useState<any>();

  useEffect(() => {
    const getFolder = async() => {
      try {
        const data = await $gql({
          query: ROOT_FOLDER_QUERY
        });
  
        setFolder(data.folder);
      } catch (error) {
        console.log(error)
      }
    }

    getFolder();
  }, [])

  return (
    <div className="px-4 py-2">
      <ul className="grid grid-cols lg:grid-cols-5 gap-4">
        {folder?.children.map((file: any) => (
          <li key={file.id} className="relative">
            <div className="group block w-full aspect-w-7 aspect-h-4 rounded-lg bg-white overflow-hidden">
              <FileCover file={file} />
            </div>

            <p className="mt-2 block text-sm font-medium text-gray-900 truncate pointer-events-none">
              {file.name}
            </p>
          </li>
        ))}
      </ul>
    </div>
  )
}
