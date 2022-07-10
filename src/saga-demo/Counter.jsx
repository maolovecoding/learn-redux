import { useDispatch, useSelector, useStore } from "react-redux";
import { ASYNC_ADD, STOP_ADD } from "./store/action-type";
export default () => {
  const counter = useSelector((state) => state.counter);
  const dispatch = useDispatch();
  return (
    <div>
      <h2>Counter: {counter}</h2>
      <button onClick={() => dispatch({ type: ASYNC_ADD })}>+1</button>
      <button onClick={() => dispatch({ type: STOP_ADD })}>stop</button>
      <br />
    </div>
  );
};
