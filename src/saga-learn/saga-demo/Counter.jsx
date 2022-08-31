import { useDispatch, useSelector } from "react-redux";
import { ASYNC_ADD, STOP_ADD,ADD } from "./store/action-type";
export default () => {
  const counter = useSelector((state) => state.counter);
  const dispatch = useDispatch();
  return (
    <div>
      <h2>Counter: {counter}</h2>
      <button onClick={() => dispatch({ type: ADD })}>sync +1</button>
      <button onClick={() => dispatch({ type: ASYNC_ADD })}>async +1</button>
      <button onClick={() => dispatch({ type: STOP_ADD })}>stop</button>
      <br />
    </div>
  );
};
