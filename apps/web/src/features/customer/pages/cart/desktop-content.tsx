import { MinusIcon, PlusIcon, XMarkIcon } from "@heroicons/react/24/outline";
import { useDispatch, useSelector } from "react-redux";
import Actions from "../../../../actions";
import Icons from "../../../../assets/icons";
import ButtonCustom from "../../../../components/common/button.custom";
import TextCustom from "../../../../components/common/text.custom";
import type { AppDispatch } from "../../../../store";
import CustomerCartOverview from "./overview";
import CustomerDesktopCartOrders from "./desktop-cart-orders";
import CustomerOrderInvoice from "./invoice-order";
import CustomerTransactionInvoice from "./invoice-transaction";

type CartMenu = {
  _id?: string;
  name?: string;
  image?: string;
  promo?: number;
  price?: number;
  desc?: string;
};
type SelectedCartItem = {
  bool: boolean;
  id_cart?: string | null;
  quality: number;
  note: string;
  menu: CartMenu;
};
type CartLine = {
  _id: string;
  menu: CartMenu;
  quality: number;
  note?: string;
  total_promo?: number;
  total_price?: number;
};
type CustomerDesktopCartState = {
  Cart: {
    loading: boolean;
    selected: SelectedCartItem;
    order: unknown;
    transaction: unknown;
    data: CartLine[];
  };
};

const SelectedMenuPanel = () => {
  const dispatch = useDispatch<AppDispatch>();
  const cart = useSelector((state: CustomerDesktopCartState) => state.Cart);
  const { selected } = cart;
  const { quality, note, menu } = selected;

  const onClean = () => dispatch(Actions.Cart.selectedClean());
  const onSubmit = () => {
    if (quality <= 0) {
      if (selected.id_cart) dispatch(Actions.Cart.onDelete(selected.id_cart));
      onClean();
      return;
    }

    if (selected.id_cart) {
      dispatch(Actions.Cart.onUpdate(menu, selected.id_cart, quality, note));
    } else {
      dispatch(Actions.Cart.onCreate(menu, quality, note));
    }
    onClean();
  };

  const price = menu.price ?? 0;
  const displayPrice =
    Math.abs(price) > 999
      ? `${Math.sign(price) * Number((Math.abs(price) / 1000).toFixed(1))}k`
      : Math.sign(price) * Math.abs(price);

  return (
    <div className="relative h-[90vh] bg-surface-blush px-[3vw] py-[3vh]">
      <div className="flex h-[5vh] w-full items-center">
        <div className="w-1/2">
          <TextCustom variant="h4" className="text-brand-teal">
            {displayPrice}
          </TextCustom>
        </div>
        <div className="flex w-1/2 items-end justify-end">
          <button
            type="button"
            aria-label="Tutup pilihan menu"
            onClick={onClean}
            className="rounded-full p-2 text-slate-600 hover:bg-black/5"
          >
            <XMarkIcon aria-hidden="true" className="size-6" />
          </button>
        </div>
      </div>
      <div className="flex h-[5vh] w-full items-center">
        <TextCustom variant="h5" className="text-[#AD3737]">
          {menu.name || "Name"}
        </TextCustom>
      </div>
      <div className="flex h-[40vh] w-full items-center justify-center">
        <div
          role="img"
          aria-label={menu.name ?? "Menu"}
          className="relative h-[30vh] w-full rounded-lg bg-center bg-cover bg-no-repeat"
          style={{ backgroundImage: `url(${menu.image ?? ""})` }}
        >
          {menu.promo ? (
            <div className="absolute -bottom-[17px] right-0 content-center">
              <img src={Icons.star} alt="Promo" />
            </div>
          ) : null}
        </div>
      </div>
      <div className="flex h-[10vh] w-full">
        <TextCustom>{menu.desc || "Desc"}</TextCustom>
      </div>
      <div className="flex h-[20vh] w-full justify-end">
        <div className="w-[70%]">
          <input
            aria-label="Catatan menu"
            placeholder="Klik untuk menambahkan catatan"
            value={note}
            onChange={(event) =>
              dispatch(Actions.Cart.selectedChangeNote(event.target.value))
            }
            className="h-[35px] w-full rounded-[10px] border-0 bg-[#ECFDFE] shadow-none outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
          />
          <div className="flex w-full items-center justify-around">
            <button
              type="button"
              aria-label="Tambah jumlah"
              onClick={() => dispatch(Actions.Cart.selectedIncrementQuality())}
              className="rounded-full p-2 text-[#AD3636] hover:bg-black/5"
            >
              <PlusIcon aria-hidden="true" className="size-5" />
            </button>
            <TextCustom className="text-[#AD3636]">{quality}</TextCustom>
            <button
              type="button"
              aria-label="Kurangi jumlah"
              onClick={() => dispatch(Actions.Cart.selectedDescrementQuality())}
              className="rounded-full p-2 text-[#AD3636] hover:bg-black/5"
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
            className="rounded-[10px] bg-brand-danger text-white hover:bg-red-900 focus-visible:outline-red-800"
            disabled={cart.loading}
            loading={cart.loading}
            onClick={onSubmit}
            fullWidth
          />
        </div>
      </div>
    </div>
  );
};

const CartContent = () => {
  const cart = useSelector((state: CustomerDesktopCartState) => state.Cart);

  if (cart.order) return <CustomerOrderInvoice />;
  if (cart.transaction) return <CustomerTransactionInvoice />;
  if (cart.data.length > 0) return <CustomerDesktopCartOrders />;
  return null;
};

const CustomerDesktopCartContent = () => {
  const cart = useSelector((state: CustomerDesktopCartState) => state.Cart);

  if (cart.selected.bool) return <SelectedMenuPanel />;
  if (cart.loading) return null;

  return (
    <div className="relative h-[90vh] overflow-auto bg-white">
      <div className="h-2 w-full bg-brand-accent" />
      <div className="w-full px-4 pb-4">
        <CustomerCartOverview />
        <CartContent />
      </div>
    </div>
  );
};

export default CustomerDesktopCartContent;
