/**
 *
 * @param {Generator[]} effects 迭代器数组
 * @param {Function} parentNext 父saga的next函数
 */
export function createAllStyleChildCallbacks(effects, parentNext) {
  const keys = Object.keys(effects);
  const totalCount = effects.length;
  let completeCount = 0; //完成的数量
  const results = new Array(totalCount);
  const childrenCallbacks = {};
  const checkEnd = () =>{
    if( totalCount === completeCount) parentNext(results)
  }
  keys.forEach((key) => {
    // 每完成一个子effect 就会调用对应的子回调函数
    childrenCallbacks[key] = (res) => {
      debugger
      results[key] = res;
      completeCount++;
      checkEnd();
    };
  });
  return childrenCallbacks;
}
