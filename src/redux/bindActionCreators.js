/**
 * 绑定actionCreator和dispatch 实现自动派发
 * @param {*} actionCreator
 * @param {*} dispatch
 */
function bindActionCreators(actionCreator, dispatch) {
  // 绑定的自动派发对象
  const boundActionCreators = {};
  for (const key in actionCreator) {
    const ac = actionCreator[key];
    // 绑定的函数
    boundActionCreators[key] = bindActionCreator(ac, dispatch);
  }
  return boundActionCreators;
}

function bindActionCreator(actionCreator, dispatch) {
  return (...args) => {
    // 、派发action 也可以接收传入的参数
    return dispatch(actionCreator(...args));
  };
}

export { bindActionCreators };
