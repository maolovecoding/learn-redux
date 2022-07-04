/*
 * @Author: 毛毛
 * @Date: 2022-07-04 17:04:24
 * @Last Modified by: 毛毛
 * @Last Modified time: 2022-07-04 17:16:10
 */
// redux 的学习
/**
 * 创建一个 store
 * @param {*} reducer 纯函数 计算新状态的处理器
 * @param {*} initialState 初始状态
 */
function createStore(reducer, initialState) {
  // 在仓库内部定义一个初始的状态
  let state = initialState;
  // 监听函数
  let listeners = [];
  /**
   * 获取当前仓库最新的状态
   */
  function getState() {
    return state;
  }
  /**
   * 订阅状态的更新
   * @param {*} listener 状态更新后执行的监听函数
   * @returns 返回一个可以取消监听函数的方法
   */
  function subscribe(listener) {
    listeners.push(listener);
    // 返回一个可以取消监听函数的方法
    return () => {
      listeners = listeners.filter((l) => l !== listener);
    };
  }
  /**
   * 派发 更新状态
   * @param {*} action 动作
   */
  function dispatch(action) {
    state = reducer(state, action);
    // 执行监听函数
    listeners.forEach((listener) => listener());
  }
  // 初始化状态
  dispatch({ type: "@@REDUX/INIT" });
  return {
    getState,
    dispatch,
    subscribe,
  };
}
export { createStore };
