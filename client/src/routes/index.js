/* eslint-disable react-hooks/exhaustive-deps */
import * as React from "react";
import { Router, Switch, Route, Redirect } from "react-router-dom";
import PrivateRoute from "./private.route";
import AdminLoginView from "./../views/admin/login.view";
import AdminDashboardView from "./../views/admin/dashboard.view";
import AdminCategoriesView from "./../views/admin/categories.view";
import AdminTablesView from "./../views/admin/tables.view";
import AdminMenusView from "./../views/admin/menus.view";
import AdminAccountsView from "./../views/admin/accounts.view";
import HomeView from "./../views/home.view";
import BookView from "./../views/book.view";
import MenuView from "./../views/menu.view";
import CartView from "./../views/cart.view";
import history from "./../helpers/history";
import Actions from "./../redux/actions";
import { useDispatch } from "react-redux";

const Routes = () => {
  const dispatch = useDispatch();

  React.useEffect(() => {
    const account = localStorage.getItem("account");
    if (account) {
      dispatch(Actions.Authentication.LOGIN(account));
    }
  }, []);

  return (
    <Router history={history}>
      <Switch>
        <Route exact path="/" component={HomeView} />
        <Route path="/home" component={HomeView} />

        <Route path="/book/:_id" component={MenuView} />
        <Route path="/book" component={BookView} />
        <Route path="/cart" component={CartView} />

        {/*  */}
        <Route path="/admin/login" component={AdminLoginView} />
        <PrivateRoute
          role="admin"
          path="/admin/dashboard"
          component={AdminDashboardView}
        />
        <PrivateRoute
          role="admin"
          path="/admin/categories"
          component={AdminCategoriesView}
        />
        <PrivateRoute
          role="admin"
          path="/admin/tables"
          component={AdminTablesView}
        />
        <PrivateRoute
          role="admin"
          path="/admin/menus"
          component={AdminMenusView}
        />
        <PrivateRoute
          role="admin"
          path="/admin/accounts"
          component={AdminAccountsView}
        />
        <Redirect from="/admin*" to="/admin/dashboard" />
        <Redirect from="/*" to="/" />
      </Switch>
    </Router>
  );
};

export default Routes;
