import React from "react";
import { Route, Redirect } from "react-router-dom";
import { useSelector } from "react-redux";

const CostumersRoute = ({ role, component: Component, ...rest }) => {
  const customer = useSelector((state) => state.Customers.customer);
  const table = useSelector((state) => state.Tables.table);
  let pathname = "/customer/init/:_id_table";

  return (
    <Route
      {...rest}
      render={(props) => {
        if (customer && table) {
          return <Component />;
        } else {
          return (
            <Redirect
              to={{ pathname: pathname, state: { from: props.location } }}
            />
          );
        }
      }}
    />
  );
};

export default CostumersRoute;
