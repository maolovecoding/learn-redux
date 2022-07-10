// 代表一个动作类型 调用历史对象的方法
export const CALL_HISTORY_METHOD = "@@router/CALL_HISTORY_METHOD";
// 当路径发生改变之后 派发的动作类型
export const LOCATION_CHANGE = "@@router/LOCATION_CHANGE";
/**
 * actionCreator 创建action的函数
 * @param {*} location
 * @param {*} action
 * @returns
 */
export const locationChangeAction = (location, action) => {
  return {
    type: LOCATION_CHANGE,
    payload: { action, location },
  };
};

const updateLocation = (method) => {
  return (...args) => ({
    type: CALL_HISTORY_METHOD,
    payload: { method, args },
  });
};
export const push = updateLocation("push");
export const replace = updateLocation("replace");
