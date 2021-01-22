import { combineReducers } from "redux";
import Authentication from "./authentication.reducer";
import Accounts from "./accounts.reducer";
import Service from "./service.reducer";
import Tables from "./tables.reducer";
import Categories from "./categories.reducer";
import Roles from "./roles.reducer";
import Menus from "./menus.reducer";
import Cart from "./cart.reducer";
import Orders from "./orders.reducer";
import Transactions from "./transactions.reducer";
import Customers from "./customers.reducer";
import Favorites from "./favorites.reducer";

const RootReducer = combineReducers({
  Authentication,
  Service,
  Accounts,
  Tables,
  Categories,
  Roles,
  Menus,
  Orders,
  Cart,
  Transactions,
  Customers,
  Favorites,
});

export default RootReducer;
