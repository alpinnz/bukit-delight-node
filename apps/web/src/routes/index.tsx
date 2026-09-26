import {
  BrowserRouter as Router,
  Route,
  Switch,
  Redirect,
} from "react-router-dom";

import PrivateRoute from "./private.route";
import CostumersRoute from "./costumers.route";

import LandingPage from "../features/landing/pages";
// customers page
import CustomerInitPage from "./../features/customer/pages/init";
import CustomerHomePage from "./../features/customer/pages/home";
import CustomerBookPage from "./../features/customer/pages/book";
import CustomerMenuPage from "./../features/customer/pages/menu";
import CustomerCartPage from "../features/customer/pages/cart";

import LoginPage from "./../features/auth/pages/login.page";
// customers page
import KasirHomePage from "./../features/kasir/pages/home";
import KasirMenusPage from "./../features/kasir/pages/menus";
import KasirOrdersPage from "./../features/kasir/pages/orders";
import KasirTransactionsPage from "./../features/kasir/pages/transactions";
// admins page

import AdminDashboardPage from "./../features/admin/pages/dashboard";
import AdminFavoritesPage from "./../features/admin/pages/favorites";
import AdminMenusPage from "./../features/admin/pages/menus";
import AdminCategoriesPage from "./../features/admin/pages/categories";
import AdminTablesPage from "./../features/admin/pages/tables";
import AdminAccountsPage from "./../features/admin/pages/accounts";
import AdminTransactionsPage from "./../features/admin/pages/transactions";

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
          role="cashier"
          path="/kasir/home"
          component={KasirHomePage}
        />
        <PrivateRoute
          role="cashier"
          path="/kasir/menus"
          component={KasirMenusPage}
        />

        <PrivateRoute
          role="cashier"
          path="/kasir/orders"
          component={KasirOrdersPage}
        />
        <PrivateRoute
          role="cashier"
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

        <PrivateRoute
          role="admin"
          path="/admin/pemesanan"
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
