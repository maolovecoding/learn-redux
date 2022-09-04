import { TAKE, PUT, FORK, CALL, CPS, ALL, CANCEL } from "./effectType";
const makeEffect = (type, payload) => {
  return { type, payload };
};
/**
 * 只监听一次 once
 * @param {*} pattern 动作类型
 * @returns
 */
export function take(pattern) {
  // {type:'TAKE', payload:{pattern:ASYNC_ADD}}
  return makeEffect(TAKE, { pattern });
}
/**
 * 派发action并执行
 * @param {*} action
 * @returns
 */
export function put(action) {
  // {type:'PUT', payload:{action:{type:'ADD'}}}
  return makeEffect(PUT, { action });
}
/**
 * 监听每一次动作并执行saga生成器
 * @param {*} pattern 动作类型 一般是reducer中没有的
 * @param {*} saga
 * @returns
 */
export function takeEvery(pattern, saga) {
  function* takeEveryHelper() {
    while (1) {
      yield take(pattern); // 监听pattern对应的动作类型
      yield fork(saga); // 开启子进程
    }
  }
  return fork(takeEveryHelper);
}
/**
 * fork异步非阻塞调用 无阻塞的执行fn 执行fn的时候 不会暂停generator
 * 一个task就像是一个在后台运行的进程，在基于redux-saga的应用程序中
 * 可以同时运行多个task
 * @param {*} fn 子saga 也就是说子saga和当前的父saga函数是 `并行` 执行的
 * @returns
 */
export function fork(fn) {
  // {type:'FORK', payload:{fn:add}}
  return makeEffect(FORK, { fn });
}
/**
 *
 * @param {*} fn 调用该函数返回值是一个promise 等待该promise执行完成再向下走
 * @param {any[]} args 传给fn的参数
 */
export function call(fn, ...args) {
  return makeEffect(CALL, { fn, args });
}
/**
 * 错误优先的回调函数调用风格 node中的
 * @param {*} fn
 * @param  {...any} args
 * @returns
 */
export function cps(fn, ...args) {
  return makeEffect(CPS, { fn, args });
}
/**
 * all合并多个异步操作 当某个操作失败或者全部操作成功则进行返回
 * all中的异步操作是并发也是同步，不用等一个结束 也不用等另一个开始
 * @param {GeneratorFunction[]} effects
 */
export function all(effects) {
  return makeEffect(ALL, effects);
}
/**
 * cancel 指示middleware取消之前的 fork 任务 cancel是一个无阻塞的effect
 * @returns
 */
export function cancel(task) {
  return makeEffect(CANCEL, task);
}

export function delayP(ms) {
  const promise = new Promise((resolve) => setTimeout(resolve, ms));
  return promise;
}
export const delay = call.bind(null, delayP);
