import React from "react";
import { Route, Redirect } from "react-router-dom";

const PrivateRoute = ({ role, component: Component, ...rest }) => {
  const isAuth = true;
  let pathname;

  switch (`${role}`.toLowerCase()) {
    case "admin":
      pathname = "/admin";
      break;
    case "customer":
      pathname = "/customer";
      break;
    case "kasir":
      pathname = "/kasir";
      break;
    default:
      pathname = "/";
      break;
  }

  return (
    <Route
      {...rest}
      render={(props) => {
        if (isAuth) {
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

export default PrivateRoute;
