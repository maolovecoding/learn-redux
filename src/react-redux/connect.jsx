import { Component, useContext } from "react";
import ReactReduxContext from "./reactReduxContext";
import { bindActionCreators } from "../redux";
import { useMemo } from "react";
import { useReducer } from "react";
import { useLayoutEffect } from "react";
/**
 * 连接组件和仓库store
 * @param {*} mapStateToProps  state映射为props的函数
 * @param {*} mapDispatchToProps 派发的函数 映射为组件的props
 * @returns
 */
export default function connect(mapStateToProps, mapDispatchToProps) {
  return function (OldComponent) {
    return (props) => {
      const { store } = useContext(ReactReduxContext);
      const { getState, subscribe, dispatch } = store;
      const prevState = getState();
      // 获取分状态
      const stateToProps = useMemo(
        () => mapStateToProps(prevState),
        [prevState]
      );
      // 派发的属性
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
      }, [subscribe]); // subscribe方法其实也不会改变
      return <OldComponent {...props} {...stateToProps} {...dispatchProps} />;
    };
  };
}

/**
 * 连接组件和仓库store
 * @param {*} mapStateToProps  state映射为props的函数
 * @param {*} mapDispatchToProps 派发的函数 映射为组件的props
 * @returns
 */
function connect2(mapStateToProps, mapDispatchToProps) {
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
