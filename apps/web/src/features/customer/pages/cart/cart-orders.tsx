import { useDispatch } from "react-redux";
import Actions from "../../../../actions";
import MenuDialog from "../../components/menu-dialog";
import Recipe from "./cart-summary";
import ListItemVertical from "./cart-item-list";
import Text from "../../../../components/atoms/text";
import type { AppDispatch } from "../../../../store";

const CustomerCartOrders = () => {
  const dispatch = useDispatch<AppDispatch>();

  return (
    <div>
      <Text className="m-4 text-brand-rust" variant="h6" align="center">
        Sudah siap pesan ?
      </Text>
      <ListItemVertical />
      <Recipe />
      <div className="my-4 flex items-center justify-center">
        <button
          type="button"
          className="rounded-lg bg-brand-danger px-12 py-2 text-white hover:bg-red-900 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-800"
          onClick={() => dispatch(Actions.Cart.dialogPaymentOpen())}
        >
          Pesan
        </button>
      </div>
      <MenuDialog />
    </div>
  );
};

export default CustomerCartOrders;
