import { combineReducers } from "redux";
import { connectRouter } from "connected-react-router";
import { counter } from "./counter";
import history from "../../history";
const reducers = {
  counter,
  // 合并router
  router: connectRouter(history),
};
export default combineReducers(reducers);
