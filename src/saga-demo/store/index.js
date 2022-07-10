import { applyMiddleware, createStore } from "redux";
// 创建saga中间件
import createSagaMiddleware from "../../redux-saga";
import rootSaga from "./root-saga";
import reducer from "./reducer";
const sagaMiddleware = createSagaMiddleware();

const store = applyMiddleware(sagaMiddleware)(createStore)(reducer);
// 启动saga 参数当然就是一个生成器函数了
sagaMiddleware.run(rootSaga);
export default store;
