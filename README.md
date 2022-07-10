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

**counter2 reducer**

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

## react-redux

通过上面的学习，我们可以将状态都交给redux进行管理。而且也发现了，redux并不是一个依赖react的库。

但是我们在react中进行状态的变更，还需要手动订阅，手动派发action，还是有一点不那么方便的。

我们希望可以自动派发和订阅状态的变化等，就需要用到一个库：`react-redux`

对于我们使用者来说是很容易的：

类组件中我们可以这样使用：

```jsx
import { Provider, connect } from "react-redux";
import actionCreators2 from "./store/actionCreator/counter2";
class Counter2 extends Component {
  render() {
    console.log(this.props);
    return (
      <>
        <h2>counter: {this.props.counter}</h2>
        <button onClick={this.props.add2}>+1</button>
        <button onClick={() => this.props.addNum2(5)}>+5</button>
        <button onClick={this.props.minus2}>-1</button>
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
      <Counter2 />
    </Provider>
  );
};
```

这样：我们只需要在类组件中，直接使用派发方法即可，而不需要自己手动的派发。也不需要订阅状态等。

#### Provider

Provider其实就是一个context，用来提供store。

**ReactReduxContext：**

```js
import { createContext } from "react";

const ReactReduxContext = createContext();
export default ReactReduxContext;
```

**provider:**

```jsx
import ReactReduxContext from "./reactReduxContext";
/**
 * 提供store
 * @param {*} param0
 * @returns
 */
export default function Provider({ store, children }) {
  return (
    <ReactReduxContext.Provider value={{store}}>
      { children }
    </ReactReduxContext.Provider>
  );
}
```

**connect:**

connect其实就是一个高阶组件，也是一个高阶函数。函数本身接收两个参数，返回值仍然是一个高阶函数，参数是组件，

先来看类组件的实现：

本质上就是对原有组件的扩展，我们把订阅状态，以及派发事件都自己封装在内部，外界组件直接通过props获取状态和调用方法派发即可，逻辑的处理封装在内部。

```jsx
import { Component } from "react";
import ReactReduxContext from "./reactReduxContext";
import { bindActionCreators } from "../redux";
/**
 * 连接组件和仓库store
 * @param {*} mapStateToProps  state映射为props的函数
 * @param {*} mapDispatchToProps 派发的函数 映射为组件的props
 * @returns
 */
export default function connect(mapStateToProps, mapDispatchToProps) {
  return function (OldComponent) {
    return class extends Component {
      static contextType = ReactReduxContext;
      /**
       *
       * @param {*} props
       * @param {*} context 就是我们上下文Context
       */
      constructor(props, context) {
        super(props);
        // 拿到仓库
        const { store } = context;
        const { getState, subscribe, dispatch } = store;
        // 状态
        this.state = mapStateToProps(getState());
        this.unsubscribe = subscribe(() => {
          this.setState(mapStateToProps(getState()));
        });
        // 派发的函数
        this.dispatchProps = bindActionCreators(mapDispatchToProps, dispatch);
      }
      render() {
        return (
          <OldComponent
            {...this.props}
            {...this.state}
            {...this.dispatchProps}
          />
        );
      }
      componentWillUnmount() {
        // 取消订阅
        this.unsubscribe();
      }
    };
  };
}
```

### useSelect  useDispatch

**上面是类组件的connect的使用方式。**

现在前端越来越淡化类组件，大力推崇函数式组件。但是函数式组件的使用方法肯定是和类组件不相同的。我们肯定是需要借助`hooks`来实现我们想要的功能。

在函数式组件中需要使用两个hook，`useSelect 和 useDispatch`.

```jsx
import { useSelector, useDispatch } from "react-redux";
/**
 * 函数式组件使用react-redux
 */
const Counter = () => {
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
```

### 实现原理

**useDispatch**是很容易的，无非就是拿到dispatch方法:

```js
import { useContext } from "react";
import ReactReduxContext from "../reactReduxContext";

export const useDispatch = () => {
  const { store } = useContext(ReactReduxContext);
  return store.dispatch;
};
```

**useSelector方法会麻烦一些：**

我们根据传入的函数，然后将拿到的状态传递给参数`selector`，这个函数的返回值就是分状态：

```js
import { useContext } from "react";
import ReactReduxContext from "../reactReduxContext";

export const useSelector = (selector) => {
  const { store } = useContext(ReactReduxContext);
  const state = store.getState();
  const selectedState = selector(state);
  return selectedState;
};
```

如果此时我们在每次都打印store里的状态，发现此时每次在点击的时候，状态都会发生更改，但是组件并没有发生重新渲染，因为我们还没有监听状态的更新。

```js
import { useRef, useReducer, useLayoutEffect, useContext } from "react";
import ReactReduxContext from "../reactReduxContext";
/**
 * 获取状态并订阅状态的变更
 * @param {*} selector
 * @returns
 */
export const useSelector = (selector, equalityFn = shallowEqual) => {
  const prevSelectedState = useRef(null);
  const { store } = useContext(ReactReduxContext);
  const state = store.getState();
  const selectedState = selector(state);
  // 为了状态更新 可以重新渲染组件
  const [, forceUpdate] = useReducer((x) => x + 1, 0); // 只是为了更新组件 没特别含义
  useLayoutEffect(() => {
    // 监听状态的变化 执行回调
    return store.subscribe(() => {
      // 获取最新的分状态
      const selectedState = selector(store.getState());
      // 对比上次和最新的状态 状态不一致才会更新组件
      if (!equalityFn(prevSelectedState.current, selectedState)) {
        console.log(1);
        forceUpdate();
        prevSelectedState.current = selectedState;
      }
    });
  }, [store]); // 一个应用只有一个store 一般不会出现store的更改
  return selectedState;
};

/**
 * 两个对象 浅层比较
 * @param {*} obj1
 * @param {*} obj2
 * @returns
 */
export function shallowEqual(obj1, obj2) {
  if (obj1 === obj2) return true;
  // 基本类型
  if (
    typeof obj1 !== "object" ||
    obj1 === null ||
    typeof obj2 !== "object" ||
    obj2 === null
  )
    return false;
  // 都是对象 且属性都存在
  const k1 = Object.keys(obj1);
  const k2 = Object.keys(obj2);
  if (k1.length !== k2.length) return false;
  for (const k of k1) {
    // 没有该属性在对象自身上 或者属性值不同
    if (!obj2.hasOwnProperty(k) || obj1[k] !== obj2[k]) {
      return false;
    }
  }
  return true;
}
```

**此时就可以实现状态的改变使组件更新**：

但是在函数式组件内，派发action还是觉得有点麻烦，我们想像类组件一样更加方便一些，那么我们可以再封装一个hook，帮我们绑定`actionCreator`和`dispatch`，然后在函数式组件中就可以直接调用方法了。

#### useBoundDispatch

这个方法在`react-redux`中并没有提供该hook

```js
import { useContext } from "react";
import ReactReduxContext from "../reactReduxContext";
import { bindActionCreators } from "../../redux";
export const useBoundDispatch = (actionCreators) => {
  const { store } = useContext(ReactReduxContext);
  const boundActionCreators = bindActionCreators(
    actionCreators,
    store.dispatch
  );
  return boundActionCreators;
};
```

这样：在函数式组件中我们就可以这样使用：

```jsx
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
```

### connect的函数式实现

**前面我们实现了connect方法，但是使用的是类组件的形式。其实我们还可以使用函数式组件实现同样的功能**：

```jsx
export default function connect(mapStateToProps, mapDispatchToProps) {
  return function (OldComponent) {
    return (props) => {
      const { store } = useContext(ReactReduxContext);
      const { getState, subscribe, dispatch } = store;
      const prevState = getState();
      const stateToProps = useMemo(
        () => mapStateToProps(prevState),
        [prevState]
      );
      const dispatchProps = useMemo(() => {
        // 其实 mapDispatchToProps 是有多种写法的 7种 常见的有三种
        // 1. 对象 2. 函数 3. 什么都不传
        if (typeof mapDispatchToProps === "function") {
          return mapDispatchToProps(store.dispatch);
        } else if (
          mapDispatchToProps !== null &&
          typeof mapDispatchToProps === "object"
        ) {
          return bindActionCreators(mapDispatchToProps, dispatch);
        } else {
          return { dispatch }; // undefined
        }
      }, [store.dispatch]);
      // 订阅
      const [, forceUpdate] = useReducer((x) => x + 1, 0);
      useLayoutEffect(() => {
        return subscribe(forceUpdate);
      }, [subscribe]);
      return <OldComponent {...props} {...stateToProps} {...dispatchProps} />;
    };
  };
}
```

## redux 中间件

- 如果没有中间件，redux的工作流程是：`action  ->  reducer`。也就是所谓的同步操作。由dispatch触发action，直接去reducer执行相应的动作。
- 但是在某些比较复杂的业务逻辑中，这种同步的实现方式并不难很好的解决我们的问题。比如我们有一个需要异步获取数据的请求，就必须通过中间件才能实现。`redux -> action -> middleware -> reducer -> state`
- 中间件的机制可以放我们改变数据流，实现如异步action，action过滤，日志输出，异常报告等功能。

### 单个中间件

#### applyMiddleware

实现一个中间件，我们一般还需要一个方法：`applyMiddleware`

目前我们只考虑一个中间件的实现：

```js
/**
 * 应用中间件
 * @param {*} middleware 中间件
 */
export function applyMiddleware(middleware) {
  /**
   * @param createStore 创建store仓库
   */
  return function (createStore) {
    /**
     * @param reducer
     * @param preloadedState 初始状态
     */
    return function (reducer, preloadedState) {
      const store = createStore(reducer);
      const dispatch = middleware(store)(store.dispatch);
      return {
        ...store,
        dispatch,
      };
    };
  };
}
```

#### 实现一个日志中间件

```js
// 实现一个日志中间件 中间件的结构都是定死的
export function logger({ getState, dispatch }) {
  /**
   * @param next 调用下一个中间件 如果只有一个中间件 指向 store.dispatch
   */
  return function (next) {
    /**
     * 改造后的dispatch方法
     * @param action 动作
     */
    return function (action) {
      console.log("prev state :", getState());
      next(action);
      console.log("next state :", getState());
    };
  };
}
```

**此时，我们再创建仓库，就可以使用中间件应用进去了**：

```js
const store = applyMiddleware(logger)(createStore)(combineReducer);
```

**我们之所以让logger中间件，以及applyMiddleware等方法都是高阶函数，主要是为了实现函数的柯里化，方便传递参数，后续我们的中间件可能传入多个中间件参数。**

此时我们可以发现效果和之前的一致。而且多了日志记录的功能。

### compose

但是对于多个中间件的情况，我们此时还并没有处理。此时我们需要一个compose组合函数，来将多个中间件组合成一个中间件函数。

```js
export const compose = (...funcs) => {
  if (funcs.length === 0) {
    return (arg) => arg;
  }
  if (funcs.length === 1) {
    return funcs[0];
  }
  return funcs.reduce(
    (prev, curr) =>
      (...args) =>
        curr(prev(...args))
  );
};
```

**更新一下applyMiddleware方法，支持多个中间件：**

```js
export function applyMiddleware(...middleWares) {
  /**
   * @param createStore 创建store仓库
   */
  return function (createStore) {
    /**
     * @param reducer
     * @param preloadedState 初始状态
     */
    return function (reducer, preloadedState) {
      // 创建store
      const store = createStore(reducer);
      // 定义一个dispatch 是中间件处理过后的
      let dispatch;
      const middlewareAPI = {
        getState: store.getState,
        dispatch: (action) => dispatch(action),
      };
      // 拿到中间件的级联 执行一次中间件 将每个中间件的外层store用middlewareAPI去掉
      let chain = middleWares.map((middleWare) => middleWare(middlewareAPI));
      // 中间件组合 得到一个新的函数 然后执行 传入老的dispatch
      dispatch = compose(...chain)(store.dispatch);
      return {
        ...store,
        dispatch,
      };
    };
  };
}
```

**此时就支持了多个中间件的链式调用：**

```js
const store = applyMiddleware(logger2, logger)(createStore)(combineReducer);
```

redux的中间件和koa很类似，因为redux作者也说过就是受了koa的启发，才有了redux中间件原理。

### redux-thunk

`redux-thunk`中间件，可以让我们派发一个函数，其核心就是对action是函数的时候，执行这个函数。其原理类似于：

```js
// 实现一个 thunk中间件 支持派发一个函数
export function thunk({ dispatch, getState }) {
  return function (next) {
    return (action) => {
      // 派发的action是函数 执行该函数 传入dispatch和getState
      if (typeof action === "function") {
        // 也就是当前中间件后面的中间件使用的dispatch 都是前一个中间件处理过后的dispatch
        return action(dispatch, getState);
      } else {
        return next(action);
      }
    };
  };
}
```

### redux-promise

实现redux-promise中间件

```js
// 实现redux-promise中间件
export function promise({ dispatch, getState }) {
  return (next) => {
    return (action) => {
      // action是一个promise
      if (action.then && typeof action.then === "function") {
        action.then((action) => dispatch(action)).catch(dispatch);
      } else if (action.payload && typeof action.payload.then === "function") {
        action.payload
          .then((result) => dispatch({ ...action, payload: result }))
          .catch((error) => {
            debugger;
            console.log(error);
            dispatch({ ...action, payload: error, error: true });
            return Promise.reject(error);
          });
      } else {
        next(action);
      }
    };
  };
}
```

## redux-first-history 支持router6

这个库有两个核心功能：

1. 把路径的状态同步到仓库中，可以在仓库中获取当前最新的路径
2. 可以通过派发动作的方式跳转路径

### 如何使用

#### 1. 创建history对象

```js
import { createBrowserHistory } from "history";
import { createReduxHistoryContext } from "redux-first-history";
// 原生的history对象
const history = createBrowserHistory();

export const {
  // 合并reducers里面的router对应的reducer
  routerReducer,
  // 路由中间件
  routerMiddleware,
  // 创建redux历史对象
  createReduxHistory,
} = createReduxHistoryContext({ history });

```

#### 2. 合并routerReducer

```js
import { combineReducers } from "redux";
import { counter } from "./counter";
import { routerReducer } from "../../history";
const reducers = {
  counter,
  // 合并router
  router: routerReducer,
};
export default combineReducers(reducers);
```

#### 3. 创建 store

```js
import { createStore, applyMiddleware } from "redux";
import combineReducer from "./reducer";
import { createReduxHistory, routerMiddleware } from "../history";
// 应用中间件
export const store =
  applyMiddleware(routerMiddleware)(createStore)(combineReducer);

export const history = createReduxHistory(store);

```

#### 4. 在组件中使用

**app.jsx**：

```jsx
import { Route, Link, Routes } from "react-router-dom";
import { HistoryRouter } from "redux-first-history/rr6";
import { Provider } from "react-redux";
import { store, history } from "./store-connected";
import Home from "./Home";
import Counter from "./Counter";
const App = () => {
  return (
    <Provider store={store}>
      <HistoryRouter history={history}>
        <ul>
          <li>
            <Link to="/">Home</Link>
          </li>
          <li>
            <Link to="/counter">Counter</Link>
          </li>
        </ul>
        <Routes>
          <Route path="/" element={<Home />}></Route>
          <Route path="/counter" element={<Counter />}></Route>
        </Routes>
      </HistoryRouter>
    </Provider>
  );
};
export default App;

```

**Home.jsx**：

```jsx
import { useDispatch } from "react-redux";
import { push } from "redux-first-history";
export default () => {
  const dispatch = useDispatch()
  const gotoCounter = () => {
    dispatch(push("/counter"));
  };
  return (
    <>
      <div>Home</div>
      <button onClick={gotoCounter}>跳转counter</button>
    </>
  );
};

```

点击按钮就可以实现路由的跳转，且在store中，可以看见router对象，也就是当前的路由状态。

## redux-saga

- saga采用生成器函数来yield effects（也就是异步请求等，常说的副作用）
- 生成器函数可以暂停执行，再次执行的时候从上次暂停的地方继续执行
- effect是一个简单的对象，该对象包含了一些middleware解释执行的信息
- 可以通过使用effect API，如果fork，call，take，put，cancel等来创建effect

### saga的分类

1. worker saga：做左右的构造，如调用API，进行异步请求，获取异步封装结果
2. watcher saga：监听被dispatch的actions，当接收到action或者知道被其触发时，调用worker执行任务
3. root saga：立即启动saga的唯一入口

#### 生成器的使用

```js
function* gene() {
  yield 100;
  yield new Promise((resolve) => setTimeout(resolve, 1000, "你好"));
  yield "abc";
  return [];
}
/**
 *
 * @param {Generator} gen
 */
function co(gen) {
  const it = gen();
  function next() {
    const { done, value } = it.next();
    if (done && typeof value === "undefined") return;
    if (value && typeof value.then === "function") {
      value.then((res) => {
        console.log(res);
        next();
      });
    } else {
      console.log(value);
      next();
    }
  }
  next()
}

co(gene)
```

**saga**的原理其实就是这个的变形。
每次yield的值，就是我们需要派发的动作。
