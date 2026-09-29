import { useDispatch } from "react-redux";
import Actions from "../../../../actions";
import CustomerCartItemList, { type CartLine } from "./cart-item-list";
import CustomerCartRecipe from "./recipe";
import TextCustom from "../../../../components/common/text.custom";
import type { AppDispatch } from "../../../../store";

const CustomerDesktopCartOrders = () => {
  const dispatch = useDispatch<AppDispatch>();
  const onEditItem = (item: CartLine) => {
    dispatch(
      Actions.Cart.selectedEdit(item.menu, item._id, item.quality, item.note),
    );
  };

  return (
    <div>
      <TextCustom className="m-4 text-brand-rust" variant="h6" align="center">
        Sudah siap pesan ?
      </TextCustom>
      <CustomerCartItemList onEditItem={onEditItem} />
      <CustomerCartRecipe />
      <div className="my-4 flex items-center justify-center">
        <button
          type="button"
          className="rounded-lg bg-brand-danger px-12 py-2 text-white hover:bg-red-900 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-800"
          onClick={() => dispatch(Actions.Cart.dialogPaymentOpen())}
        >
          Pesan
        </button>
      </div>
    </div>
  );
};

export default CustomerDesktopCartOrders;
