import React from "react"

interface Props {
  color: string
}

const FolderIcon: React.FC<Props> = ({color}) => {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" width="20" height="20">
      <path fill={color} d="M40,12H22l-4-4H8c-2.2,0-4,1.8-4,4v8h40v-4C44,13.8,42.2,12,40,12z"/>
      <path fill={color}
            d="M40,12H8c-2.2,0-4,1.8-4,4v20c0,2.2,1.8,4,4,4h32c2.2,0,4-1.8,4-4V16C44,13.8,42.2,12,40,12z"/>
    </svg>
  )
}
FolderIcon.defaultProps = {
  color: "currentColor"
}
export default FolderIcon
