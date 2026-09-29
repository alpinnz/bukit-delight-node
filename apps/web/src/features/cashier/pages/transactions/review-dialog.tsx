import { Dialog, DialogPanel, DialogTitle } from "@headlessui/react";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { useDispatch, useSelector } from "react-redux";
import Actions from "../../../../actions";
import type { AppDispatch } from "../../../../store";
import CustomerAccordionListCategories, {
  type OrderedCategory,
} from "../../../customer/components/accordion-list-categories";
import CustomerInvoiceOverview, {
  type InvoiceRecord,
} from "../../../customer/components/invoice-overview";

type CompletedOrder = InvoiceRecord & { categories?: OrderedCategory[] };
type CashierTransaction = {
  _id: string;
  status: string;
  id_account?: { username?: string };
  id_order: CompletedOrder;
};
type TransactionReviewState = {
  Transactions: {
    dialog_review: { open: boolean };
    transaction: CashierTransaction | null;
  };
};

const CashierTransactionReviewDialog = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { open, transaction } = useSelector(
    (state: TransactionReviewState) => ({
      open: state.Transactions.dialog_review.open,
      transaction: state.Transactions.transaction,
    }),
  );

  const closeReview = () => dispatch(Actions.Transactions.hideDialogReview());
  const openStatus = () => {
    dispatch(Actions.Transactions.openDialogStatus());
    closeReview();
  };

  if (!transaction) return null;

  return (
    <Dialog open={open} onClose={closeReview} className="relative z-50">
      <div className="fixed inset-0 bg-slate-950/40" aria-hidden="true" />
      <div className="fixed inset-0 overflow-y-auto sm:flex sm:items-center sm:justify-center sm:p-4">
        <DialogPanel className="min-h-full w-full bg-white shadow-xl sm:min-h-0 sm:max-w-xl sm:rounded-xl">
          <header className="flex items-center bg-brand-primary px-4 py-3 text-white">
            <DialogTitle className="flex-1 text-lg font-semibold">
              Transaction Detail
            </DialogTitle>
            <button
              type="button"
              autoFocus
              onClick={closeReview}
              aria-label="Tutup detail transaksi"
              className="rounded-md p-2 hover:bg-white/10 focus-visible:outline-2 focus-visible:outline-white"
            >
              <XMarkIcon aria-hidden="true" className="size-5" />
            </button>
          </header>
          <div className="p-3">
            <CustomerInvoiceOverview
              status={transaction.status}
              no_transaction={transaction._id}
              account={transaction.id_account}
              data={transaction.id_order}
            />
            <div className="mt-4" />
            <CustomerAccordionListCategories
              data={transaction.id_order.categories ?? []}
            />
            <button
              type="button"
              onClick={openStatus}
              className="my-4 h-12 w-full rounded-md bg-brand-primary font-bold text-white hover:bg-orange-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-800"
            >
              Update Status
            </button>
          </div>
        </DialogPanel>
      </div>
    </Dialog>
  );
};

export default CashierTransactionReviewDialog;
