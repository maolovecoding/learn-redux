import { createRouterMiddleware } from "./middleware";
import { createRouterReducer } from "./reducer";
import { locationChangeAction, push, replace } from "./action";
/**
 * 创建redux历史记录的上下文
 * @param {*} param0
 */
export const createReduxHistoryContext = ({ history }) => {
  const routerReducer = createRouterReducer(history);
  const routerMiddleware = createRouterMiddleware(history);
  const createReduxHistory = (store) => {
    // 先派发一次默认值
    store.dispatch(locationChangeAction(history.location, history.action));
    history.listen(({ location, action }) => {
      // 路径发生更新 再次派发新状态
      store.dispatch(locationChangeAction(location, action));
    });
    return {
      ...history,
      get location() {
        return store.getState().router.location;
      },
      get action() {
        return store.getState().router.action;
      },
      push(...args) {
        store.dispatch(push(...args));
      },
      replace(...args) {
        store.dispatch(replace(...args));
      },
    };
  };
  return {
    routerReducer,
    routerMiddleware,
    createReduxHistory,
  };
};
