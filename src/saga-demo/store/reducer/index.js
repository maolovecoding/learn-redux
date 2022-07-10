import { ADD } from "../action-type";
const reducer = (state = { counter: 0 }, action) => {
  switch (action.type) {
    case ADD:
      return { counter: state.counter + 1 };
    default:
      return state;
  }
};
export default reducer;
