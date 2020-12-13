import React from "react";
import { Route, Redirect } from "react-router-dom";

const PrivateRoute = ({ component: Component, role, ...rest }) => {
  const pathname = role === "admin" ? "/admin/login" : "/";
  const isLogin = true;

  return (
    <Route
      {...rest}
      render={(props) => {
        if (!isLogin) {
          // not logged in so redirect to login page with the return url
          return (
            <Redirect
              to={{ pathname: pathname, state: { from: props.location } }}
            />
          );
        }

        // logged in so return component
        return <Component {...props} />;
      }}
    />
  );
};

export default PrivateRoute;
