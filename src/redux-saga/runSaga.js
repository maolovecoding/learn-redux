import { PUT, TAKE, FORK, CALL, CPS, ALL } from "./effectTypes";

/**
 * 执行启动的saga生成器函数
 * @param {*} saga
 */
export default function runSaga(env, saga, sageDone) {
  // 派发的API
  const { dispatch, channel } = env;
  // 根saga是生成器函数 后续的调用可能是迭代器了
  const it = typeof saga === "function" ? saga() : saga;
  function next(value, isError) {
    let result;
    if (isError) {
      // 出现错误
      result = it.throw(value);
    } else {
      result = it.next(value);
    }
    const { value: effect, done } = result;
    if (!done) {
      if (typeof effect[Symbol.iterator] === "function") {
        // yield后面是一个新的迭代器 那么就开启一个" 子进程 "  运行该effect
        runSaga(env, effect);
        // 当前saga继续向后执行 直到结束
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
            // 继续执行下一步
            next();
            break;
          case FORK:
            // effect类型是开启子进程
            const foreTask = runSaga(
              env,
              effect.saga.bind(null, ...effect.args)
            );
            // 继续执行下一步
            next(foreTask);
            break;
          case CALL:
            effect.fn(...effect.args).then(next);
            break;
          case CPS:
            effect.fn(...effect.args, (err, data) => {
              if (err) {
                next(err, true);
              } else {
                next(data);
              }
            });
            break;
          case ALL:
            debugger
            // 迭代器数组
            const { iterators } = effect;
            // 存放结果对象 放置每个迭代器的返回值
            const res = [];
            // 迭代器完成的数量
            let completeCount = 0;
            iterators.forEach((iterator, index) => {
              // 循环迭代器 开启一个新的子进程
              runSaga(env, iterator, (data) => {
                res[index] = data;
                if (++completeCount === iterators.length) {
                  next(res);
                }
              });
            });
            break;
          default:
            break;
        }
      }
    } else {
      // 当前的迭代器执行完毕了
      if (typeof sageDone === "function") {
        sageDone(effect);
      }
    }
  }
  next();
}
