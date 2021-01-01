import { combineReducers } from "redux";
import Authentication from "./authentication.reducer";

const RootReducer = combineReducers({
  Authentication,
});

export default RootReducer;
