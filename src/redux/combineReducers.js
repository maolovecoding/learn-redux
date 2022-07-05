/**
 * 合并多个reducer
 * 如果需要合并一百个reducer 只有一个reducer的状态需要更新 但是仍然会把所有的reducer都跑一便
 * @param {{[key:string]:Function}} reducers {counter1: reducer1 }
 */
export function combineReducers(reducers) {
  // 返回一个全局唯一的reducer函数  state是每次传入的上次的state
  return function (state = {}, action) {
    let nextState = {};
    for (const key in reducers) {
      const reducer = reducers[key];
      // 老状态 获取的是当前key对应的reducer需要的state
      const lastStateForKey = state[key];
      // 计算新状态
      nextState[key] = reducer(lastStateForKey, action);
    }
    console.log(nextState);
    return nextState;
  };
}
