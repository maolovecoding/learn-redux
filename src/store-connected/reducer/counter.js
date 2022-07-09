import { ADD, SUB } from "../action-type";
export const counter = (state = { number: 0 }, action) => {
  switch (action.type) {
    case ADD:
      return { number: state.number + 1 };
    case SUB:
      return { number: state.number - 1 };
    default:
      return state;
  }
};
