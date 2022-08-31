/**
 * 管道 就是发布订阅模式
 */
export function stdChannel() {
  let currentTasks = [];
  // 订阅
  function take(taker, matcher) {
    taker["MATCH"] = matcher;
    // take 只能派发一次
    taker.cancel = () => {
      currentTasks = currentTasks.filter((item) => item !== taker);
    };
    currentTasks.push(taker);
  }
  // 发布
  function put(input) {
    for (let i = 0; i < currentTasks.length; i++) {
      const taker = currentTasks[i];
      // 是否匹配该cb 是否需要执行
      if (taker["MATCH"](input)) {
        taker.cancel()
        taker(input);
      }
    }
  }
  return { take, put };
}
// const channel = stdChannel();
// function next(action) {
//   console.log(action);
//   // reducer ...
// }
// function matcher(input) {
//   return input.type === "ASYNC_ADD";
// }
// channel.take(next, matcher);
// channel.put({ type: "ASYNC_ADD", payload: { num: 1 } });
// channel.put({ type: "ASYNC_ADD", payload: { num: 1 } });
// channel.put({ type: "ASYNC_ADD", payload: { num: 1 } });
