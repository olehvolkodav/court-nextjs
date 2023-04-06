import React from "react";
import {Badge} from "@/components/ui/Badge";

export const CaseStatus: React.FC<{status: string}> = ({status}) => {
  const normalizeStatus = React.useMemo(() => {
    return status.replace("_", " ")
  }, [status]);

  const color = React.useMemo(() => {
    switch (status) {
      case "in_progress":
        return "orange";
      default:
        return "default"
    }
  }, [status])

  return (
    <Badge className="capitalize" color={color}>
      {normalizeStatus}
    </Badge>
  )
}