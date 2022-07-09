import store from "./store";
import {
  Provider,
  connect,
  useSelector,
  useDispatch,
  useBoundDispatch,
} from "./react-redux";
import { bindActionCreators } from "./redux";
import actionCreators from "./store/actionCreator/counter";
import actionCreators2 from "./store/actionCreator/counter2";
import { Component } from "react";

/**
 * 函数式组件使用react-redux
 */
const CounterBak = () => {
  // 总状态中取出我们要使用的分状态
  const state = useSelector((state) => state.counter1);
  const dispatch = useDispatch();
  return (
    <div>
      <h2>counter: {state.counter}</h2>
      <button onClick={() => dispatch(actionCreators.add())}>+1</button>
      <button onClick={() => dispatch(actionCreators.addNum(5))}>+5</button>
      <button onClick={() => dispatch(actionCreators.minus())}>-1</button>
    </div>
  );
};

const Counter = () => {
  // 总状态中取出我们要使用的分状态
  const state = useSelector((state) => state.counter1);
  // const dispatch = useDispatch();
  const boundActionCreator = useBoundDispatch(actionCreators);
  return (
    <div>
      <h2>counter: {state.counter}</h2>
      <button onClick={boundActionCreator.add}>+1</button>
      <button onClick={() => boundActionCreator.addNum(5)}>+5</button>
      <button onClick={boundActionCreator.minus}>-1</button>
    </div>
  );
};
/**
 * 类组件使用react-redux
 */
class Counter2 extends Component {
  render() {
    return (
      <>
        <h2>counter: {this.props.counter}</h2>
        <button onClick={this.props.add2}>+1</button>
        <button onClick={() => this.props.addNum2(5)}>+5</button>
        <button onClick={this.props.minus2}>-1</button>
        <button onClick={this.props.thunkAdd}>+2</button>
        <button onClick={this.props.promise1Add}>+3</button>
        <button onClick={this.props.promise2Add}>+4</button>
      </>
    );
  }
}
// 将state映射为组件的props -> {counter:0, add2, addNum2, ...} 返回的值会被展开一层
const mapStateToProps = (state) => state.counter2;
// 连接仓库和组件
Counter2 = connect(mapStateToProps, actionCreators2)(Counter2);

const App = () => {
  return (
    // 提供仓库
    <Provider store={store}>
      <Counter />
      <hr />
      <Counter2 />
    </Provider>
  );
};

export default App;
