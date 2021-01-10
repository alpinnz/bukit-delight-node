import React from "react";
import { Route, Redirect } from "react-router-dom";
import { useSelector } from "react-redux";

const PrivateRoute = ({ role, component: Component, ...rest }) => {
  const Authentication = useSelector((state) => state.Authentication);
  const isAuth = Authentication.account.username;
  const isRole =
    `${Authentication.account.role}`.toLowerCase() === `${role}`.toLowerCase()
      ? true
      : false;
  let pathname;

  switch (`${role}`.toLowerCase()) {
    case "admin":
      pathname = "/admin/login";
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
        if (isAuth && isRole) {
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
