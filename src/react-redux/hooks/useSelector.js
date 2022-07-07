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
