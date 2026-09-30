import { Dialog, DialogPanel, DialogTitle } from "@headlessui/react";
import type { ComponentProps, ReactNode } from "react";
import Button from "../atoms/button";

type AlertDialogProps = {
  open: boolean;
  onClose: () => void;
  title?: ReactNode;
  children?: ReactNode;
  onSubmit?: ComponentProps<"button">["onClick"];
  loading?: boolean;
};

export default function AlertDialog({
  open,
  onClose,
  title,
  children,
  onSubmit,
  loading,
}: AlertDialogProps) {
  return (
    <Dialog open={open} onClose={onClose} className="relative z-50">
      <div className="fixed inset-0 bg-slate-950/40" aria-hidden="true" />
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <DialogPanel className="w-full max-w-lg rounded-xl bg-white p-6 shadow-xl">
          <DialogTitle className="text-lg font-semibold text-slate-900">
            {title ?? "title"}
          </DialogTitle>
          <div className="mt-4 border-y border-slate-200 py-4">
            {children ?? <p>DialogContent</p>}
          </div>
          <div className="mt-5 flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="rounded-md px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-100"
            >
              Cancel
            </button>
            <Button
              loading={loading}
              disabled={loading}
              onClick={onSubmit}
              label="Submit"
            />
          </div>
        </DialogPanel>
      </div>
    </Dialog>
  );
}
