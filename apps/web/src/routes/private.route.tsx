import type { ComponentType } from "react";
import { Redirect, Route, type RouteProps } from "react-router-dom";
import { useSelector } from "react-redux";
import type { RootState } from "../reducers";

type PrivateRouteProps = Omit<RouteProps, "component" | "render"> & {
  role: string;
  component: ComponentType;
};

const PrivateRoute = ({
  role,
  component: Component,
  ...rest
}: PrivateRouteProps) => {
  const account = useSelector((state: RootState) => state.Authentication.account);

  return (
    <Route
      {...rest}
      render={(routeProps) => {
        if (!account) {
          return (
            <Redirect
              to={{ pathname: "/login", state: { from: routeProps.location } }}
            />
          );
        }

        const roleName = role.toLowerCase();
        const roleAuth = `${account.role}`.toLowerCase();
        if (roleName === roleAuth) return <Component />;

        return (
          <Redirect
            to={{ pathname: `/${roleAuth}`, state: { from: routeProps.location } }}
          />
        );
      }}
    />
  );
};

export default PrivateRoute;
