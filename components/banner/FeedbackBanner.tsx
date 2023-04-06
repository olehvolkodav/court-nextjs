import { XIcon } from "@heroicons/react/outline";
import * as Sentry from "@sentry/nextjs";
import { useState } from "react";

// TODO: close banner from cookie?
export const FeedbackBanner: React.FC = () => {
  const [show, setShow] = useState(true);

  const openReportDialog = () => {
    Sentry.showReportDialog({
      eventId: Sentry.captureMessage("Feedback Banner Clicked", "info"),
      title: "Feedback, Bug Report",
    })
  }

  const closeBanner = () => setShow(false);

  if (!show) {
    return null;
  }

  return (
    <div className="relative bg-[#6200EE]">
      <div className="max-w-7xl mx-auto py-3 px-3 sm:px-6 lg:px-8">
        <div className="pr-16 sm:text-center sm:px-16">
          <p className="font-medium text-white">
            <span>
              Have Feedback, Found A Bug.
            </span>
            <span className="block sm:ml-2 sm:inline-block">
              <button
                type="button"
                className="text-white font-bold underline"
                onClick={openReportDialog}
              >
                {" "}
                Click Here To Submit<span aria-hidden="true">&rarr;</span>
              </button>
            </span>
          </p>
        </div>
        <div className="absolute inset-y-0 right-0 pt-1 pr-1 flex items-start sm:pt-1 sm:pr-2 sm:items-start">
          <button
            type="button"
            className="flex p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-white"
            onClick={closeBanner}
          >
            <span className="sr-only">Dismiss</span>
            <XIcon className="h-6 w-6 text-white" aria-hidden="true" />
          </button>
        </div>
      </div>
    </div>
  )
}
