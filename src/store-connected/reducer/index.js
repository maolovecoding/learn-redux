import { combineReducers } from "redux";
import { counter } from "./counter";
import { routerReducer } from "../../demo/redux-first-history-demo/history";
const reducers = {
  counter,
  // 合并router
  router: routerReducer,
};
export default combineReducers(reducers);
