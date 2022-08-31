import {effectRunnerMap} from './effect'
/**
 * 自动执行迭代器
 * @param {*} env
 * @param {*} iterator
 */
export default function proc(env, iterator) {
  const next = (args) => {
    debugger
    let result;
    // result = yield take(xxx) => {value:take(xxx), done:false}
    result = iterator.next(args);
    // 继续执行迭代器
    if (!result.done) {
      runEffect(result.value, next);
    }
  };
  const runEffect = (effect, next) => {
    // {type:'TAKE',payload:{pattern:'ASYNC_ADD'}}
    if (effect) {
      debugger
      // 为了能够处理不同类型的effect 走不同的执行流程 策略模式
      const effectRunner = effectRunnerMap[effect.type];
      effectRunner(env, effect.payload, next, { runEffect });
    }else next()
  };
  next();
}
