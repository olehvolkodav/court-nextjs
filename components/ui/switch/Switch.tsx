import React from "react"
import { Switch as HeadlessSwitch } from "@headlessui/react"
import { classNames } from "@/utils/classname";

interface ISwitchProps {
  checked?: boolean;
  onChange?: (value: any) => any;
  children?: React.ReactNode
}

export const Switch: React.FC<ISwitchProps> = ({checked, onChange, children}) => {
  return (
    <HeadlessSwitch.Group as="div" className="flex items-center">
      <HeadlessSwitch
        checked={checked as boolean}
        onChange={onChange as any}
        className={classNames(
          checked ? "bg-indigo-600" : "bg-gray-200",
          "relative inline-flex flex-shrink-0 h-6 w-11 border-2 border-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        )}
      >
        <span
          aria-hidden="true"
          className={classNames(
            checked ? "translate-x-5" : "translate-x-0",
            "pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow transform ring-0 transition ease-in-out duration-200"
          )}
        />
      </HeadlessSwitch>

      {children}
    </HeadlessSwitch.Group>
  )
}

Switch.defaultProps = {
  checked: false,
  onChange: () => {}
}
