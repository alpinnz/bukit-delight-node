import { Dialog, DialogPanel, DialogTitle } from "@headlessui/react";
import { useDispatch, useSelector } from "react-redux";
import Actions from "../../../../actions";
import icons from "../../../../assets/icons";
import type { AppDispatch } from "../../../../store";

type PaymentDialogState = {
  Cart: { dialog_payment: { open: boolean } };
  Orders: { loading: boolean };
};

const CustomerPaymentDialog = () => {
  const dispatch = useDispatch<AppDispatch>();
  const open = useSelector(
    (state: PaymentDialogState) => state.Cart.dialog_payment.open,
  );
  const loading = useSelector(
    (state: PaymentDialogState) => state.Orders.loading,
  );
  const onClose = () => dispatch(Actions.Cart.dialogPaymentHide());
  const onOrderCash = () => dispatch(Actions.Orders.onCreate({}));
  const onOrderEMoney = () => alert("onOrderE_Money");

  return (
    <Dialog open={open} onClose={onClose} className="relative z-50">
      <div className="fixed inset-0 bg-slate-950/40" aria-hidden="true" />
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <DialogPanel className="w-full max-w-sm rounded-xl bg-white p-4 shadow-xl">
          <DialogTitle className="p-1 text-center text-base font-semibold text-slate-900">
            Pilih Metode Pembayaran
          </DialogTitle>
          <div className="flex justify-between gap-3 p-1">
            <button
              type="button"
              onClick={onOrderCash}
              disabled={loading}
              className="block flex-1 rounded-xl bg-[#D6A4A4] p-1 disabled:opacity-50"
            >
              <div className="flex items-center justify-center p-2">
                <img className="size-16" src={icons.cashier} alt="cashier" />
              </div>
              <span className="block py-1 text-center font-semibold text-black">
                Tunai
              </span>
            </button>
            <button
              type="button"
              onClick={onOrderEMoney}
              disabled={loading}
              className="block flex-1 rounded-xl bg-[#D6A4A4] p-1 disabled:opacity-50"
            >
              <div className="flex items-center justify-center p-2">
                <img className="size-16" src={icons.eMoney} alt="e money" />
              </div>
              <span className="block py-1 text-center font-semibold text-black">
                E-Money
              </span>
            </button>
          </div>
        </DialogPanel>
      </div>
    </Dialog>
  );
};

export default CustomerPaymentDialog;
