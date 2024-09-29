import React, { useState, useEffect, useCallback } from "react";
import styles from "../../styles/home.module.css";
import CodeMirror from "@uiw/react-codemirror";
import { loadLanguage } from "@uiw/codemirror-extensions-langs";
import { tokyoNight } from "@uiw/codemirror-theme-tokyo-night";
import { EyeDropper } from "react-eyedrop";
import DOMPurify from "dompurify";
import { useDispatch } from "react-redux";
import { toEnd } from "../../store/exampleSlice";
import Timer from "./Timer";

const BACKEND = "http://127.0.0.1:5000";

const Home = () => {
  const [loading, setLoading] = useState(false);
  const [css, setCss] = useState(`
    body {
    background: white
    }
            div {
              height: 100px;
              width: 100px;
              background: #00274C;
              color: #FFCB05
            }`);
  const [html, _] = useState("<div>hello</div>");
  const dispatch = useDispatch();

  function handleTimerExpire() {
    dispatch(toEnd());
  }

  function generatePreviewHtml() {
    return `<html><style>body { margin: 0; height: 300px; width: 300px; } ${css}</style>${DOMPurify.sanitize(
      html
    )}</html>`;
  }

  const [sessionId, setSessionId] = useState();
  const [puzzleNum, setPuzzleNum] = useState(0);
  const [puzzlePoints, setPuzzlePoints] = useState();
  const [sessionScore, setSessionScore] = useState(0);
  const [attemptNum, setAttemptNum] = useState(0);

  useEffect(() => {handleStart();}, []);

  async function handleStart() {
    if (loading) {
      return;
    }
    setLoading(true);
    setPuzzleNum(0);
    const res = await fetch(`${BACKEND}/start_session`, { method: "POST" });
    const newSessionId = await res.text();
    console.log("newSessionId", newSessionId);
    setSessionId(newSessionId);
    setLoading(false);
  }

  async function updatePuzzlePoints() {
    const res = await fetch(
      `${BACKEND}/${sessionId}/target/${puzzleNum}/points`
    );
    const t = await res.text();
    setPuzzlePoints(t);
  }

  useEffect(() => {
    if (sessionId) {
      updatePuzzlePoints();
    }
  }, [puzzleNum, sessionId]);

  async function handleSubmit() {
    const res = await fetch(`${BACKEND}/${sessionId}/submit`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json", // Set appropriate content type
      },
      body: JSON.stringify({
        puzzle_id: "test",
        html: generatePreviewHtml(),
      }),
    });
    const resJson = await res.json();
    if (resJson.status === "ok") {
      setPuzzleNum((oldPuzzleNum) => oldPuzzleNum + 1);
      setSessionScore(resJson.score);
    } else {
      setAttemptNum((oldAttemptNum) => oldAttemptNum + 1);
    }
  }

  // for skip button
  const [isDisabled, setIsDisabled] = useState(true);
  const [timerKey, setTimerKey] = useState(0);
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsDisabled(false);
    }, 5000); // in ms
    return () => clearTimeout(timer);
  }, [timerKey]);

  const handleCssEditorChange = useCallback((val, viewUpdate) => {
    setCss(val);
  });

  async function handleSkip() {
    const res = await fetch(`${BACKEND}/${sessionId}/skip`, {
      method: "POST",
    });
    if (res.ok) {
      setPuzzleNum((oldPuzzleNum) => oldPuzzleNum + 1);
    }
  }

  function handleEnd() {
    dispatch(toEnd());
  }

  const [pickedColor, setPickedColor] = useState({ rgb: "", hex: "" });
  const [eyedropOnce] = useState(true); // only 1 use of the eyedropper per button press
  const handleChangeColor = ({ rgb, hex }) => {
    setPickedColor({ rgb, hex });
    navigator.clipboard.writeText(hex);
  };

  return (
    <div className={styles.container}>
      <div style={{ marginLeft: "auto" }}>
        <div className={styles.colorContainer}>
          <EyeDropper
            onChange={handleChangeColor}
            cursorActive="crosshair"
            className={styles.eyedropperButton}
          >
            pick color
          </EyeDropper>
          <div style={{ display: "flex", gap: "1rem", width: "100%" }}>
            <div
              className={styles.colorDrop}
              style={{ backgroundColor: pickedColor.hex }}
            />
            <div>
              <p>{pickedColor.rgb}</p>
              <p>{pickedColor.hex}</p>
            </div>
          </div>
        </div>
        <div className={styles.previewContainer}>
          <img
            src={`${BACKEND}/${sessionId}/target/${puzzleNum}`}
            // src="https://corsproxy.io/?https://placewaifu.com/image/300"
            alt="target"
            className={styles.targetImage}
          />
          <iframe
            className={styles.preview}
            srcDoc={generatePreviewHtml()}
          ></iframe>{" "}
        </div>
      </div>

      <div className={styles.editorContainer}>
        <div className={styles.buttonContainer}>
          <div style={{ display: "flex", gap: "1rem", alignItems: "center" }}>
            <Timer onExpire={handleTimerExpire} length={3 * 60 * 1000} />
            {sessionScore ? <div>{sessionScore} points this run</div> : <></>}
          </div>
          <div>
            <b>
              puzzle {puzzleNum}
              {puzzlePoints ? ` (${puzzlePoints} pts) ` : ""}
            </b>
            , attempt {attemptNum}
          </div>
        </div>
        <CodeMirror
          className={styles.htmlEditor}
          value={html}
          theme={tokyoNight}
          maxHeight="200px"
          extensions={[loadLanguage("html")]}
          editable={false}
        />
        <div className={styles.cssEditor}>
          <CodeMirror
            value={css}
            height="30rem"
            theme={tokyoNight}
            extensions={[loadLanguage("css")]}
            onChange={handleCssEditorChange}
          />
        </div>
        <div className={styles.buttonContainer}>
          <button
            onClick={handleStart}
            className={styles.gameButton}
            disabled={loading}
          >
            Start
          </button>
          <div className={styles.buttonGroup}>
            <button
              className={`${styles.gameButton} ${styles.gameButtonDanger}`}
              onClick={handleEnd}
            >
              {"End game"}
            </button>
            <button
              className={styles.gameButton}
              disabled={isDisabled}
              onClick={handleSkip}
            >
              {isDisabled ? "Wait..." : "Skip"}
            </button>
          </div>
          <button
            className={`${styles.gameButton} ${styles.gameButtonPrimary}`}
            onClick={handleSubmit}
          >
            Submit
          </button>
        </div>
      </div>
    </div>
  );
};

export default Home;
