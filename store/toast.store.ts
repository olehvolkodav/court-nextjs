import { ToastMessage } from "@/components/ui/toast/toast.interface";
import { createEvent, createStore } from "effector";

const insertToast = createEvent<ToastMessage>('insertToast');
const removeToast = createEvent<string | number>('removeToast')

export const $toasts = createStore<ToastMessage[]>([])
  .on(insertToast, (toasts, payload) => [...toasts, payload])
  .on(removeToast, (toasts, id) => toasts.filter(o => o.id != id))

export const $toastActions = {
  insertToast,
  removeToast,
}