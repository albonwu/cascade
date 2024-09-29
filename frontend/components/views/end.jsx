import "../../styles/end.css";
import { useState, useEffect } from "react";
import Image from "next/image";
import { toStart } from "../../store/exampleSlice";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";

const BACKEND = "http://127.0.0.1:5000";

function End() {
  const [isOpen, setIsOpen] = useState(false);
  const [score, setScore] = useState();
  const dispatch = useDispatch();
  const sessionId = useSelector((state) => state.example.sessionId);

  // dropdown data
  const [skippedNames, setSkippedNames] = useState([]);
  const [skippedCode, setSkippedCode] = useState([]);

  async function fetchData() {
    try {
      const response = await fetch(`${BACKEND}/${sessionId.payload}/skipped`);
      if (!response.ok) {
      }
      const data = await response.json(); // Assume the backend sends JSON
      setSkippedNames(data); // Step 3: Update state with fetched data
    } catch (error) {
      console.error("Fetch error:", error);
    }

    const skippedCode = [];
    for (const skippedName of data) {
      const codeRes = await fetch(`${BACKEND}/solution/${skippedName}`);
      const code = await codeRes.text();
      skippedCode.append(code);
    }
    console.log("skippedCode", skippedCode);

    setSkippedCode(skippedCode);

    const scoreResponse = await fetch(`${BACKEND}/${sessionId.payload}/score`);
    const endScore = await scoreResponse.text();
    setScore(endScore);
  }

  useEffect(() => {
    if (sessionId) {
      fetchData();
    }
  }, [sessionId]);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  function handleReturn() {
    dispatch(toStart());
  }

  return (
    <div>
      <div style={{ textAlign: "center", marginTop: "20px" }}>
        <Image src="/logo.png" width={300} height={300} />
        <h1>your score was {score}</h1>
      </div>
      <div style={{ textAlign: "center", marginBottom: "20px" }}>
        <span
          style={{
            cursor: "pointer",
            display: "inline-flex",
            alignItems: "center",
          }}
          onClick={toggleDropdown}
        >
          review what you missed?
          <span
            style={{
              marginLeft: "8px",
              transform: isOpen ? "rotate(180deg)" : "rotate(0deg)",
              transition: "transform 0.2s",
            }}
          >
            ▼
          </span>
        </span>

        {/* Content that gets toggled */}
        {isOpen && (
          <div style={{ marginTop: "8px" }} className="dropdown">
            {skippedNames.map((name, index) => (
              // `${BACKEND}/image/${sessionId}`
              // `${BACKEND}/solution/${sessionId}`
              <div key={name}>
                <img
                  src={`${BACKEND}/image/${name}`}
                  alt={`image of problem ${name}`}
                />
                <pre>{skippedCode[index]}</pre>
              </div>
            ))}
          </div>
        )}
      </div>
      <div style={{ textAlign: "center" }}>
        <button
          style={{ position: "relative", fontWeight: "bold", color: "FDFAE0" }}
          className="returnButton"
          onClick={handleReturn}
        >
          Home
        </button>
      </div>
    </div>
  );
}

export default End;
