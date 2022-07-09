import { ADD2, MINUS2, ADDNUM2 } from "../action-type";
function reducer(state = { counter: 0 }, action) {
  switch (action.type) {
    case ADD2:
      return { counter: state.counter + 1 };
    case ADDNUM2:
      return { counter: state.counter + action.payload.num };
    case MINUS2:
      return { counter: state.counter - 1 };
    default:
      return state;
  }
}

export default reducer;
