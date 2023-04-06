import { $errors } from "@/store/error.store";
import { useStore } from "effector-react";
import React from "react";

interface Props {
  name: string;
  children?: React.ReactNode;
}

export const FieldError: React.FC<Props> = ({name, children}) => {
  const errors = useStore($errors);

  const error = React.useMemo(() => {
    return errors[name];
  }, [errors, name]);

  if (!error?.length) {
    return null;
  }

  return (
    <span className="text-xs text-red-600 mt-1 block">
      {/* only first validation for now */}
      {!!children ? children : error[0]}
    </span>
  )
}
