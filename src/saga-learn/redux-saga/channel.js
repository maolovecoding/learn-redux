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
    // 利用闭包先拷贝一份数据 防止其他的saga修改了同一份变量导致问题
    const takers = currentTasks
    for (let i = 0; i < takers.length; i++) {
      const taker = takers[i];
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
