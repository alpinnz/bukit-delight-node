import type { ReactNode } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import type { RootState } from "../reducers";

type PrivateRouteProps = {
  role: string;
  children: ReactNode;
};

const roleHomePaths: Record<string, string> = {
  owner: "/owner/dashboard",
  cashier: "/cashier/home",
};

const PrivateRoute = ({ role, children }: PrivateRouteProps) => {
  const account = useSelector(
    (state: RootState) => state.Authentication.account,
  );
  const location = useLocation();

  if (!account) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  const roleName = role.toLowerCase();
  const roleAuth = `${account.role}`.toLowerCase();
  const roles = account.roles ?? [roleAuth];
  if (roles.some((userRole) => userRole.toLowerCase() === roleName))
    return children;

  return (
    <Navigate
      to={roleHomePaths[roleAuth] ?? "/"}
      state={{ from: location }}
      replace
    />
  );
};

export default PrivateRoute;
