import { useState, type ReactNode } from "react";
import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react";
import { FunnelIcon } from "@heroicons/react/24/outline";
import { useDispatch, useSelector } from "react-redux";
import type { OrderPaymentStatus } from "@bukit-delight/shared";
import Actions from "../../../../actions";
import Text from "../../../../components/atoms/text";
import type { AppDispatch } from "../../../../store";

type CashierOrder = {
  id: string;
  status: OrderPaymentStatus | Uppercase<OrderPaymentStatus>;
  is_expired: boolean;
  table_name: string;
  table_id: { name: string };
  customer_id: { username: string };
  note?: string;
};
type OrderSortKey = "status" | "table_name" | null;
type CashierOrdersState = { data?: CashierOrder[] | null };

type TextTitleValueProps = {
  title: string;
  value?: ReactNode;
  color?: "textSecondary";
};

const TextTitleValue = ({ title, value, color }: TextTitleValueProps) => (
  <div className="flex">
    <div className="w-24">
      <Text align="left" color={color}>
        {title}
      </Text>
    </div>
    <div className="mr-4">
      <Text align="left" color={color}>
        :
      </Text>
    </div>
    <div>
      <Text align="left" color={color}>
        {value}
      </Text>
    </div>
  </div>
);

const sortOrders = (orders: CashierOrder[], sortKey: OrderSortKey) => {
  if (!sortKey) return [...orders];
  return [...orders].sort((left, right) =>
    left[sortKey].localeCompare(right[sortKey]),
  );
};

const CashierOrderList = () => {
  const orders = useSelector(
    (state: { Orders: CashierOrdersState }) => state.Orders.data ?? [],
  );
  const dispatch = useDispatch<AppDispatch>();
  const [sortKey, setSortKey] = useState<OrderSortKey>(null);

  const openOrderReview = (order: CashierOrder) => {
    dispatch(Actions.Orders.setOrder(order));
    dispatch(Actions.Orders.openDialogReview());
  };

  const selectSortKey = (key: Exclude<OrderSortKey, null>) => {
    setSortKey(key);
  };

  const visibleOrders = sortOrders(orders, sortKey).filter(
    (order) => !order.is_expired && order.status === "pending",
  );

  return (
    <div className="p-2">
      <div className="flex items-center justify-end">
        <div className="relative">
          <Menu>
            <MenuButton
              aria-label="Filter orders"
              className="rounded-md p-2 text-slate-700 hover:bg-slate-100"
            >
              <FunnelIcon aria-hidden="true" className="size-5" />
            </MenuButton>
            <MenuItems className="absolute right-0 z-20 mt-1 w-44 rounded-md bg-white py-1 shadow-lg ring-1 ring-black/5 focus:outline-none">
              <MenuItem>
                <button
                  type="button"
                  onClick={() => selectSortKey("table_name")}
                  className="w-full px-3 py-2 text-left text-sm text-slate-700 data-focus:bg-slate-100"
                >
                  No Meja
                </button>
              </MenuItem>
              <MenuItem>
                <button
                  type="button"
                  onClick={() => selectSortKey("status")}
                  className="w-full px-3 py-2 text-left text-sm text-slate-700 data-focus:bg-slate-100"
                >
                  Status
                </button>
              </MenuItem>
            </MenuItems>
          </Menu>
        </div>
      </div>

      {visibleOrders.map((order) => (
        <div key={order.id} className="pt-2">
          <button
            type="button"
            className="block w-full rounded-2xl p-4 text-left shadow-[1px_0.5px_2.5px_0.5px_#9E9E9E] hover:bg-slate-50 focus-visible:outline-2 focus-visible:outline-indigo-600"
            onClick={() => openOrderReview(order)}
          >
            <div className="w-full">
              <TextTitleValue
                color="textSecondary"
                title="No Meja"
                value={order.table_id.name}
              />
              <TextTitleValue
                color="textSecondary"
                title="Customer"
                value={order.customer_id.username}
              />
              <TextTitleValue
                color="textSecondary"
                title="Note"
                value={order.note}
              />
              <TextTitleValue
                color="textSecondary"
                title="Status"
                value={order.status}
              />
            </div>
          </button>
        </div>
      ))}
    </div>
  );
};

export default CashierOrderList;
