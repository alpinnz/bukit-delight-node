import React from "react";
import { withRouter } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { useHistory, useParams } from "react-router-dom";
import Form from "./form";
import Actions from "./../../../actions";
import LoadingCustom from "./../../../components/common/loading.custom";

export const InitPage = () => {
  document.title = "Customer";
  const { name_table } = useParams();
  const Customers = useSelector((state) => state.Customers);
  const Tables = useSelector((state) => state.Tables);
  const Orders = useSelector((state) => state.Orders);
  const Transactions = useSelector((state) => state.Transactions);
  const dispatch = useDispatch();
  const history = useHistory();

  const table = Tables.data.find((e) => e["name"] === name_table);

  if (
    Tables.loading ||
    Customers.loading ||
    Orders.loading ||
    Transactions.loading
  ) {
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
        {/* <div>{Customers.customer.username}</div>
        <div>{name_table}</div> */}
        <LoadingCustom />
      </div>
    );
  }

  if (Customers.customer && table) {
    setTimeout(() => {
      dispatch(Actions.Tables.setTable(table));
    }, 1000);
    setTimeout(() => {
      history.push(`/customer/home`);
    }, 2000);

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
        {/* <div>{Customers.customer.username}</div>
        <div>{name_table}</div> */}
        <LoadingCustom />
      </div>
    );
  } else if (Customers.customer && Tables.table) {
    setTimeout(() => {
      history.push(`/customer/cart`);
    }, 2000);

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
        {/* <div>{Customers.customer.username}</div>
        <div>{name_table}</div> */}
        <LoadingCustom />
      </div>
    );
  } else if (!table && Customers.customer) {
    return (
      <div>
        <Form table />
      </div>
    );
  } else if (!Customers.customer && table) {
    return (
      <div>
        <Form username />
      </div>
    );
  } else {
    return (
      <div>
        <Form table username />
      </div>
    );
  }
};

export default withRouter(InitPage);
