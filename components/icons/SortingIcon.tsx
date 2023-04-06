import React from "react"

interface ISortingIcon {
  className?: string;
}

const SortingIcon: React.FC<ISortingIcon> = ({
  className
}) => {
  return (
    <svg className={className} width="25" height="24" viewBox="0 0 25 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M10.5 8L7.5 5L4.5 8" stroke="#918DA9" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M7.5 19V5" stroke="#918DA9" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M14.5 16L17.5 19L20.5 16" stroke="#918DA9" strokeWidth="1.5" strokeLinecap="round"
            strokeLinejoin="round"/>
      <path d="M17.5 5V19" stroke="#918DA9" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  )
}

SortingIcon.defaultProps = {
  className: ""
};

export default SortingIcon
