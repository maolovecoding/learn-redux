/**
 * 函数
 * @param {*} f
 * @returns
 */
export const func = (f) => typeof f === "function";
/**
 * 是迭代器
 * @param {*} it
 * @returns
 */
export const iterator = (it) => it && func(it.next) && func(it.throw);

export const promise = (p) => p && func(p.then);
