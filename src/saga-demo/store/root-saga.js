import { put, take } from "../../redux-saga/effects";
import { ADD, ASYNC_ADD } from "./action-type";

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
/**
 * rootSaga 是saga的启动生成器
 */
export default function* () {
  console.log("saga running!~~~");
  yield watcherSaga(); // 产生迭代器
}
/**
 * 监听saga 监听动作类型
 * 该迭代器负责异步action等的执行
 */
function* watcherSaga() {
  // 监听saga 也就是监听异步动作 ASYNC_ADD
  // take 只监听一次 类似于我们eventEmitter 中的once
  const action = yield take(ASYNC_ADD);
  console.log("action: ->", action);
  // 如果有人向仓库派发 监听到会继续执行
  yield workerSaga(); // 生成迭代器
}
/**
 * 工作saga
 * 执行的是同步action
 */
function* workerSaga() {
  // 如果产出的是promise 等待promise执行完毕后 去继续执行
  yield delay(1000);
  // 产出一个action
  yield put({ type: ADD });
}
