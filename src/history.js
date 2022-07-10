import { createBrowserHistory } from "history";
import { createReduxHistoryContext } from "./redux-first-history";
// 原生的history对象
const history = createBrowserHistory();

export const {
  // 合并reducers里面的router对应的reducer
  routerReducer,
  // 路由中间件
  routerMiddleware,
  // 创建redux历史对象
  createReduxHistory,
} = createReduxHistoryContext({ history });
