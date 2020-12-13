import { combineReducers } from "redux";
import Categories from "./categories.reducer";
import Accounts from "./accounts.reducer";
import Services from "./services.reducer";
import Tables from "./tables.reducer";
import Menus from "./menus.reducer";
import Roles from "./roles.reducer";

const RootReducer = combineReducers({
  Categories,
  Accounts,
  Services,
  Tables,
  Menus,
  Roles,
});

export default RootReducer;
