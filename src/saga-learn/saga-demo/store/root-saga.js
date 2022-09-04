import {
  put,
  take,
  fork,
  takeEvery,
  call,
  cps,
  all,
  cancel,
  delay as sagaDelay,
} from "../../redux-saga/effect";
// 什么是effects，就是指令对象
import { ADD, ASYNC_ADD, STOP_ADD } from "./action-type";

// 异步方案 promise
const delay2 = (ms) =>
  new Promise((resolve) => setTimeout(resolve, ms, `${ms}ms resolve ok!`));
// 异步方案2 使用回调函数
const delay = (ms, done) =>
  setTimeout(() => {
    // 错误优先
    done(null, "delay is ok");
  }, ms);

function* add1() {
  // yield take(ASYNC_ADD);
  // const res = yield delay2(1000);// 遇到promise 等待promise完成
  // const res = yield call(delay2, 1000); // 等待该函数返回的promise状态发生改变
  const res = yield cps(delay, 1000); // 等待该函数返回的promise状态发生改变
  console.log(res);
  yield put({ type: ADD });
  console.log("add 1 done !");
  return "add 1 result";
}

function* add2() {
  for (let i = 0; i < 2; i++) {
    yield take(ASYNC_ADD);
    yield put({ type: ADD });
  }
  console.log("add 2 done ! ~~~");
  return "add 2 result";
}
function* add() {
  while (true) {
    yield sagaDelay(1000);
    yield put({ type: ADD });
  }
}
function* addWatcher() {
  // 开启子进程执行
  const task = yield fork(add);
  yield take(STOP_ADD); // 派发该action以后 在下面可以取消task
  yield cancel(task); // 取消任务
}

function* add3() {
  for (let i = 0; i < 3; i++) {
    yield take(ASYNC_ADD);
    yield put({ type: ADD });
  }
  return "3 ok";
}
function* add4() {
  for (let i = 0; i < 3; i++) {
    yield take(ASYNC_ADD);
    yield put({ type: ADD });
  }
  return "4 ok";
}
function* add5() {
  while (1) {
    yield sagaDelay(1000);
    yield put({ type: ADD });
  }
}
function* addWatcher2() {
  const task = yield fork(add5);
  yield take(STOP_ADD);
  // 取消任务
  yield cancel(task);
  return  'watcher done'
}
/**
 * rootSaga 是saga的启动生成器
 */
export default function* () {
  console.log("saga running!~~~");
  // const action = yield take(ASYNC_ADD);
  // console.log(action)
  // // yield put({type:ADD});
  // yield add1()
  // yield takeEvery(ASYNC_ADD, add1);
  // const res = yield all([add3(), add4()]);
  const res = yield addWatcher2();
  // 两个迭代器执行完来到这里
  console.log(res, "res all");
  console.log("root done");
  // yield watcherSaga(); // 产生迭代器
  // 使用all
  // const res = yield all([add1(), add2()]);
  // console.log("all add is done ~~~", res);
  // 支持取消任务
  // yield addWatcher();
}
/**
 * 监听saga 监听动作类型
 * 该迭代器负责异步action等的执行
 */
function* watcherSaga() {
  // 监听saga 也就是监听异步动作 ASYNC_ADD
  // take 只监听一次 类似于我们eventEmitter 中的once
  // const action = yield take(ASYNC_ADD);
  // console.log("action: ->", action);
  // 如果有人向仓库派发 监听到会继续执行
  // yield workerSaga(); // 生成迭代器
  // 子进程执行新的saga
  // yield fork(workerSaga);
  // 开启一个新的子进程 {type:FORK, saga}
  yield takeEvery(ASYNC_ADD, workerSaga);
}
/**
 * 工作saga
 * 执行的是同步action
 */
function* workerSaga(action) {
  console.log(action); // 可以拿到派发的action
  // 如果产出的是promise 等待promise执行完毕后 去继续执行
  // yield delay(1000);
  // yield call(delay2, 1000);
  const res = yield cps(delay, 1000);
  console.log(res);
  // 产出一个action
  yield put({ type: ADD });
}
