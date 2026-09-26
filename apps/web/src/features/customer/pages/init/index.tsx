import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory, useParams } from "react-router-dom";
import Actions from "../../../../actions";
import LoadingCustom from "../../../../components/common/loading.custom";
import Form from "./form";

type TableRecord = {
  _id: string;
  name: string;
};

type CustomerInitState = {
  Customers: {
    loading: boolean;
    customer: Record<string, unknown> | null;
  };
  Tables: {
    loading: boolean;
    data: TableRecord[];
    table: TableRecord | null;
  };
  Orders: { loading: boolean };
  Transactions: { loading: boolean };
};

const CustomerInitPage = () => {
  const { name_table: tableName } = useParams<{ name_table?: string }>();
  const Customers = useSelector((state: CustomerInitState) => state.Customers);
  const Tables = useSelector((state: CustomerInitState) => state.Tables);
  const Orders = useSelector((state: CustomerInitState) => state.Orders);
  const Transactions = useSelector(
    (state: CustomerInitState) => state.Transactions,
  );
  const dispatch = useDispatch();
  const history = useHistory();

  const table = Tables.data.find((entry) => entry.name === tableName);
  const existingTable = table ? null : Tables.table;
  const isLoading =
    Tables.loading ||
    Customers.loading ||
    Orders.loading ||
    Transactions.loading;

  useEffect(() => {
    document.title = "Customer";
  }, []);

  useEffect(() => {
    if (isLoading) return;

    let setTableTimeout: ReturnType<typeof setTimeout> | undefined;
    let navigationTimeout: ReturnType<typeof setTimeout> | undefined;

    if (Customers.customer && table) {
      setTableTimeout = setTimeout(() => {
        dispatch(Actions.Tables.setTable(table));
      }, 1000);
      navigationTimeout = setTimeout(() => {
        history.push("/customer/home");
      }, 2000);
    } else if (Customers.customer && existingTable) {
      navigationTimeout = setTimeout(() => {
        history.push("/customer/cart");
      }, 2000);
    }

    return () => {
      if (setTableTimeout) clearTimeout(setTableTimeout);
      if (navigationTimeout) clearTimeout(navigationTimeout);
    };
  }, [Customers.customer, existingTable, dispatch, history, isLoading, table]);

  if (isLoading || (Customers.customer && (table || existingTable))) {
    return (
      <div
        style={{
          width: "100vw",
          height: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <LoadingCustom />
      </div>
    );
  }

  if (Customers.customer && !table) return <Form table />;
  if (!Customers.customer && table) return <Form username />;
  return <Form table username />;
};

export default CustomerInitPage;
