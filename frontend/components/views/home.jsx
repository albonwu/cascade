import React, { useState, useEffect, useCallback } from "react";
import styles from "../../styles/home.module.css";
import CodeMirror from "@uiw/react-codemirror";
import { loadLanguage } from "@uiw/codemirror-extensions-langs";
import { tokyoNight } from "@uiw/codemirror-theme-tokyo-night";
import { EyeDropper } from "react-eyedrop";
import DOMPurify from "dompurify";
import { useDispatch } from "react-redux";
import { toStart } from "../../store/exampleSlice";

const BACKEND = "http://127.0.0.1:5000";

const Home = () => {
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

  function generatePreviewHtml() {
    return `<html><style>body { margin: 0; height: 300px; width: 300px; } ${css}</style>${DOMPurify.sanitize(
      html
    )}</html>`;
  }

  const [sessionId, setSessionId] = useState();

  async function handleStart() {
    const res = await fetch(`${BACKEND}/start_session`, { method: "POST" });
    const newSessionId = await res.text();
    console.log("newSessionId", newSessionId);
    setSessionId(newSessionId);
  }

  async function handleSubmit() {
    const res = await fetch(`${BACKEND}/submit`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json", // Set appropriate content type
      },
      body: JSON.stringify({
        puzzle_id: "test",
        html: generatePreviewHtml(),
      }),
    });
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

  const handleSkip = () => {
    // tried to make the 5s cooldown reset....
    // setIsDisabled(true); 
    // setTimerKey((prev) => prev + 1);
  };

  function handleEnd() {

  }

  const [pickedColor, setPickedColor] = useState({ rgb: "", hex: "" });
  const [eyedropOnce] = useState(true); // only 1 use of the eyedropper per button press
  const handleChangeColor = ({ rgb, hex }) => {
    setPickedColor({ rgb, hex });
    navigator.clipboard.writeText(hex);
  };

  return (
    <div className={styles.container}>
      <div>
        <div className="eyedrop-wrapper">
          <EyeDropper className={styles.customEyedropper} once={eyedropOnce} onChange={handleChangeColor}>
            Eyedropper
          </EyeDropper>
          <div
            style={{ backgroundColor: pickedColor.rgb }}
            className="eyedrop-color"
          />
          <p style={{ display: "inline-block", position: "relative" }}>
            Color:
            <span
              style={{
                display: "inline-block",
                backgroundColor: pickedColor.rgb,
                width: "100px",
                height: "1em",
                verticalAlign: "middle",
                marginLeft: "8px",
              }}
            ></span>
          </p>
          <p>RGB: {pickedColor.rgb}</p>
          <p>Hex: {pickedColor.hex}</p>
        </div>
        <div className={styles.previewContainer}>
          <img
            src={`${BACKEND}/${sessionId}/target`}
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
        <div style={{ display: 'flex', marginRight: "20px", justifyContent: 'space-between' }}>
          <button className={styles.gameButton} 
          style={{ width: "100px", backgroundColor:"#FDFAE0"}}
          disabled={isDisabled} onClick={() => {handleSkip}}>
            {isDisabled ? 'Wait...' : 'Skip'}
          </button>
          <button className={styles.gameButton} 
          style={{ width: "125px", backgroundColor:"#FDFAE0"}}
          onClick={() => {handleEnd}}>
            {'End game'}
          </button>
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
            height="100%"
            theme={tokyoNight}
            extensions={[loadLanguage("css")]}
            onChange={handleCssEditorChange}
          />
          <button style={{ marginTop:"20px", height: "2rem", width: "100px", backgroundColor:"#58C9E2"}}
          className={styles.gameButton} onClick={handleSubmit}>Submit</button>
        </div>
      </div>
    </div>
  );
};

export default Home;
