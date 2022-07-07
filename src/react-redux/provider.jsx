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
