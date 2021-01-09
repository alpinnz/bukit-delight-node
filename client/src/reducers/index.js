import { combineReducers } from "redux";
import Authentication from "./authentication.reducer";
import Accounts from "./accounts.reducer";
import Users from "./users.reducer";
import Service from "./service.reducer";
import Tables from "./tables.reducer";
import Categories from "./categories.reducer";
import Roles from "./roles.reducer";
import Menus from "./menus.reducer";
import Cart from "./cart.reducer";
import Orders from "./orders.reducer";

const RootReducer = combineReducers({
  Authentication,
  Users,
  Service,
  Accounts,
  Tables,
  Categories,
  Roles,
  Menus,
  Orders,
  Cart,
});

export default RootReducer;
