import { PUT, TAKE } from "./effectTypes";

/**
 * 执行启动的saga生成器函数
 * @param {*} saga
 */
export default function runSaga(env, saga) {
  // 派发的API
  const { dispatch, getState, channel } = env;
  // 根saga是生成器函数 后续的调用可能是迭代器了
  const it = typeof saga === "function" ? saga() : saga;
  function next(value) {
    debugger
    const { value: effect, done } = it.next(value);
    if (!done) {
      if (typeof effect[Symbol.iterator] === "function") {
        // yield后面是一个新的迭代器
        runSaga(env, effect);
        next();
      } else if (effect && typeof effect.then === "function") {
        // promise
        effect.then(next);
      } else {
        switch (effect.type) {
          // task 任务只监听一次
          case TAKE:
            channel.once(effect.actionType, next);
            break;
          case PUT:
            // 派发action
            dispatch(effect.action);
            break;
          default:
            break;
        }
      }
    }
  }
  next();
}
