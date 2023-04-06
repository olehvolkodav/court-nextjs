import { CALENDAR_TYPE_OPTIONS } from "@/constants/calendar";
import { L10n } from "@syncfusion/ej2-base";

export const getTileData = (itemToGet: string, type: string) => {
  let data: string | undefined = "";
  let typeFound = CALENDAR_TYPE_OPTIONS.find((_type) => _type.value === type.charAt(0).toLowerCase() + type.slice(1));
  if (itemToGet === "color") data = typeFound?.color;
  if (itemToGet === "bgColor") data = typeFound?.bgColor;
  if (itemToGet === "title") data = typeFound?.name;
  if (itemToGet === "url") data = typeFound?.href;
  return data;
};

export const onActionBegin = (args: { requestType: string; cancel: boolean }) => {
  if (args.requestType === "eventCreate") {
    args.cancel = true;
  }
};
export const onPopupOpen = (args: { data: { Id: any }; type: string; cancel: boolean }) => {
  if (!args.data.Id) {
    args.cancel = true;
  }
};
L10n.load({
  "en-US": {},
});
