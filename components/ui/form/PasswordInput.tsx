import React from "react";
import { EyeIcon, EyeOffIcon } from "@heroicons/react/outline";

const eyeClass = "text-gray-400 group-hover:text-indigo-600 group-focus:text-indigo-600 h-5 w-5";

type Props = React.InputHTMLAttributes<HTMLInputElement> & {
  onChangeText?: (value: string) => any;
}

export const PasswordInput: React.FC<Props> = ({onChangeText, ...rest}) => {
  const [show, setShow] = React.useState(false);

  const toggle = () => setShow(prev => !prev);

  const handleChange: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    if (rest.onChange) {
      rest.onChange(e);
    }

    if (onChangeText) {
      onChangeText(e.target.value)
    }
  }

  return (
    <div className="relative rounded-md shadow-sm">
      <input type={show ? "text" : "password"}
        className="focus:ring-0 block w-full pr-10 sm:text-sm border-gray-300 rounded" {...rest} onChange={handleChange} />

      <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
        <button type="button" className="group" onClick={toggle} tabIndex={-1}>
          {
            show ? <EyeOffIcon className={eyeClass} /> : <EyeIcon className={eyeClass} />
          }
        </button>
      </div>
    </div>
  )
}
