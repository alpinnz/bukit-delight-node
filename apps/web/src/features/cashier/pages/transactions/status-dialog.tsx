import { Dialog, DialogPanel, DialogTitle } from "@headlessui/react";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { TransactionStatus } from "@bukit-delight/shared";
import Actions from "../../../../actions";
import type { AppDispatch } from "../../../../store";
import CashierTransactionTimeline from "./timeline";

type CashierStatusState = {
  Transactions: {
    dialog_status: { open: boolean };
    transaction: { status: TransactionStatus } | null;
  };
};

const CashierTransactionStatusDialog = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { open, transaction } = useSelector((state: CashierStatusState) => ({
    open: state.Transactions.dialog_status.open,
    transaction: state.Transactions.transaction,
  }));
  const [status, setStatus] = useState<TransactionStatus | "">("");

  useEffect(() => {
    if (transaction) setStatus(transaction.status);
  }, [transaction]);

  const closeStatus = () => {
    dispatch(Actions.Transactions.openDialogReview());
    dispatch(Actions.Transactions.hideDialogStatus());
  };
  const submitStatus = () => {
    if (status) dispatch(Actions.Transactions.onUpdateStatus({ status }));
  };

  if (!transaction) return null;

  return (
    <Dialog open={open} onClose={closeStatus} className="relative z-50">
      <div className="fixed inset-0 bg-slate-950/40" aria-hidden="true" />
      <div className="fixed inset-0 overflow-y-auto sm:flex sm:items-center sm:justify-center sm:p-4">
        <DialogPanel className="min-h-full w-full bg-white shadow-xl sm:min-h-0 sm:max-w-xl sm:rounded-xl">
          <header className="flex items-center bg-brand-primary px-4 py-3 text-white">
            <DialogTitle className="flex-1 text-lg font-semibold">
              Transaction Update Status
            </DialogTitle>
            <button
              type="button"
              autoFocus
              onClick={closeStatus}
              aria-label="Tutup pembaruan status"
              className="rounded-md p-2 hover:bg-white/10 focus-visible:outline-2 focus-visible:outline-white"
            >
              <XMarkIcon aria-hidden="true" className="size-5" />
            </button>
          </header>
          <div className="p-3">
            <CashierTransactionTimeline status={transaction.status} />
            <fieldset className="mt-4 flex flex-col items-center gap-3">
              <legend className="mb-2 font-medium text-slate-900">
                Status transaksi
              </legend>
              {(
                [
                  {
                    value: "pending",
                    label: "Pending",
                    disabled: status !== "pending",
                  },
                  {
                    value: "processing",
                    label: "Processing",
                    disabled: status === "done",
                  },
                  { value: "done", label: "Done", disabled: false },
                ] as const
              ).map((option) => (
                <label
                  key={option.value}
                  className={`flex w-40 items-center gap-3 ${option.disabled ? "text-slate-400" : "text-slate-800"}`}
                >
                  <input
                    type="radio"
                    name="transaction-status"
                    value={option.value}
                    checked={status === option.value}
                    disabled={option.disabled}
                    onChange={() => setStatus(option.value)}
                    className="size-4 accent-brand-primary"
                  />
                  {option.label}
                </label>
              ))}
            </fieldset>
            <button
              type="button"
              onClick={submitStatus}
              className="mt-5 h-12 w-full rounded-md bg-brand-primary font-bold text-white hover:bg-orange-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-800"
            >
              Submit
            </button>
          </div>
        </DialogPanel>
      </div>
    </Dialog>
  );
};

export default CashierTransactionStatusDialog;
