import { useDispatch, useSelector } from "react-redux";
import Actions from "../../../../actions";
import formatters from "../../../../helpers/formatters";
import Text from "../../../../components/atoms/text";
import type { AppDispatch } from "../../../../store";

type CartMenu = { name?: string; promo?: number | string };
export type CartLine = {
  id: string;
  menu: CartMenu;
  quality: number;
  note?: string;
  total_promo?: number | string;
  total_price?: number | string;
};
type CustomerCartState = { Cart: { data: CartLine[] } };

const CartItem = ({
  item,
  onEditItem,
}: {
  item: CartLine;
  onEditItem?: (item: CartLine) => void;
}) => {
  const dispatch = useDispatch<AppDispatch>();
  const onEdit = () => {
    if (onEditItem) {
      onEditItem(item);
      return;
    }

    dispatch(
      Actions.Cart.selectedEdit(item.menu, item.id, item.quality, item.note),
    );
    dispatch(Actions.Cart.dialogMenuOpen());
  };

  return (
    <div className="my-4 flex items-center rounded-lg bg-[#FFFFFF66] p-1">
      <div className="w-1/5 px-1">
        <div className="flex size-[35px] items-center justify-center bg-[#FFBC03]">
          <Text className="text-center text-white">
            {`${item.quality || 0}x`}
          </Text>
        </div>
        <button
          type="button"
          aria-label={`Edit ${item.menu.name || "item"}`}
          className="mt-2 size-10 min-w-0 p-0"
          onClick={onEdit}
        >
          <Text variant="h6" className="text-center text-brand-primary">
            Edit
          </Text>
        </button>
      </div>
      <div className="relative w-4/5 px-1 text-right">
        <Text variant="h6" className="text-black">
          {item.menu.name || "name"}
        </Text>
        {item.note && (
          <div className="flex items-end justify-end">
            <Text className="text-[#AEA2A2]">Note</Text>
            <Text className="ml-4 text-black">{item.note}</Text>
          </div>
        )}
        {item.menu.promo && (
          <div className="flex items-end justify-end">
            <Text className="text-brand-success">Promo</Text>
            <Text className="ml-4 text-black line-through">
              {formatters.formatRupiah(item.total_promo ?? 0)}
            </Text>
          </div>
        )}
        <div className="flex items-end justify-end">
          <Text className="text-[#AEA2A2]">Total</Text>
          <Text className="ml-4 text-black">
            {formatters.formatRupiah(item.total_price ?? 0)}
          </Text>
        </div>
      </div>
    </div>
  );
};

const CustomerCartItemList = ({
  onEditItem,
}: {
  onEditItem?: (item: CartLine) => void;
}) => {
  const items = useSelector((state: CustomerCartState) => state.Cart.data);
  return (
    <>
      {items.map((item) => (
        <CartItem key={item.id} item={item} onEditItem={onEditItem} />
      ))}
    </>
  );
};

export default CustomerCartItemList;
