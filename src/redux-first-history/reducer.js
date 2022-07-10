import { LOCATION_CHANGE } from "./action";

export const createRouterReducer = (history) => {
  const initialState = {
    location: history.location,
    action: history.action,
  };
  // 返回reducer 也可以用switch
  return function (state = initialState, { type, payload }) {
    if (type === LOCATION_CHANGE) {
      return {
        ...state,
        location: payload.location,
        action: payload.action,
      };
    } else {
      return state;
    }
  };
};
