import React from "react";
import { useStore } from "effector-react";
import { $toasts } from "@/store/toast.store";
import { Toast } from "@/components/ui/toast/Toast";

export const ToastContainer: React.FC = () => {
  const toasts = useStore($toasts);

  return (
    <div
      aria-live="assertive"
      className="fixed inset-0 z-30 flex items-end px-4 py-6 pointer-events-none justify-end"
    >
      <div id="toast-container" className="w-full flex flex-col justify-end items-end space-y-2">
        {toasts.map(toast => (
          <Toast key={toast.id} message={toast} />
        ))}
      </div>
    </div>
  )
}
