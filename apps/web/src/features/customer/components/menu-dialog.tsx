import { Dialog, DialogPanel, DialogTitle } from "@headlessui/react";
import { MinusIcon, PlusIcon } from "@heroicons/react/24/outline";
import { useDispatch, useSelector } from "react-redux";
import Actions from "../../../actions";
import ButtonCustom from "../../../components/common/button.custom";
import Convert from "../../../helpers/convert";
import type { AppDispatch } from "../../../store";

type MenuCard = {
  image?: string;
  name?: string;
  desc?: string;
  price?: number;
  promo?: number;
  [key: string]: unknown;
};

type SelectedMenu = {
  quality: number;
  note: string;
  id_cart?: string | null;
  menu: MenuCard;
};

type CartDialogState = {
  Cart: {
    dialog_menu: { open: boolean };
    loading: boolean;
    selected: SelectedMenu;
  };
};

export default function MenuDialog() {
  const dispatch = useDispatch<AppDispatch>();
  const open = useSelector(
    (state: CartDialogState) => state.Cart.dialog_menu.open,
  );
  const loading = useSelector((state: CartDialogState) => state.Cart.loading);
  const selected = useSelector((state: CartDialogState) => state.Cart.selected);

  const { quality, note, menu } = selected;
  const onIncrement = () => dispatch(Actions.Cart.selectedIncrementQuality());
  const onDecrement = () => dispatch(Actions.Cart.selectedDescrementQuality());
  const onClean = () => dispatch(Actions.Cart.selectedClean());
  const onClose = () => dispatch(Actions.Cart.dialogMenuHide());
  const onChange = (value: string) =>
    dispatch(Actions.Cart.selectedChangeNote(value));
  const onRemove = () => {
    if (quality > 0) onDecrement();
  };

  const onSubmit = () => {
    if (quality <= 0) {
      if (selected.id_cart) dispatch(Actions.Cart.onDelete(selected.id_cart));
      onClean();
      onClose();
      return;
    }
    if (selected.id_cart) {
      dispatch(Actions.Cart.onUpdate(menu, selected.id_cart, quality, note));
    } else {
      dispatch(Actions.Cart.onCreate(menu, quality, note));
    }
    onClean();
    onClose();
  };

  const price = menu.price ?? 0;
  const promo = menu.promo ?? 0;

  return (
    <Dialog open={open} onClose={onClose} className="relative z-50">
      <div className="fixed inset-0 bg-slate-950/40" aria-hidden="true" />
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <DialogPanel className="w-full max-w-md rounded-xl bg-white p-2 shadow-xl">
          <img
            src={menu.image ?? ""}
            alt={menu.name ?? "Menu"}
            className="h-40 w-full rounded-lg object-cover"
          />
          <div className="p-2">
            <DialogTitle className="text-center font-semibold text-slate-900">
              {menu.name}
            </DialogTitle>
            <p className="mt-2 min-h-14 p-2 text-sm text-slate-600">
              {menu.desc}
            </p>
            <div className="flex items-center gap-2">
              <div className="flex flex-1 items-center gap-2 text-lg font-semibold text-brand-teal">
                {promo > 0 ? (
                  <>
                    <del className="text-sm font-normal">
                      {Convert.Price(price)}
                    </del>
                    <span>{Convert.Price(price - promo)}</span>
                  </>
                ) : (
                  <span>{Convert.Price(price)}</span>
                )}
              </div>
              <input
                aria-label="Catatan menu"
                placeholder="Klik untuk menambahkan catatan"
                value={note}
                onChange={(event) => onChange(event.target.value)}
                className="min-w-0 flex-1 rounded-lg border border-transparent bg-cyan-50 px-3 py-2 text-sm outline-none focus:border-cyan-600"
              />
            </div>
            <div className="mt-3 flex items-center justify-center gap-8">
              <button
                type="button"
                aria-label="Tambah jumlah"
                onClick={onIncrement}
                className="rounded-full p-2 text-slate-800 hover:bg-slate-100"
              >
                <PlusIcon aria-hidden="true" className="size-5" />
              </button>
              <span className="min-w-8 text-center text-lg font-semibold text-slate-900">
                {quality}
              </span>
              <button
                type="button"
                aria-label="Kurangi jumlah"
                onClick={onRemove}
                className="rounded-full p-2 text-slate-800 hover:bg-slate-100"
              >
                <MinusIcon aria-hidden="true" className="size-5" />
              </button>
            </div>
            <ButtonCustom
              label={
                quality > 0
                  ? selected.id_cart
                    ? "Edit"
                    : "Add"
                  : selected.id_cart
                    ? "Remove"
                    : "Cancel"
              }
              disabled={loading}
              loading={loading}
              onClick={onSubmit}
              fullWidth
              className="mt-2 rounded-lg bg-brand-danger hover:bg-red-900"
            />
          </div>
        </DialogPanel>
      </div>
    </Dialog>
  );
}
