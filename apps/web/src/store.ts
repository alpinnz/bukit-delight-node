import { createStore, applyMiddleware } from "redux";
import type { AnyAction } from "redux";
import type { ThunkDispatch } from "redux-thunk";
import thunkMiddleware from "redux-thunk";
import { createLogger } from "redux-logger";
import RootReducer from "./reducers";

const loggerMiddleware = createLogger();

const store = createStore(
  RootReducer,
  applyMiddleware(thunkMiddleware, loggerMiddleware),
);

export type AppDispatch = typeof store.dispatch &
  ThunkDispatch<ReturnType<typeof RootReducer>, unknown, AnyAction>;

export default store;
