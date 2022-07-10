import { PUT, TAKE } from "./effectTypes";

export const take = (actionType) => {
  return { type: TAKE, actionType };
};
export const put = (action) => {
  return { type: PUT, action };
};
