import store from "./store";
import { useEffect, useState } from "react";
import { bindActionCreators } from "./redux";
import actionCreators from "./store/actionCreator/counter";
import actionCreators2 from "./store/actionCreator/counter2";

// 把一个action创建者对象和store.dispatch 方法进行绑定 返回一个对象
const boundActions = bindActionCreators(actionCreators, store.dispatch);
/**
 * 组件和仓库有两种关系：
 * 1. 输入 组件可以从仓库中读取状态数据进行渲染和显示
 * 2. 输出 可以在组件派发动作，修改仓库中的状态
 */
const Counter = () => {
  const [counter, setCounter] = useState(store.getState().counter1);
  useEffect(() => {
    const unsubscribe = store.subscribe(() => {
      setCounter(store.getState().counter1);
    });
    return unsubscribe;
  }, []);
  return (
    <div>
      <h2>counter: {counter.counter}</h2>
      <button onClick={boundActions.add}>+1</button>
      <button onClick={() => boundActions.addNum(5)}>+5</button>
      <button onClick={boundActions.minus}>-1</button>
    </div>
  );
};
const boundActions2 = bindActionCreators(actionCreators2, store.dispatch);
const Counter2 = () => {
  const [counter, setCounter] = useState(store.getState().counter2);
  useEffect(() => {
    const unsubscribe = store.subscribe(() => {
      setCounter(store.getState().counter2);
    });
    return unsubscribe;
  }, []);
  return (
    <div>
      <h2>counter: {counter.counter}</h2>
      <button onClick={boundActions2.add2}>+1</button>
      <button onClick={() => boundActions2.addNum2(5)}>+5</button>
      <button onClick={boundActions2.minus2}>-1</button>
    </div>
  );
};

const App = () => {
  return (
    <>
      <Counter />
      <hr />
      <Counter2 />
    </>
  );
};

export default App;
