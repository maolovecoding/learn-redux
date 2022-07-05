import store, { ADD, MINUS } from "./store";
import { useEffect, useState, Component } from "react";
import { bindActionCreators } from "./redux";
import actionCreators from './store/actionCreator/counter'
class App extends Component {
  state = {
    // getState 获取store的状态
    counter: store.getState().counter,
  };
  componentDidMount() {
    // 订阅状态的变化
    store.subscribe(() => {
      // 状态更新 以后 执行该回调
      this.setState({
        counter: store.getState().counter,
      });
      console.log(store.getState());
    });
  }
  add = () => {
    store.dispatch({ type: ADD });
  };
  minus = () => {
    store.dispatch({ type: MINUS });
  };
  render() {
    return (
      <div>
        <h2>counter: {this.state.counter}</h2>
        <button onClick={this.add}>+1</button>
        <button onClick={this.minus}>-1</button>
      </div>
    );
  }
}

// actionCreators
// const add = () => ({ type: ADD });
// const minus = () => ({ type: MINUS });
// const actionCreators = { add, minus };
// 把一个action创建者对象和store.dispatch 方法进行绑定 返回一个对象
const boundActions = bindActionCreators(actionCreators, store.dispatch);
/**
 * 组件和仓库有两种关系：
 * 1. 输入 组件可以从仓库中读取状态数据进行渲染和显示
 * 2. 输出 可以在组件派发动作，修改仓库中的状态
 */
const Counter = () => {
  const [counter, setCounter] = useState(store.getState());
  useEffect(() => {
    const unsubscribe = store.subscribe(() => {
      setCounter(store.getState());
    });
    return unsubscribe;
  }, []);
  return (
    <div>
      <h2>counter: {counter.counter}</h2>
      <button onClick={boundActions.add}>+1</button>
      <button onClick={boundActions.minus}>-1</button>
    </div>
  );
};

export default Counter;
