export const getPriorityColor = (priority: "High" | "Medium" | "Low") => {
  if (priority === "High") {
    return "bg-[#FB6839]";
  }

  if (priority === "Medium") {
    return "bg-[#F59E0B]";
  }

  // low
  return "bg-[#1EB8FE]";
};

export const PRIORITY_OPTIONS = [
  { name: "High", value: "1" },
  { name: "Medium", value: "2" },
  { name: "Low", value: "3" },
];

export const TAG_OPTIONS = [
  { name: "Court", value: "court" },
  { name: "Journal", value: "journal" },
  { name: "Notes", value: "notes" },
  { name: "Task", value: "task" },
  { name: "Checklist", value: "checklist" },
];
