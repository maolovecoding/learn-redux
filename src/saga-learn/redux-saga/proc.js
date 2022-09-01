import { effectRunnerMap } from "./effect";
import * as is from "./is";
/**
 * 自动执行迭代器
 * @param {*} env
 * @param {*} iterator
 * @param {} continueNextIterator 继续执行上一个阻塞的迭代器
 */
export default function proc(env, iterator, continueNextIterator) {
  /**
   *
   * @param {*} args 上一个yield的执行结果
   * @param {*} isError 出现错误 则第一个参数是错误对象
   */
  const next = (args, isError) => {
    let result;
    // 迭代器执行时出现错误
    if (isError === true) {
      result = iterator.throw(args);
    } else {
      // result = yield take(xxx) => {value:take(xxx), done:false}
      result = iterator.next(args);
    }
    // 继续执行迭代器
    if (!result.done) {
      runEffect(result.value, next);
    } else {
      // 当前的saga执行完毕了 可以执行上一个被当前新迭代器阻塞的saga
      continueNextIterator?.();
    }
  };
  const runEffect = (effect, next) => {
    if (is.promise(effect)) {
      // yield promise
      resolvePromise(effect, next); // 等待promise完成 再向下操作
    }
    // yield的是一个迭代器
    else if (is.iterator(effect)) {
      // 执行迭代器 此操作会阻塞当前的迭代器执行
      proc(env, effect, next); // 重头开始执行新的迭代器
    }
    // {type:'TAKE',payload:{pattern:'ASYNC_ADD'}}
    else {
      if (effect) {
        // 为了能够处理不同类型的effect 走不同的执行流程 策略模式
        const effectRunner = effectRunnerMap[effect.type];
        effectRunner(env, effect.payload, next, { runEffect });
      } else next();
    }
  };
  next();
}

async function resolvePromise(promise, next) {
  try {
    next(await promise);
  } catch (err) {
    next(err, true); // promise 失败 也可以认为是网络请求失败
  }
}
