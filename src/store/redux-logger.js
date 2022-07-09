
// 实现一个日志中间件 中间件的结构都是定死的
export function logger({ getState, dispatch }) {
  /**
   * @param next 调用下一个中间件 如果只有一个中间件 指向 store.dispatch
   */
  return function fn1(next) {
    /**
     * 改造后的dispatch方法
     * @param action 动作
     */
    return function (action) {
      console.log("prev state :", getState());
      next(action);
      console.log("next state :", getState());
    };
  };
}