// 实现一个 thunk中间件 支持派发一个函数
export function thunk({ dispatch, getState }) {
  return function (next) {
    return (action) => {
      // 派发的action是函数 执行该函数 传入dispatch和getState
      if (typeof action === "function") {
        // 也就是当前中间件后面的中间件使用的dispatch 都是前一个中间件处理过后的dispatch
        return action(dispatch, getState);
      } else {
        return next(action);
      }
    };
  };
}
