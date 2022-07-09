import { compose } from "./compose";

/**
 * 应用中间件
 * @param {*} middleware 中间件
 */
export function applyMiddleware(...middleWares) {
  /**
   * @param createStore 创建store仓库
   */
  return function (createStore) {
    /**
     * @param reducer
     * @param preloadedState 初始状态
     */
    return function (reducer, preloadedState) {
      // 创建store
      const store = createStore(reducer);
      // 定义一个dispatch 是中间件处理过后的
      let dispatch;
      const middlewareAPI = {
        getState: store.getState,
        dispatch: (action) => dispatch(action),
      };
      // 拿到中间件的级联 执行一次中间件 将每个中间件的外层store用middlewareAPI去掉
      let chain = middleWares.map((middleWare) => middleWare(middlewareAPI));
      // 中间件组合 得到一个新的函数 然后执行 传入老的dispatch
      dispatch = compose(...chain)(store.dispatch);
      return {
        ...store,
        dispatch,
      };
    };
  };
}
