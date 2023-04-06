import { FileSlider } from "@/components/file/FileSlider";
import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/Icon";
import { VisitationConfirmModal } from "@/components/visitation/VisitationConfirmModal";
import { VisitationEditFormModal } from "@/components/visitation/VisitationEditFormModal";
import { VisitationFormModal } from "@/components/visitation/VisitationFormModal";
import { VisitationList } from "@/components/visitation/VisitationList";
import { DEFAULT_FILE_QUERY } from "@/graphql/query/file";
import { withDashboardLayout } from "@/hoc/layout";
import { NextPageWithLayout } from "@/interfaces/page.type";
import { $gql } from "@/plugins/http";
import { classNames } from "@/utils/classname";
import { SortAscendingIcon, SortDescendingIcon } from "@heroicons/react/outline";
import { useCallback, useEffect, useMemo, useState } from "react";

const tabs = ["Upcoming", "Past"]

const SCHEDULES_QUERY = `
  query($happen: String, $orderBy: [QueryVisitationSchedulesOrderByOrderByClause!]) {
    visitation_schedules(happen: $happen, orderBy: $orderBy) {
      id
      date
      status
      confirmation_status
      time
      visitation {
        id
        title
        description
        start_at
      }
      files {
        ${DEFAULT_FILE_QUERY}
      }
    }
  }
`

const DEFAULT_ORDER_BY_CREATED_AT = {
  column: "CREATED_AT",
  order: "DESC"
}

const VisitationsPage: NextPageWithLayout = () => {
  const [currentTab, setCurrentTab] = useState("Upcoming");

  // visitation schedules
  const [schedules, setSchedules] = useState<any[]>([]);
  const [selectedSchedule, setSelectedSchedule] = useState<any>();

  const [formOpen, setFormOpen] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);

  const [statusOrder, setStatusOrder] = useState<"asc" | "desc">();

  const orderBy = useMemo(() => {
    if (!statusOrder) {
      return [DEFAULT_ORDER_BY_CREATED_AT]
    }

    return [
      { column: "STATUS", order: statusOrder.toUpperCase() },
      DEFAULT_ORDER_BY_CREATED_AT
    ]
  }, [statusOrder]);

  const toggleOrder = () => {
    if (statusOrder === "asc") {
      return setStatusOrder("desc")
    }

    return setStatusOrder(prev => prev === "desc" ? undefined : "asc")
  }

  const handleChangeTab = (tab: string) => () => {
    setCurrentTab(tab);
  }

  const openFormModal = () => setFormOpen(true);

  const handleVisitationSaved = () => {
    setFormOpen(false);
    getSchedules()
  }

  const getSchedules = useCallback(async () => {
    try {
      const data = await $gql({
        query: SCHEDULES_QUERY,
        variables: {
          happen: currentTab.toLowerCase(),
          orderBy,
        }
      });

      setSchedules(data.visitation_schedules);
    } catch (error) {

    }
  }, [currentTab, orderBy]);

  const updateSchedules = (schedule: any, apiUpdated?: boolean) => {
    if (apiUpdated) {
      setConfirmOpen(false);

      return getSchedules()
    }

    // assumed user clicking not attended button
    setSelectedSchedule(schedule);
    setConfirmOpen(true);
  }

  const handleEditVisitation = (schedule: any) => {
    setSelectedSchedule(schedule);
    setEditOpen(true);
  }

  useEffect(() => {
    getSchedules();
  }, [getSchedules]);

  return (
    <div className="py-4">
      <div className="container px-4 mx-auto">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl text-natural-13 font-medium">
            Visitation
          </h1>

          <div className="flex items-center space-x-2">
            <Button color="default" className="bg-white" onClick={toggleOrder}>
              {!!statusOrder && (
                <Icon
                  as={statusOrder === "asc" ? SortAscendingIcon : SortDescendingIcon}
                  className="h-5 w-5 mr-2"
                />
              )}
              Sort By Status
            </Button>

            <Button onClick={openFormModal}>
              Add Visitation +
            </Button>
          </div>
        </div>

        <div className="mb-4">
          <div className="border-b border-gray-200 flex justify-between items-center">
            <nav className="-mb-px flex space-x-8" aria-label="Tabs">
              {tabs.map((tab) => (
                <button
                  type="button"
                  key={tab}
                  className={classNames(
                    tab === currentTab
                      ? "border-indigo-500 text-indigo-600"
                      : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300",
                    "whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm"
                  )}
                  onClick={handleChangeTab(tab)}
                >
                  {tab}
                </button>
              ))}
            </nav>
          </div>
        </div>

        <div className="grid grid-cols gap-4">
          {schedules.map((schedule) => (
            <VisitationList
              key={schedule.id}
              schedule={schedule}
              onButtonClick={updateSchedules}
              onEditClick={handleEditVisitation}
            />
          ))}
        </div>
      </div>

      <VisitationFormModal
        isOpen={formOpen}
        onClose={setFormOpen}
        onSaved={handleVisitationSaved}
      />

      <VisitationConfirmModal
        schedule={selectedSchedule}
        isOpen={confirmOpen}
        onClose={setConfirmOpen}
        onSaved={updateSchedules}
      />

      <VisitationEditFormModal
        visitation={selectedSchedule?.visitation}
        time={selectedSchedule?.time}
        isOpen={editOpen}
        onClose={setEditOpen}
      />

      <FileSlider />
    </div>
  )
}

export default withDashboardLayout(VisitationsPage, "Court - Visitations");
