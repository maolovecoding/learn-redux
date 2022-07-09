import { createStore, applyMiddleware } from "../redux";
import combineReducer from "./reducers";
import { logger } from "./redux-logger";
import { logger2 } from "./redux-logger2";
import { promise } from "./redux-promise";
import { thunk } from "./redux-thunk";
// const store = createStore(combineReducer);

const store = applyMiddleware(promise, thunk, logger)(createStore)(
  combineReducer
);

export default store;
export * from "./action-type";
