import React from "react";

interface IShareIcon {
  className?: string;
  stroke?: string;
}

export const ShareIcon = ({
  className,
  stroke
}: IShareIcon) => {
  return (
    <svg
      className={className}
      width="26"
      height="26"
      viewBox="0 0 26 26"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M12.0816 9.94973C7.19359 10.5014 3.49861 14.6347 3.49605 19.5537V20.166C5.62042 17.6068 8.7561 16.1026 12.0816 16.0473V19.2756C12.0817 19.744 12.3495 20.1712 12.771 20.3755C13.1925 20.5797 13.6937 20.5252 14.0614 20.235L22.0548 13.9234C22.3386 13.6997 22.5042 13.3583 22.5042 12.997C22.5042 12.6357 22.3386 12.2943 22.0548 12.0706L14.0614 5.75898C13.6937 5.46881 13.1925 5.41426 12.771 5.61853C12.3495 5.8228 12.0817 6.24997 12.0816 6.71838V9.94973Z"
        stroke={stroke || "#918DA9"}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};
