import { PUT, TAKE, FORK, CALL, CPS, ALL } from "./effectType";
import proc from "../proc";
import * as is from "../is";
import { createAllStyleChildCallbacks } from "../utils";
const effectRunnerMap = {
  [TAKE]: runTakeEffect,
  [PUT]: runPutEffect,
  [FORK]: runForkEffect,
  [CALL]: runCallEffect,
  [CPS]: runCpsEffect,
  [ALL]: runAllEffect,
};
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
  env.dispatch(payload.action);
  next();
}
function runForkEffect(env, payload, next) {
  const iteratorTask = payload.fn(); // saga执行
  proc(env, iteratorTask);
  next(); // 不会阻塞 而是直接调用next
}
function runCallEffect(env, payload, next) {
  const { fn, args } = payload;
  // 看函数执行结果是不是promise
  const res = fn(...args);
  if (is.promise(res)) {
    res.then(next).catch((err) => next(err, true));
  } else {
    next(res);
  }
}
function runCpsEffect(env, payload, next) {
  const { fn, args } = payload;
  // 多传一个回调函数
  fn(...args, (err, data) => {
    if (err) {
      next(err, true);
    } else {
      next(data);
    }
  });
}
/**
 * 同时执行多个迭代器
 * @param {*} env
 * @param {*} payload
 * @param {*} next
 */
function runAllEffect(env, payload, next, { runEffect }) {
  const effects = payload;
  const keys = Object.keys(effects);
  if (keys.length === 0) return next([]);
  const childCallbacks = createAllStyleChildCallbacks(effects, next);
  keys.forEach((key) => {
    // 执行saga 以及我们上面创建的回调函数
    runEffect(effects[key], childCallbacks[key]);
  });
}
export default effectRunnerMap;
