function* gene() {
  yield 100;
  yield new Promise((resolve) => setTimeout(resolve, 1000, "你好"));
  yield "abc";
  return [];
}
/**
 *
 * @param {Generator} gen
 */
function co(gen) {
  const it = gen();
  function next() {
    const { done, value } = it.next();
    if (done && typeof value === "undefined") return;
    if (value && typeof value.then === "function") {
      value.then((res) => {
        console.log(res);
        next();
      });
    } else {
      console.log(value);
      next();
    }
  }
  next()
}

co(gene)
