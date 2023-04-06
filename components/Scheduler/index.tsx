import * as React from "react";
import { ScheduleComponent, EventSettingsModel, Inject, Day, Week, Month, Year, Agenda, MonthAgenda, TimelineViews, TimelineMonth, TimelineYear, ViewsDirective, ViewDirective } from "@syncfusion/ej2-react-schedule";
import QuickView from "./QuickView";
import { ToolbarComponent, ItemsDirective, ItemDirective } from "@syncfusion/ej2-react-navigations";
import { SchedulerModal } from "./SchedulerModal";

import { onActionBegin, onPopupOpen } from "./helpers";
import { Tile } from "./Tile";
import { Loading } from "../ui/loading";
export const TimelineScheduler = ({ data, orientation }) => {
  const [scheduleObj, setScheduleObj] = React.useState<any>();
  const [activities, setActivities] = React.useState<any[]>([]);

  React.useEffect(() => {
    setActivities(data);
  }, [data, orientation, scheduleObj]);
  const onToolbarItemClicked = (args: { item: { text: any; }; }) => {
    const isTimelineView = orientation === "vertical";
    switch (args.item.text) {
      case "Day":
        if (scheduleObj) scheduleObj.currentView = isTimelineView ? "TimelineDay" : "Day";
        break;
      case "Week":
        if (scheduleObj) scheduleObj.currentView = isTimelineView ? "TimelineWeek" : "Week";
        break;
      case "WorkWeek":
        if (scheduleObj) scheduleObj.currentView = isTimelineView ? "TimelineWorkWeek" : "WorkWeek";
        break;
      case "Month":
        if (scheduleObj) scheduleObj.currentView = isTimelineView ? "TimelineMonth" : "Month";
        break;
      case "Year":
        if (scheduleObj) scheduleObj.currentView = isTimelineView ? "TimelineYear" : "Year";
        break;
      case "Agenda":
        if (scheduleObj) scheduleObj.currentView = "Agenda";
        break;
    }
  };

  React.useEffect(() => {
    if (scheduleObj) {
      scheduleObj.timeScale.enable = true;
      scheduleObj.rowAutoHeight = true;
      if (orientation === "vertical") {
        switch (scheduleObj.currentView) {
          case "Day":
            scheduleObj.currentView = "TimelineDay";
            break;
          case "Week":
            scheduleObj.currentView = "TimelineWeek";
            break;
          case "WorkWeek":
            scheduleObj.currentView = "TimelineWorkWeek";
            break;
          case "Month":
            scheduleObj.currentView = "TimelineMonth";
            break;
          case "Year":
            scheduleObj.currentView = "TimelineYear";
            break;
          case "Agenda":
            scheduleObj.currentView = "Agenda";
            break;
        }
      } else {
        switch (scheduleObj.currentView) {
          case "TimelineDay":
            scheduleObj.currentView = "Day";
            break;
          case "TimelineWeek":
            scheduleObj.currentView = "Week";
            break;
          case "TimelineWorkWeek":
            scheduleObj.currentView = "WorkWeek";
            break;
          case "TimelineMonth":
            scheduleObj.currentView = "Month";
            break;
          case "TimelineYear":
            scheduleObj.currentView = "Year";
            break;
          case "Agenda":
            scheduleObj.currentView = "Agenda";
            break;
        }
      }
    }
  }, [orientation, scheduleObj]);

  const MiniPopup: any = (props: JSX.IntrinsicAttributes) => <QuickView {...props} scheduleObj={scheduleObj} />

  return (
    <div>
      <div style={{ height: "70px", width: "calc(100% - 50px)" }} className='scheduler-holder'>
        <ToolbarComponent id='toolbar_options' width='100%' height={70} clicked={onToolbarItemClicked}>
          <ItemsDirective>
            <ItemDirective tooltipText='Day' text='Day' />
            <ItemDirective tooltipText='Week' text='Week' />
            <ItemDirective tooltipText='Month' text='Month' />
            <ItemDirective tooltipText='Year' text='Year' />
            <ItemDirective tooltipText='Agenda' text='Agenda' />
          </ItemsDirective>
        </ToolbarComponent>
      </div>
      {!activities.length ?
        <div className="min-h-[600px] flex items-center justify-center">
          <Loading />
        </div>
        :
        <ScheduleComponent
          ref={(t) => setScheduleObj(t)}
          className='scheduler-wrapper'
          currentView='Month'
          eventSettings={{ dataSource: activities, template: Tile }}
          quickInfoTemplates={{
            header: "",
            content: MiniPopup,
            footer: "",
          }}
          actionBegin={onActionBegin}
          editorTemplate={(props: any) => <SchedulerModal props={props} scheduleObj={scheduleObj} />}
          popupOpen={onPopupOpen}>
          <ViewsDirective>
            <ViewDirective option='Day' />
            <ViewDirective option='Week' />
            <ViewDirective option='Month' />
            <ViewDirective option='Year' />
            <ViewDirective option='Agenda' />
            <ViewDirective option='MonthAgenda' />
            <ViewDirective option='TimelineDay' />
            <ViewDirective option='TimelineWeek' />
            <ViewDirective option='TimelineMonth' />
            <ViewDirective option='TimelineYear' />
          </ViewsDirective>
          <Inject services={[Day, Week, Month, Year, Agenda, MonthAgenda, TimelineViews, TimelineMonth, TimelineYear]} />
        </ScheduleComponent>
      }
    </div>
  );
};
