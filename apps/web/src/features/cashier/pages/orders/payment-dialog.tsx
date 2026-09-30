import { Dialog, DialogPanel, DialogTitle } from "@headlessui/react";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { TransactionPaymentMethod } from "@bukit-delight/shared";
import Actions from "../../../../actions";
import type { AppDispatch } from "../../../../store";
import OrderInvoiceOverview, {
  type InvoiceRecord,
} from "../../../orders/components/order-invoice-overview";

type CashierPaymentState = {
  Orders: {
    dialog_payment: { open: boolean };
    order: (InvoiceRecord & { total_price: number | string }) | null;
  };
};

const PAYMENT_AMOUNTS = [50000, 100000, 200000] as const;

const CashierOrderPaymentDialog = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { open, order } = useSelector((state: CashierPaymentState) => ({
    open: state.Orders.dialog_payment.open,
    order: state.Orders.order,
  }));
  const [selectedAmount, setSelectedAmount] = useState<
    number | "custom" | null
  >(null);
  const [customAmount, setCustomAmount] = useState(0);

  const closePayment = () => dispatch(Actions.Orders.hideDialogPayment());
  const total = Number(order?.total_price ?? 0);
  const selectedPayment =
    selectedAmount === "custom"
      ? customAmount
      : selectedAmount === null
        ? null
        : selectedAmount === 0
          ? total
          : selectedAmount;
  const change = selectedPayment === null ? 0 : selectedPayment - total;

  const submitPayment = () => {
    if (selectedPayment === null) {
      dispatch(
        Actions.Service.pushInfoNotification(
          "Pilih salah satu pembayaran tunai",
        ),
      );
      return;
    }
    if (change < 0) {
      dispatch(
        Actions.Service.pushInfoNotification("Pilih kembalian yang sesuai"),
      );
      return;
    }
    const payment: TransactionPaymentMethod = "cash";
    dispatch(Actions.Transactions.onCreate({ payment }));
  };

  if (!order) return null;

  const selectQuickAmount = (amount: number) => {
    setCustomAmount(0);
    setSelectedAmount(amount);
  };

  return (
    <Dialog open={open} onClose={closePayment} className="relative z-50">
      <div className="fixed inset-0 bg-slate-950/40" aria-hidden="true" />
      <div className="fixed inset-0 overflow-y-auto sm:flex sm:items-center sm:justify-center sm:p-4">
        <DialogPanel className="min-h-full w-full bg-white shadow-xl sm:min-h-0 sm:max-w-xl sm:rounded-xl">
          <header className="flex items-center bg-brand-primary px-4 py-3 text-white">
            <DialogTitle className="flex-1 text-lg font-semibold">
              Payment
            </DialogTitle>
            <button
              type="button"
              autoFocus
              onClick={closePayment}
              aria-label="Tutup pembayaran"
              className="rounded-md p-2 hover:bg-white/10 focus-visible:outline-2 focus-visible:outline-white"
            >
              <XMarkIcon aria-hidden="true" className="size-5" />
            </button>
          </header>
          <div className="p-3">
            <OrderInvoiceOverview data={order} change={change} />
            <section className="mt-4">
              <h2 className="font-semibold">Pembayaran Tunai</h2>
              <div className="mt-2 grid grid-cols-2 gap-3">
                <QuickPaymentButton
                  label="Uang Pas"
                  selected={selectedAmount === 0}
                  onClick={() => selectQuickAmount(0)}
                />
                <QuickPaymentButton
                  label="50.000"
                  selected={selectedAmount === PAYMENT_AMOUNTS[0]}
                  onClick={() => selectQuickAmount(PAYMENT_AMOUNTS[0])}
                />
                <QuickPaymentButton
                  label="100.000"
                  selected={selectedAmount === PAYMENT_AMOUNTS[1]}
                  onClick={() => selectQuickAmount(PAYMENT_AMOUNTS[1])}
                />
                <QuickPaymentButton
                  label="200.000"
                  selected={selectedAmount === PAYMENT_AMOUNTS[2]}
                  onClick={() => selectQuickAmount(PAYMENT_AMOUNTS[2])}
                />
              </div>
              <label
                htmlFor="cashier-custom-payment-amount"
                className="mt-4 block text-sm font-medium text-slate-700"
              >
                Jumlah pembayaran tunai
              </label>
              <input
                id="cashier-custom-payment-amount"
                value={customAmount}
                type="number"
                min={0}
                inputMode="numeric"
                onFocus={() => setSelectedAmount("custom")}
                onChange={(event) => {
                  setSelectedAmount("custom");
                  setCustomAmount(Number(event.target.value) || 0);
                }}
                className={`mt-1 w-full rounded-md border px-3 py-2 text-right outline-none focus:ring-2 focus:ring-orange-500/30 ${selectedAmount === "custom" ? "border-brand-primary bg-orange-50 text-brand-primary" : "border-slate-300 bg-white"}`}
                placeholder="Rp 0"
              />
            </section>
            <button
              type="button"
              onClick={submitPayment}
              className="mt-5 h-12 w-full rounded-md bg-brand-primary font-bold text-white hover:bg-orange-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-800"
            >
              Bayar
            </button>
          </div>
        </DialogPanel>
      </div>
    </Dialog>
  );
};

const QuickPaymentButton = ({
  label,
  selected,
  onClick,
}: {
  label: string;
  selected: boolean;
  onClick: () => void;
}) => (
  <button
    type="button"
    aria-pressed={selected}
    onClick={onClick}
    className={`h-14 w-full rounded-md font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-700 ${selected ? "bg-brand-primary text-white" : "bg-white text-brand-primary ring-1 ring-inset ring-slate-300 hover:bg-orange-50"}`}
  >
    {label}
  </button>
);

export default CashierOrderPaymentDialog;
