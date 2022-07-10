import runSaga from "./runSaga";
import EventEmitter from "./events";
/**
 * 创建saga中间件
 */
function createSagaMiddleware() {
  const channel = new EventEmitter();
  let boundRunSaga;
  // saga中间件
  function sagaMiddleware({ getState, dispatch }) {
    // 提前绑定好参数
    boundRunSaga = runSaga.bind(null, { getState, dispatch, channel });
    return function (next) {
      return function (action) {
        const res = next(action);
        // 触发一个事件 事件名称就是动作类型 参数就是动作对象
        channel.emit(action.type, action);
        return res;
      };
    };
  }
  // run方法 接收一个生成器
  sagaMiddleware.run = (saga, ...args) => boundRunSaga(saga);
  return sagaMiddleware;
}

export default createSagaMiddleware;
