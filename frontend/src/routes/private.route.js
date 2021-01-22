import React from "react";
import { Route, Redirect } from "react-router-dom";
import { useSelector } from "react-redux";

const PrivateRoute = (props) => {
  const { role, component: Component, ...rest } = props;
  const Authentication = useSelector((state) => state.Authentication);

  return (
    <Route
      {...rest}
      render={(props) => {
        if (Authentication.account) {
          const roleName = `${role}`.toLowerCase();
          const roleAuth = `${Authentication.account.role}`.toLowerCase();
          const isRole = roleName === roleAuth ? true : false;
          if (isRole) {
            return <Component />;
          } else {
            return (
              <Redirect
                to={{
                  pathname: `/${roleAuth}`,
                  state: { from: props.location },
                }}
              />
            );
          }
        } else {
          return (
            <Redirect
              to={{ pathname: "/login", state: { from: props.location } }}
            />
          );
        }
      }}
    />
  );
};

export default PrivateRoute;
