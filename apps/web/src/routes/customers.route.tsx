import type { ReactNode } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import type { RootState } from "../reducers";

type CustomersRouteProps = {
  children: ReactNode;
};

const CustomersRoute = ({ children }: CustomersRouteProps) => {
  const customer = useSelector((state: RootState) => state.Customers.customer);
  const table = useSelector((state: RootState) => state.Tables.table);
  const location = useLocation();

  if (customer && table) return children;

  return (
    <Navigate
      to="/customer/init/:tableName"
      state={{ from: location }}
      replace
    />
  );
};

export default CustomersRoute;
