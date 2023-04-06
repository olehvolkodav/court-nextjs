import { useState } from "react"
import { SearchIcon } from "@heroicons/react/solid"
import { EmojiSadIcon, GlobeIcon, SelectorIcon } from "@heroicons/react/outline"
import { Combobox } from "@headlessui/react"
import { classNames } from "@/utils/classname"

const items: any[] = [
  { id: 1, name: "Workflow Inc.", category: "Clients", url: "#" },
  // More items...
]

interface Props {
  options: any[]
  defaultValue?: any;
}

export const MultiGroup: React.FC = () => {
  const [query, setQuery] = useState("")

  const filteredItems =
    query === ""
      ? []
      : items.filter((item) => {
        return item.name.toLowerCase().includes(query.toLowerCase())
      })

  const groups = filteredItems.reduce((groups, item) => {
    return { ...groups, [item.category]: [...(groups[item.category] || []), item] }
  }, {})

  return (
    <Combobox onChange={() => {}} value="">
      <div className="relative">
        <Combobox.Input
          className="w-full rounded-md border border-gray-300 bg-white py-2 pl-3 pr-10 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 sm:text-sm"
          onChange={() => {}}
          placeholder="Select Value"
        />

        <Combobox.Button className="absolute inset-y-0 right-0 flex items-center rounded-r-md px-2 focus:outline-none">
          <SelectorIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
        </Combobox.Button>
      </div>
    </Combobox>
  )
}
