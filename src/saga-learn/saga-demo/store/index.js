import { applyMiddleware, createStore } from "redux";
// 创建saga中间件
import createSagaMiddleware from "../../redux-saga";
import rootSaga from "./root-saga";
import reducer from "./reducer";
// sagaMiddleware 可以接收指令对象 根据指令的类型进行不同的处理
const sagaMiddleware = createSagaMiddleware();

const store = applyMiddleware(sagaMiddleware)(createStore)(reducer);
// 启动saga 参数当然就是一个生成器函数了
sagaMiddleware.run(rootSaga);
export default store;
window.store = store