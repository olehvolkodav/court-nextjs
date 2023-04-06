// Remix icons

import React, { SVGProps } from "react";
import { remixIcons } from "./icons";

interface Props extends SVGProps<SVGSVGElement> {
  name: string;
}

export const Remix: React.FC<Props> = ({name, ...rest}) => {
  const remixIcon = React.useMemo(() => {
    const icon = remixIcons.find(o => o.name === name);

    if (!icon) {
      return null;
    }

    return icon;
  }, [name]);

  return(
    <svg width="24" height="24" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" {...rest}>
      {remixIcon?.path.map((iconPath, i) => (
        <path key={i} d={iconPath.d} fill={iconPath.fill}/>
      )) }
    </svg>
  )
}