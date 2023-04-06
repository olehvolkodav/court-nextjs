import { FileSlider } from "@/components/file/FileSlider";
import { VisitationConfirmModal } from "@/components/visitation/VisitationConfirmModal";
import { VisitationEditFormModal } from "@/components/visitation/VisitationEditFormModal";
import { VisitationFormModal } from "@/components/visitation/VisitationFormModal";
import { VisitationList } from "@/components/visitation/VisitationList";
import { useState } from "react";

export const VisitationPreview = ({ source, scheduleObj }) => {
  // visitation schedules
  const [selectedSchedule, setSelectedSchedule] = useState<any>();
  const [formOpen, setFormOpen] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);

  const handleVisitationSaved = () => {
    setFormOpen(false);
  };

  const updateSchedules = (schedule: any, apiUpdated?: boolean) => {
    if (apiUpdated) {
      setConfirmOpen(false);
    }
    scheduleObj.closeEditor();
    // assumed user clicking not attended button
    setSelectedSchedule(schedule);
    setConfirmOpen(true);
  };

  const handleEditVisitation = (schedule: any) => {
    setSelectedSchedule(schedule);
    setEditOpen(true);
  };

  return (
    <div className="py-4">
      <div className="container px-4 mx-auto">
        <div className="grid grid-cols gap-4">
          <VisitationList
            isInsideModal
            schedule={source}
            onButtonClick={updateSchedules}
            onEditClick={handleEditVisitation}
          />
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
  );
};
