import proc from "./proc"
export function runSaga({ dispatch, getState, channel }, saga) {
  let iterator = saga();
  const env = {
    dispatch,
    getState,
    channel,
  };
  // 执行迭代器
  proc(env, iterator);
}
