import { CALL_HISTORY_METHOD } from "./action";
export const createRouterMiddleware = (history) => {
  return function (middlewareAPI) {
    return function (next) {
      return function (action) {
        // 不是历史对象的action 直接执行下一个中间件
        if (action.type !== CALL_HISTORY_METHOD) {
          return next(action);
        }
        // 调用历史对象的方法
        const { method, args } = action.payload;
        switch (method) {
          case "push":
            history.push(...args);
            break;
          case "replace":
            history.replace(...args);
            break;
          default:
            break;
        }
      };
    };
  };
};
