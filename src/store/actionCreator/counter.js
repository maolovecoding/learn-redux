import { ADD, MINUS } from "../action-type";
// actionCreators
const add = () => ({ type: ADD });
const minus = () => ({ type: MINUS });
const actionCreators = { add, minus };
export default actionCreators;
