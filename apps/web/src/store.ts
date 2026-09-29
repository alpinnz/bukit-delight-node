import { applyMiddleware, createStore } from "redux";
import type { AnyAction } from "redux";
import type { Middleware } from "redux";
import type { ThunkDispatch } from "redux-thunk";
import { thunk } from "redux-thunk";
import { createLogger } from "redux-logger";
import RootReducer from "./reducers";

const middlewares: Middleware[] = [thunk];
if (import.meta.env.DEV) {
  middlewares.push(createLogger());
}

const store = createStore(RootReducer, applyMiddleware(...middlewares));

export type AppDispatch = typeof store.dispatch &
  ThunkDispatch<ReturnType<typeof RootReducer>, unknown, AnyAction>;

export default store;
