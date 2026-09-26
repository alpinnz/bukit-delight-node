import { useState, type MouseEvent, type ReactNode } from "react";
import {
  Button,
  IconButton,
  Menu,
  MenuItem,
  Typography,
  type TypographyProps,
} from "@material-ui/core";
import FilterListIcon from "@material-ui/icons/FilterList";
import { useDispatch, useSelector } from "react-redux";
import type { OrderPaymentStatus } from "@bukit-delight/shared";
import Actions from "../../../../actions";

type CashierOrder = {
  _id: string;
  status: OrderPaymentStatus | Uppercase<OrderPaymentStatus>;
  isExpired: boolean;
  table_name: string;
  id_table: { name: string };
  id_customer: { username: string };
  note?: string;
};
type OrderSortKey = "status" | "table_name" | null;
type CashierOrdersState = { data?: CashierOrder[] | null };

type TextTitleValueProps = {
  title: string;
  value?: ReactNode;
  color?: TypographyProps["color"];
};

const TextTitleValue = ({ title, value, color }: TextTitleValueProps) => (
  <div style={{ display: "flex" }}>
    <div style={{ width: "6rem" }}>
      <Typography align="left" color={color}>
        {title}
      </Typography>
    </div>
    <div style={{ marginRight: "1rem" }}>
      <Typography align="left" color={color}>
        :
      </Typography>
    </div>
    <div>
      <Typography align="left" color={color}>
        {value}
      </Typography>
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
  const dispatch = useDispatch();
  const [anchorElement, setAnchorElement] = useState<HTMLElement | null>(null);
  const [sortKey, setSortKey] = useState<OrderSortKey>(null);

  const openOrderReview = (order: CashierOrder) => {
    dispatch(Actions.Orders.setOrder(order));
    dispatch(Actions.Orders.openDialogReview());
  };

  const closeSortMenu = () => setAnchorElement(null);
  const selectSortKey = (key: Exclude<OrderSortKey, null>) => {
    setSortKey(key);
    closeSortMenu();
  };

  const visibleOrders = sortOrders(orders, sortKey).filter(
    (order) => !order.isExpired && order.status === "pending",
  );

  return (
    <div
      style={{
        paddingLeft: "0.5rem",
        paddingRight: "0.5rem",
        paddingTop: "0.5rem",
        paddingBottom: "0.5rem",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "flex-end",
        }}
      >
        <IconButton
          aria-label="Filter orders"
          aria-controls="cashier-orders-sort-menu"
          aria-haspopup="true"
          onClick={(event: MouseEvent<HTMLButtonElement>) =>
            setAnchorElement(event.currentTarget)
          }
        >
          <FilterListIcon />
        </IconButton>
        <Menu
          id="cashier-orders-sort-menu"
          anchorEl={anchorElement}
          keepMounted
          open={Boolean(anchorElement)}
          onClose={closeSortMenu}
        >
          <MenuItem onClick={() => selectSortKey("table_name")}>
            No Meja
          </MenuItem>
          <MenuItem onClick={() => selectSortKey("status")}>Status</MenuItem>
        </Menu>
      </div>

      {visibleOrders.map((order) => (
        <div key={order._id} style={{ paddingTop: "0.5rem" }}>
          <Button
            fullWidth
            style={{
              padding: "1rem",
              boxShadow: "1px 0.5px 2.5px 0.5px #9E9E9E",
              borderRadius: 20,
              display: "block",
              textTransform: "none",
            }}
            onClick={() => openOrderReview(order)}
          >
            <div style={{ width: "100%" }}>
              <TextTitleValue
                color="textSecondary"
                title="No Meja"
                value={order.id_table.name}
              />
              <TextTitleValue
                color="textSecondary"
                title="Customer"
                value={order.id_customer.username}
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
              <Typography variant="body2" component="p" />
            </div>
          </Button>
        </div>
      ))}
    </div>
  );
};

export default CashierOrderList;
