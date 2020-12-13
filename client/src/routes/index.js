import * as React from "react";
import { Router, Switch, Route, Redirect } from "react-router-dom";
import PrivateRoute from "./private.route";
import AdminLoginView from "./../views/admin/login.view";
import AdminDashboardView from "./../views/admin/dashboard.view";
import AdminCategoriesView from "./../views/admin/categories.view";
import AdminTablesView from "./../views/admin/tables.view";
import AdminMenusView from "./../views/admin/menus.view";
import AdminAccountsView from "./../views/admin/accounts.view";
import history from "./../helpers/history";

const Routes = () => {
  React.useEffect(() => {
    history.listen((location, action) => {
      // clear alert on location change
      // dispatch(alertActions.clear());
      console.log(location, action);
    });
  }, []);
  return (
    <Router history={history}>
      <Switch>
        <Route exact path="/" component={Home} />
        <Route path="/login" component={AdminLoginView} />
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
        <Redirect from="/admin/*" to="/admin/dashboard" />
        <Redirect from="/*" to="/" />
      </Switch>
    </Router>
  );
};

export default Routes;

function Home() {
  return (
    <div>
      <h2>Home</h2>
    </div>
  );
}
