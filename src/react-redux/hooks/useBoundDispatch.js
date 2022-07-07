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
