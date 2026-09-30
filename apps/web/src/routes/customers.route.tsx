import type { ReactNode } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import type { RootState } from "../reducers";

type CustomersRouteProps = {
  children: ReactNode;
  requireTable?: boolean;
};

const CustomersRoute = ({
  children,
  requireTable = false,
}: CustomersRouteProps) => {
  const account = useSelector(
    (state: RootState) => state.Authentication.account,
  );
  const customer = useSelector((state: RootState) => state.Customers.customer);
  const table = useSelector((state: RootState) => state.Tables.table);
  const location = useLocation();
  const hasCustomerRole = Boolean(
    (account?.roles ?? [account?.role ?? ""]).some(
      (role) => role.toLowerCase() === "customer",
    ),
  );

  if (
    !account ||
    !hasCustomerRole ||
    !customer?.id ||
    account.id !== customer.id
  ) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (requireTable && !table) return <Navigate to="/customer/home" replace />;

  return children;
};

export default CustomersRoute;
