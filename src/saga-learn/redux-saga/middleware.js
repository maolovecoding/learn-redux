import { stdChannel } from "./channel";
import { runSaga } from "./runSaga";
export default function sageMiddlewareFactory() {
  const channel = stdChannel();
  let boundRunSaga; // 开始执行saga
  function sagaMiddleware({ getState, dispatch }) {
    boundRunSaga = runSaga.bind(null, { channel, dispatch, getState });
    return function (next) { 
      return function (action) {
        const res = next(action);
        channel.put(action);
        return res;
      };
    };
  }
  sagaMiddleware.run = (saga) => {
    boundRunSaga(saga);
  };
  return sagaMiddleware;
}
