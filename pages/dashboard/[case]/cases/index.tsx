import React, { useState } from "react";
import { CaseDetailPlaceholder } from "@/components/placeholders/CaseDetail.placeholder";
import { Button } from "@/components/ui/button";
import { NextPageWithLayout } from "@/interfaces/page.type";
import { withDashboardLayout } from "@/hoc/layout";
import { HearingModal } from "@/components/case/HearingModal";
import { CaseDetail } from "@/components/case/CaseDetail";
import { useCaseDashboard } from "@/hooks/case.hook";
import { CaseForm } from "@/components/case/CaseForm";

const CaseDetailPage: NextPageWithLayout = () => {
  const [hearingModalOpen, setHearingModalOpen] = useState(false);

  const [courtCase, caseLoading] = useCaseDashboard("no-cache");

  const handleAddHearing = () => {
    setHearingModalOpen(true);
  }

  return (
    <>
      <div className="py-4">
        <div className="container px-4 mx-auto">
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-2xl font-medium text-natural-13">Case Detail</h1>

            {courtCase?.userRole !== "viewer" && (
              <div className="flex items-center space-x-4">
                <Button onClick={handleAddHearing}>
                  + Add Hearing
                </Button>
              </div>
            )}
          </div>

          {caseLoading ? <CaseDetailPlaceholder /> : (
            !courtCase ? (
              <>
                <CaseForm />
              </>
            ) : (
              <CaseDetail courtCase={courtCase} />
            )
          )}
        </div>
      </div>

      <HearingModal
        courtCase={courtCase}
        isOpen={hearingModalOpen}
        onClose={setHearingModalOpen}
      />
    </>
  )
}

export default withDashboardLayout(CaseDetailPage, "Court - Case Detail");
