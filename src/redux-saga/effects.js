import { ALL, CALL, CANCEL, CPS, FORK, PUT, TAKE } from "./effectTypes";

export const take = (actionType) => {
  return { type: TAKE, actionType };
};
export const takeEvery = (actionType, saga) => {
  function* takeEveryHelper() {
    while (true) {
      // 监听actionType
      const action = yield take(actionType);
      // 开启新的子进程 执行saga
      yield fork(saga, action);
    }
  }
  return fork(takeEveryHelper);
};
export const put = (action) => {
  return { type: PUT, action };
};
/**
 * 开启子进程执行新的saga
 * @param {*} saga
 * @returns
 */
export const fork = (saga, ...args) => {
  return { type: FORK, saga, args };
};
/**
 * 返回一个指令对象 告诉saga帮忙执行一个promise函数 且传入相关的参数
 * @param {*} fn
 * @param  {...any} args
 */
export const call = (fn, ...args) => {
  return { type: CALL, fn, args };
};
/**
 * 执行异步函数 但是是回调函数形式的
 * @param {*} fn
 * @param  {...any} args
 * @returns
 */
export const cps = (fn, ...args) => {
  return { type: CPS, fn, args };
};
/**
 * 传入一个迭代器
 * @param {*} iterators 可能是一个对象 或者是一个数组
 */
export const all = (iterators) => {
  // 全都转为数组
  iterators = Array.isArray(iterators) ? iterators : [iterators];
  return { type: ALL, iterators };
};
/**
 * 取消任务 中断迭代器的执行
 * @param {*} task
 */
export const cancel = (task) => {
  return { type: CANCEL, task };
};
const delayFn = (ms, ...args) => {
  return new Promise((resolve) => {
    setTimeout(resolve, ms, ...args);
  });
};
export const delay = (...args) => {
  return call(delayFn, ...args);
};
