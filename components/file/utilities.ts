import _clone from "lodash.clonedeep";
import _escapeRegExp from "lodash.escaperegexp";

export const swapTags = (text) => {
  let displayText = text;
  const tags = text.match(/@\{\{[^\}]+\}\}/gi) || [];
  tags.map((myTag) => {
    const tagData = myTag.slice(3, -2);
    const tagDataArray = tagData.split("||");
    const tagDisplayValue = tagDataArray[2];
    displayText = displayText.replace(
      new RegExp(_escapeRegExp(myTag), "gi"),
      tagDisplayValue
    );
  });
  return displayText;
};
