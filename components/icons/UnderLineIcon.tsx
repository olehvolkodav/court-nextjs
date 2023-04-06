import React from "react"

const UnderLineIcon: React.FC = () => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={"16"}
      height={"16"}
      viewBox="0 0 24 24"
      fill="none"
      stroke={"currentColor"}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M6 3v7a6 6 0 0 0 6 6 6 6 0 0 0 6-6V3"/>
      <line x1="4" y1="21" x2="20" y2="21"/>
    </svg>
  )
}

export default UnderLineIcon
