import { ADD2, MINUS2, ADDNUM2 } from "../action-type";
// actionCreators
const add2 = () => ({ type: ADD2 });
const addNum2 = (num) => ({ type: ADDNUM2, num });
const minus2 = () => ({ type: MINUS2 });
const actionCreators2 = { add2, addNum2, minus2 };
export default actionCreators2;
