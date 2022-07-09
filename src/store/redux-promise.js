// 实现redux-promise中间件
export function promise({ dispatch, getState }) {
  return (next) => {
    return (action) => {
      debugger;
      // action是一个promise
      if (action.then && typeof action.then === "function") {
        action.then((action) => dispatch(action)).catch(dispatch);
      } else if (action.payload && typeof action.payload.then === "function") {
        action.payload
          // 再次派发 仍然还是走当前所在的中间件 因为当前的dispatch就是被前面的中间件处理过的
          .then((result) => dispatch({ ...action, payload: result }))
          .catch((error) => {
            dispatch({ ...action, payload: error, error: true });
            return Promise.reject(error);
          });
      } else {
        next(action);
      }
    };
  };
}
