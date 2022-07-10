import { createStore, applyMiddleware } from "redux";
import combineReducer from "./reducer";
import { createReduxHistory, routerMiddleware } from "../history";
// 应用中间件
export const store =
  applyMiddleware(routerMiddleware)(createStore)(combineReducer);

window.store = store
export const history = createReduxHistory(store);
