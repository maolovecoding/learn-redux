import counter1 from "./counter1";
import counter2 from "./counter2";
import { combineReducers } from "../../redux";

// 合并多个reducer
const reducers = { counter1, counter2 };
const combineReducer = combineReducers(reducers);

export default combineReducer;
