import { useContext } from "react";
import ReactReduxContext from "../reactReduxContext";

export const useDispatch = () => {
  const { store } = useContext(ReactReduxContext);
  return store.dispatch;
};
