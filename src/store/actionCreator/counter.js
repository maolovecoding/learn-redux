import { ADD, MINUS, ADDNUM } from "../action-type";
// actionCreators
const add = () => ({ type: ADD });
const addNum = (num) => ({ type: ADDNUM, num });
const minus = () => ({ type: MINUS });
const actionCreators = { add, addNum, minus };
export default actionCreators;
