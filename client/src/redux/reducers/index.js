import { combineReducers } from "redux";
import Categories from "./categories.reducer";
import Accounts from "./accounts.reducer";
import Services from "./services.reducer";
import Tables from "./tables.reducer";
import Menus from "./menus.reducer";
import Roles from "./roles.reducer";
import Authentication from "./authentication.reducer";
import Cart from "./cart.reducer";

const RootReducer = combineReducers({
  Authentication,
  Categories,
  Accounts,
  Services,
  Tables,
  Menus,
  Roles,
  Cart,
});

export default RootReducer;
