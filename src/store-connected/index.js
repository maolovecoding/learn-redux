import { createStore, applyMiddleware } from "redux";
import { routerMiddleware } from "connected-react-router";
import combineReducer from "./reducer";
import history from "../history";
// 应用中间件
const store = applyMiddleware(routerMiddleware(history))(createStore)(combineReducer);

export default store;
