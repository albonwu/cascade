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
        <Image src="/logo.png" width={300} height={300} alt="logo" />
        <h1 style={{ fontWeight: "800" }}>cascade</h1>
        <p>train your CSS skills!</p>
      </div>
      <div className="container">
        <p style={{ width: "600px", marginBottom: "20px" }}>
          A new way to practice and test your CSS skills while having fun! The
          objective is to recreate as many of the images as you can in the given
          time. If you're stuck, you can use the skip button after spending at
          least 5 seconds on it to move on to the next.
        </p>
        <p>Can you rise to the challenge?</p>
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
