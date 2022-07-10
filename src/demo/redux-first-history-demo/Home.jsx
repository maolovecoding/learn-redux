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
