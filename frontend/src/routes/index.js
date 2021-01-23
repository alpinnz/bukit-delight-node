import {
  BrowserRouter as Router,
  Route,
  Switch,
  Redirect,
} from "react-router-dom";

import PrivateRoute from "./private.route";
import CostumersRoute from "./costumers.route";

import LandingPage from "./../pages/landing.page";
// customers page
import CustomerInitPage from "./../pages/customer/init";
import CustomerHomePage from "./../pages/customer/home";
import CustomerBookPage from "./../pages/customer/book";
import CustomerMenuPage from "./../pages/customer/menu";
import CustomerCartPage from "./../pages/customer/cart";

import LoginPage from "./../pages/login.page";
// customers page
import KasirHomePage from "./../pages/kasir/home";
import KasirMenusPage from "./../pages/kasir/menus";
import KasirOrdersPage from "./../pages/kasir/orders";
import KasirTransactionsPage from "./../pages/kasir/transactions";
// admins page

import AdminDashboardPage from "./../pages/admin/dashboard.page";
import AdminFavoritesPage from "./../pages/admin/favorites";
import AdminMenusPage from "./../pages/admin/menus";
import AdminCategoriesPage from "./../pages/admin/categories";
import AdminTablesPage from "./../pages/admin/tables";
import AdminAccountsPage from "./../pages/admin/accounts";
import AdminTransactionsPage from "./../pages/admin/transactions";

const Routes = () => {
  return (
    <Router>
      <Switch>
        {/* Landding Page */}
        <Route path="/" exact component={LandingPage} />
        {/* login */}
        <Route path="/login" component={LoginPage} />

        {/* CUSTOMER ROUTE */}
        <Route path="/customer/init/:name_table" component={CustomerInitPage} />
        <CostumersRoute path="/customer/home" component={CustomerHomePage} />
        <CostumersRoute
          path="/customer/book/:_id"
          component={CustomerMenuPage}
        />

        <CostumersRoute path="/customer/book" component={CustomerBookPage} />
        <CostumersRoute path="/customer/cart" component={CustomerCartPage} />
        {/* Redirect */}
        <Redirect from="/customer*" to="/customer/home" />

        {/* KASIR ROUTE */}
        <PrivateRoute
          role="kasir"
          path="/kasir/home"
          component={KasirHomePage}
        />
        <PrivateRoute
          role="kasir"
          path="/kasir/menus"
          component={KasirMenusPage}
        />

        <PrivateRoute
          role="kasir"
          path="/kasir/orders"
          component={KasirOrdersPage}
        />
        <PrivateRoute
          role="kasir"
          path="/kasir/transactions"
          component={KasirTransactionsPage}
        />
        {/* Redirect */}
        <Redirect from="/kasir*" to="/kasir/home" />

        {/* ADMIN ROUTE */}
        <PrivateRoute
          role="admin"
          path="/admin/menus"
          component={AdminMenusPage}
        />
        <PrivateRoute
          role="admin"
          path="/admin/categories"
          component={AdminCategoriesPage}
        />
        <PrivateRoute
          role="admin"
          path="/admin/tables"
          component={AdminTablesPage}
        />
        <PrivateRoute
          role="admin"
          path="/admin/accounts"
          component={AdminAccountsPage}
        />
        <PrivateRoute
          role="admin"
          path="/admin/dashboard"
          component={AdminDashboardPage}
        />

        <PrivateRoute
          role="admin"
          path="/admin/transactions"
          component={AdminTransactionsPage}
        />
        <PrivateRoute
          role="admin"
          path="/admin/favorites"
          component={AdminFavoritesPage}
        />

        {/* Redirect */}
        <Redirect from="/admin*" to="/admin/dashboard" />
        <Redirect from="/*" to="/" />
      </Switch>
    </Router>
  );
};

export default Routes;
