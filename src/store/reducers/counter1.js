import { ADD, MINUS, ADDNUM } from "../action-type";
/**
 * 纯函数
 * @param {*} state 老状态
 * @param {*} action 动作 必须有一个type属性
 */
function reducer(state = { counter: 0 }, action) {
  switch (action.type) {
    case ADD:
      return { counter: state.counter + 1 };
    case ADDNUM:
      return { counter: state.counter + action.num };
    case MINUS:
      return { counter: state.counter - 1 };
    default:
      return state;
  }
}

export default reducer;
