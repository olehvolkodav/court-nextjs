import { InputProps } from "./Input"

interface Props extends InputProps {
  symbol?: "$",
  currency?: string;
}

export const CurrencyInput: React.FC<Props> = ({symbol, onChangeText, currency, ...rest}) => {
  const onInputChange: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    if (rest.onChange) {
      rest.onChange(e);
    }

    if (onChangeText) {
      onChangeText(e.target.value)
    }
  }

  return (
    <div className="relative rounded-md shadow-sm">
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
        <span className="text-gray-500 sm:text-sm">{symbol}</span>
      </div>
      <input
        {...rest}
        onChange={onInputChange}
      />
      <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
        <span className="text-gray-500 sm:text-sm uppercase">
          {currency}
        </span>
      </div>
    </div>
  )
}

CurrencyInput.defaultProps = {
  symbol: "$",
  className: "focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-7 pr-12 sm:text-sm border-gray-300 rounded-md",
  placeholder: "0.00",
  type: "text",
  currency: "USD",
}
