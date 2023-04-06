import { generateToastID } from "@/components/ui/toast/toast.util";
import { ToastMessage } from "@/components/ui/toast/toast.interface";
import { $toastActions } from "@/store/toast.store";

export const useToast = () => {
  const show = (options: ToastMessage) => {
    if (!options.id) {
      options.id = generateToastID();
    }

    $toastActions.insertToast(options);
  }

  return {
    show
  }
}