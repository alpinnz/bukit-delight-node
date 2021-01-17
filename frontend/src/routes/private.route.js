import React from "react";
import { Route, Redirect } from "react-router-dom";
import { useSelector } from "react-redux";

const PrivateRoute = (props) => {
  const { role, component: Component, ...rest } = props;
  const account = useSelector((state) => state.Authentication.account);
  console.log("account", account);

  return (
    <Route
      {...rest}
      render={(props) => {
        if (account) {
          const roleName = `${role}`.toLowerCase();
          const roleAuth = `${account.role}`.toLowerCase();
          const isRole = roleName === roleAuth ? true : false;
          if (isRole) {
            return <Component />;
          } else {
            <Redirect
              to={{ pathname: `/${roleName}`, state: { from: props.location } }}
            />;
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
