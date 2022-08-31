import { PUT, TAKE } from "./effectType";
const effectRunnerMap = {
  [TAKE]: runTakeEffect,
  [PUT]: runPutEffect,
};
export default effectRunnerMap;
/**
 * 执行 take
 * @param {*} env 
 * @param {*} payload 
 * @param {*} next 
 */
function runTakeEffect(env, payload, next) {
  // payload:{pattern:'ASYNC_ADD'}
  const matcher = (action) => action.type === payload.pattern;
  // 订阅
  env.channel.take(next, matcher);
}

function runPutEffect(env, payload, next) {
  // 派发 dispatch 是经过中间件改造后的dispatch
  env.dispatch(payload.action)
  next()
} 