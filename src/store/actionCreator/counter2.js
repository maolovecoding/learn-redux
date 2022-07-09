import { ADD2, MINUS2, ADDNUM2 } from "../action-type";
// actionCreators
const add2 = () => ({ type: ADD2 });
const addNum2 = (num) => ({ type: ADDNUM2, payload: { num } });
const minus2 = () => ({ type: MINUS2 });
const thunkAdd = () => (dispatch, getState) => {
  setTimeout(() => {
    dispatch({ type: ADDNUM2, payload: { num: 2 } });
  }, 1000);
};
const promise1Add = () =>
  new Promise((resolve) => {
    setTimeout(resolve, 1000, { type: ADDNUM2, payload: { num: 3 } });
  });
const promise2Add = () => ({
  type: ADDNUM2,
  payload: new Promise((resolve, reject) => {
    setTimeout(() => {
      if (Math.random() > 0.5) {
        resolve({ num: 4 });
      } else {
        reject({ num: -4 });
      }
    }, 1000);
  }),
});
const actionCreators2 = {
  add2,
  addNum2,
  minus2,
  thunkAdd,
  promise1Add,
  promise2Add,
};
export default actionCreators2;
