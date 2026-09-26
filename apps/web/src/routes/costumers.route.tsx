import type { ComponentType } from "react";
import { Redirect, Route, type RouteProps } from "react-router-dom";
import { useSelector } from "react-redux";
import type { RootState } from "../reducers";

type CustomersRouteProps = Omit<RouteProps, "component" | "render"> & {
  component: ComponentType;
};

const CustomersRoute = ({ component: Component, ...rest }: CustomersRouteProps) => {
  const customer = useSelector((state: RootState) => state.Customers.customer);
  const table = useSelector((state: RootState) => state.Tables.table);

  return (
    <Route
      {...rest}
      render={(routeProps) =>
        customer && table ? (
          <Component />
        ) : (
          <Redirect
            to={{
              pathname: "/customer/init/:_id_table",
              state: { from: routeProps.location },
            }}
          />
        )
      }
    />
  );
};

export default CustomersRoute;
