import { combineReducers } from "redux";
import { counter } from "./counter";
import { routerReducer } from "../../history";
const reducers = {
  counter,
  // 合并router
  router: routerReducer,
};
export default combineReducers(reducers);
