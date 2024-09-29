import "../../styles/start.css";
import Image from "next/image";
import { useDispatch } from "react-redux";
import { toHome } from "../../store/exampleSlice";

const Start = (page) => {
  const dispatch = useDispatch();
  function handleStart() {
    dispatch(toHome());
  }
  return (
    <div>
      <div style={{ textAlign: "center", marginTop: "20px" }}>
        <Image src="/logo.png" width={300} height={300} />
        <h1>cascade</h1>
        <p>train your CSS skills!</p>
      </div>
      <div className="container">
        <p>rules go here</p>
        <button
          style={{ position: "relative", fontWeight: "bold" }}
          className="startButton"
          onClick={handleStart}
        >
          Go!
        </button>
      </div>
    </div>
  );
};

export default Start;
