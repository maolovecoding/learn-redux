class Context {
  next = 0;
  done = false;
  stop() {
    this.done = true;
  }
}

exports.mark = function (genFun) {
  return genFun;
};
exports.wrap = (innerFn, outerFn) => {
  const generator = Object.create(outerFn.prototype);
  const context = new Context();
  generator.next = (args) => {
    context.sent = args;
    const value = innerFn(context);
    return {
      value,
      done: context.done,
    };
  };
  return generator;
};
