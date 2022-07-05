# learn redux

## redux应用场景

- 随着JavaScript单页应用开发日趋复杂,管理不断变化的state 非常困难
- Redux的出现就是为了解决state里的数据问题
- 在React中，数据在组件中是单向流动的
- 数据从一个方向父组件流向子组件(通过props)，由于这个特征，两个非父子关系的组件(或者称作兄弟组件)之间的通信就比较麻烦



## redux设计思想

- Redux是将整个应用状态存储到到一个地方，称为store
- 里面保存一棵状态树state tree

- 组件可以派发dispatch行为action给store,而不是直接通知其它组件
- 其它组件可以通过订阅store中的状态(state)来刷新自己的视图



### createStore

使用`createStore`方法可以创建一个store，该函数的参数是reducer和initialState。

常见的三个方法：

- dispatch
- subscribe
- getState

我们就以计数器案例来学习`createStore`

#### 计数器案例

```jsx
import { createStore } from "redux";
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

```

#### createStore的实现原理

首先：我们需要创建一个createStore函数，接收两个参数：纯函数参数`reducer`以及初始化状态`initialState`

```js
/**
 * 创建一个 store
 * @param {*} reducer 纯函数 计算新状态的处理器
 * @param {*} initialState 初始状态
 */
function createStore(reducer, initialState) {
    // 在仓库内部定义一个初始的状态
    let state = initialState;
}
```

接下来我们需要定义三个函数：也就是上面我们说的，常用的三个函数。

```js
function createStore(reducer, initialState) {
  // 在仓库内部定义一个初始的状态
  let state = initialState;
  /**
   * 获取当前仓库最新的状态
   */
  function getState() {
    return state;
  }
  /**
   * 订阅状态的更新
   * @param {*} listener 状态更新后执行的监听函数
   * @returns 返回一个可以取消监听函数的方法
   */
  function subscribe(listener) {
  }
  /**
   * 派发 更新状态
   * @param {*} action 动作
   */
  function dispatch(action) {
  }
  return {
    getState,
    dispatch,
    subscribe,
  };
}
```

getState函数就是返回当前最新的状态，没什么好说的。

`dispatch`派发一个动作来更新当前的state：

```js
  function dispatch(action) {
    state = reducer(state, action);
  }
```

`subscribe`的参数是一个监听函数，在state的值更新以后调用。所以我们需要一个数组来记录保存的listener，然后该函数的返回值是一个取消该监听函数的一个函数。

```js
  // 监听函数
  let listeners = [];
  function subscribe(listener) {
    listeners.push(listener);
    // 返回一个可以取消监听函数的方法
    return () => {
      listeners = listeners.filter((l) => l !== listener);
    };
  }
```

在状态更新以后，我们执行监听函数。

```js
  function dispatch(action) {
    state = reducer(state, action);
    // 执行监听函数
    listeners.forEach((listener) => listener());
  }
```

此时我们可以把redux换成自己写的这个createStore，发现可以达到一样的效果。

```jsx
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
      <button onClick={() => store.dispatch({ type: ADD })}>+1</button>
      <button onClick={() => store.dispatch({ type: MINUS })}>-1</button>
    </div>
  );
};
```

**当然，这样写可能我们还是觉得没有那么优雅，如果派发action的时候，只需要给点击按钮一个函数，就自动帮我们派发，不需要额外的动作就更好了。**

#### bindActionCreators

实现自动派发，我们可以使用redux提供的bindActionCreators方法。该方法的参数是`actionCreator`和`dispatch`方法。

```js
const add = () => ({ type: ADD });
const minus = () => ({ type: MINUS });
const actionCreators = { add, minus };
// 把一个action创建者对象和store.dispatch 方法进行绑定 返回一个对象
const boundActions = bindActionCreators(actionCreators, store.dispatch);
// ....
      <button onClick={boundActions.add}>+1</button>
      <button onClick={boundActions.minus}>-1</button>
```

这样就可以实现自动派发action了。

**那么：bindActionCreators是如何实现的？**

其实就是对派发的函数进行一次封装，`actionCreator`就是对action的封装，该对象的每个函数的执行结果都是一个action对象，然后把该对象传递给`dispatch`方法即可.

```js
/**
 * 绑定actionCreator和dispatch 实现自动派发
 * @param {*} actionCreator
 * @param {*} dispatch
 */
function bindActionCreators(actionCreator, dispatch) {
  // 绑定的自动派发对象
  const boundActionCreators = {};
  for (const key in actionCreator) {
    const ac = actionCreator[key];
    // 绑定的函数
    boundActionCreators[key] = bindActionCreator(ac, dispatch);
  }
  return boundActionCreators;
}

function bindActionCreator(actionCreator, dispatch) {
  return (...args) => {
    // 、派发action 也可以接收传入的参数
    return dispatch(actionCreator(...args));
  };
}
```



### combineReducers

React应用不管多大，只能有一个仓库，只能有一个reducer，reducer只能维护一个状态。那就可能导致我们一个reducer里面有上百个`switch case`，维护起来很难受。

因此：我们可以考虑把`reducer`拆分，一个唯一的reducer，由很多个小的reducer组合而成。也就分模块。

**action-type**

```js
export const ADD = "add";
export const ADDNUM = "addNum";
export const MINUS = "minus";

export const ADD2 = "add2";
export const ADDNUM2 = "addNum2";
export const MINUS2 = "minus2";
```

**counter1 reducer**:

```js
import { ADD, MINUS, ADDNUM } from "../action-type";
/**
 * 纯函数
 * @param {*} state 老状态
 * @param {*} action 动作 必须有一个type属性
 */
function reducer(state = { counter: 0 }, action) {
  switch (action.type) {
    case ADD:
      return { counter: state.counter + 1 };
    case ADDNUM:
      return { counter: state.counter + action.num };
    case MINUS:
      return { counter: state.counter - 1 };
    default:
      return state;
  }
}

export default reducer;

```

**counter2 reducer **

```js
import { ADD2, MINUS2, ADDNUM2 } from "../action-type";
function reducer(state = { counter: 0 }, action) {
  switch (action.type) {
    case ADD2:
      return { counter: state.counter + 1 };
    case ADDNUM2:
      return { counter: state.counter + action.num };
    case MINUS2:
      return { counter: state.counter - 1 };
    default:
      return state;
  }
}

export default reducer;

```

**合并reducer**:借助redux提供的 combineReducers方法

```js
import counter1 from "./counter1";
import counter2 from "./counter2";
import { combineReducers } from "redux";

// 合并多个reducer
const reducers = { counter1, counter2 };
const combineReducer = combineReducers(reducers);

export default combineReducer;
```

```js
import { createStore } from "../redux";
import combineReducer from "./reducers";
const store = createStore(combineReducer);
export default store;
export * from "./action-type";

```

**actionCreators**:

```js
import { ADD, MINUS, ADDNUM } from "../action-type";
// actionCreators
const add = () => ({ type: ADD });
const addNum = (num) => ({ type: ADDNUM, num });
const minus = () => ({ type: MINUS });
const actionCreators = { add, addNum, minus };
export default actionCreators;
```

```js
import { ADD2, MINUS2, ADDNUM2 } from "../action-type";
// actionCreators
const add2 = () => ({ type: ADD2 });
const addNum2 = (num) => ({ type: ADDNUM2, num });
const minus2 = () => ({ type: MINUS2 });
const actionCreators2 = { add2, addNum2, minus2 };
export default actionCreators2;
```

**两个计数器之间互不干扰：**

```jsx
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
```



#### combineReducers的原理

该方法是组合多个reducer为一个reducer。参数是一个多个reducer集合的对象，且对多个reducer之前分模块，状态也分成的多个模块，其模块名就是reducer集合对象的key。

```js
/**
 * 合并多个reducer
 * @param {{[key:string]:Function}} reducers {counter1: reducer1 }
 */
export function combineReducers(reducers) {
  // 返回一个全局唯一的reducer函数  state是每次传入的上次的state
  return function (state = {}, action) {
    let nextState = {};
    for (const key in reducers) {
      const reducer = reducers[key];
      // 老状态
      const lastStateForKey = state[key];
      // 计算新状态
      nextState[key] = reducer(lastStateForKey, action);
    }
    return nextState;
  };
}
```





