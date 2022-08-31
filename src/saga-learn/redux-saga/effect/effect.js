import { TAKE, PUT } from "./effectType";
const makeEffect = (type, payload) => {
  return { type, payload };
};
/**
 *
 * @param {*} pattern 动作类型
 * @returns
 */
export function take(pattern) {
  // {type:'TAKE', payload:{pattern:ASYNC_ADD}}
  return makeEffect(TAKE, { pattern });
}

export function put(action) {
  // {type:'PUT', payload:{action:{type:'ADD'}}}
  return makeEffect(PUT, { action });
}