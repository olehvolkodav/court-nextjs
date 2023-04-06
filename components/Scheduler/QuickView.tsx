import { XIcon } from "@heroicons/react/outline";
import { getTileData } from "./helpers";

const QuickView: any = (props: any) => {
  const handleClosePopup = () => {
    props.scheduleObj.quickPopup.quickPopup.close();
  };
  if (props?.elementType === "event") {
    return (
      <div
        style={{ background: getTileData("bgColor", props.Type.__typename), color: getTileData("color", props.Type.__typename) }}
        className="rounded-md text-white scheduler-quick-view">
        <button className="absolute w-4 h-4 m-auto inset-0 mr-1 mt-2" type="button" onClick={handleClosePopup}>
          <XIcon className="h-4 w-4 text-gray-800" />
        </button>
        <h3
          className="font-semibold text-sm">
          {getTileData("title", props.Type.__typename)}
        </h3>
        <p
          className="text-xs font-medium">{props.Subject}</p>
      </div>
    );
  } else {
    return null;
  }
};
export default QuickView;
