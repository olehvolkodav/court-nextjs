import type { SVGProps } from "react"

interface IIconProps extends SVGProps<SVGSVGElement> {
  as: (props: SVGProps<SVGSVGElement>) => JSX.Element
}

export const Icon: React.FC<IIconProps> = ({as: IconComponent, ...rest}) => {
  return (
    <IconComponent {...rest}/>
  )
}
