import React from "react";
import { Input, InputProps } from "./Input";

interface Props extends InputProps {
  onPhoneChange?: (data: any) => any
}

export const PhoneInput: React.FC<Props> = ({onPhoneChange, ...rest}) => {
  const formatPhone = (value?: string) => {
    return value?.replace(/\D/g, "").match(/(\d{0,3})(\d{0,3})(\d{0,4})/);
  }

  const [phone, setPhone] = React.useState(() => {
    const x = formatPhone(rest.value as string);

    if (x) {
      return !x[2] ? x[1] : "(" + x[1] + ") " + x[2] + (x[3] ? "-" + x[3] : "")
    }
  });

  const onChangeText = (text: string) => {
    if (text.length == 1 && text == "1") {
      setPhone("");

      if (onPhoneChange) {
        onPhoneChange(null);
      }

    } else {
      const x = formatPhone(text);

      if (x) {
        setPhone(!x[2] ? x[1] : "(" + x[1] + ") " + x[2] + (x[3] ? "-" + x[3] : ""));

        if (onPhoneChange) {
          onPhoneChange(x[0]);
        }
      }
    }
  };

  return (
    <Input {...rest} onChangeText={onChangeText} value={phone}/>
  )
}

PhoneInput.defaultProps = {
  type: "tel",
  inputMode: "numeric",
  placeholder: "(333) 333-3333"
}
