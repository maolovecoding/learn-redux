import { useNavigate} from "react-router-dom";

export default () => {
  const gotoCounter = () => {
    useNavigate()("/counter");
  };
  return (
    <>
      <div>Home</div>
      <button onClick={gotoCounter}>跳转counter</button>
    </>
  );
};
