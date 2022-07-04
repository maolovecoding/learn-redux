import { createStore } from "./redux";
import { Component } from "react";

const ADD = "add";
const MINUS = "minus";
/**
 * 纯函数
 * @param {*} state 老状态
 * @param {*} action 动作 必须有一个type属性
 */
function reducer(state = { counter: 0 }, action) {
  switch (action.type) {
    case ADD:
      return { counter: state.counter + 1 };
    case MINUS:
      return { counter: state.counter - 1 };
    default:
      return state;
  }
}
const store = createStore(reducer, { counter: 0 });

console.log(store);

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
      console.log(store.getState())
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

export default App;
