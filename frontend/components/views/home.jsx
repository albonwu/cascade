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
            div {
              height: 100px;
              width: 100px;
              background: #00274C;
              color: #FFCB05
            }`);
  const [html, _] = useState("<div>hello</div>");

  const dispatch = useDispatch();

  function generatePreviewHtml() {
    return `<html><style>body { margin: 0 } ${css}</style>${DOMPurify.sanitize(
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

  const handleCssEditorChange = useCallback((val, viewUpdate) => {
    setCss(val);
  });

  const [pickedColor, setPickedColor] = useState({ rgb: "", hex: "" });
  const [eyedropOnce] = useState(true); // only 1 use of the eyedropper per button press
  const handleChangeColor = ({ rgb, hex }) => {
    setPickedColor({ rgb, hex });
  };

  return (
    <div className={styles.container}>
      <div>
        <div className="eyedrop-wrapper">
          <EyeDropper once={eyedropOnce} onChange={handleChangeColor}>
            Eyedropper
          </EyeDropper>
          <div
            style={{ backgroundColor: pickedColor.rgb }}
            className="eyedrop-color"
          />
          <p style={{ display: "inline-block", position: "relative" }}>
            color:
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
          <p>HEX: {pickedColor.hex}</p>
        </div>
        <div className={styles.previewContainer}>
          <img src={`${BACKEND}/${sessionId}/target`} alt="target" />
          <iframe
            className={styles.preview}
            srcDoc={generatePreviewHtml()}
          ></iframe>{" "}
        </div>
      </div>

      <div className={styles.editorContainer}>
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
          <button onClick={handleStart}>Start</button>
          <button onClick={handleSubmit}>Submit</button>
        </div>
      </div>
    </div>
  );
};

export default Home;
