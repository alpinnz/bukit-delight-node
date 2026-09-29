import { Dialog, DialogPanel, DialogTitle } from "@headlessui/react";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import Actions from "../../../../actions";
import type { AppDispatch } from "../../../../store";
import CustomerAccordionListCategories, {
  type OrderedCategory,
} from "../../../customer/components/accordion-list-categories";
import CustomerInvoiceOverview, {
  type InvoiceRecord,
} from "../../../customer/components/invoice-overview";

type CashierOrder = InvoiceRecord & { categories?: OrderedCategory[] };
type CashierOrderState = {
  Orders: {
    dialog_review: { open: boolean };
    order: CashierOrder | null;
  };
};

const CashierOrderReviewDialog = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { open, order } = useSelector((state: CashierOrderState) => ({
    open: state.Orders.dialog_review.open,
    order: state.Orders.order,
  }));

  useEffect(() => {
    if (open) document.getElementById("cashier-order-review-content")?.focus();
  }, [open]);

  const closeReview = () => dispatch(Actions.Orders.hideDialogReview());
  const openPayment = () => {
    dispatch(Actions.Orders.openDialogPayment());
    closeReview();
  };

  if (!order) return null;

  return (
    <Dialog open={open} onClose={closeReview} className="relative z-50">
      <div className="fixed inset-0 bg-slate-950/40" aria-hidden="true" />
      <div className="fixed inset-0 overflow-y-auto sm:flex sm:items-center sm:justify-center sm:p-4">
        <DialogPanel className="min-h-full w-full bg-white shadow-xl sm:min-h-0 sm:max-w-xl sm:rounded-xl">
          <header className="flex items-center bg-brand-primary px-4 py-3 text-white">
            <DialogTitle className="flex-1 text-lg font-semibold">
              Review
            </DialogTitle>
            <button
              type="button"
              autoFocus
              onClick={closeReview}
              aria-label="Tutup review"
              className="rounded-md p-2 hover:bg-white/10 focus-visible:outline-2 focus-visible:outline-white"
            >
              <XMarkIcon aria-hidden="true" className="size-5" />
            </button>
          </header>
          <div id="cashier-order-review-content" tabIndex={-1} className="p-3">
            <CustomerInvoiceOverview data={order} />
            <div className="mt-4" />
            <CustomerAccordionListCategories data={order.categories ?? []} />
            <button
              type="button"
              onClick={openPayment}
              className="my-4 h-12 w-full rounded-md bg-brand-primary font-bold text-white hover:bg-orange-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-800"
            >
              Bayar
            </button>
          </div>
        </DialogPanel>
      </div>
    </Dialog>
  );
};

export default CashierOrderReviewDialog;
