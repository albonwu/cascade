"use client";
import { useCallback, useState, useEffect } from "react";
import CodeMirror from "@uiw/react-codemirror";
import { loadLanguage } from "@uiw/codemirror-extensions-langs";
import { tokyoNight } from "@uiw/codemirror-theme-tokyo-night";
import { EyeDropper } from "react-eyedrop";
import { useTimer } from 'react-timer-hook';
import styles from "./page.module.css";
import DOMPurify from "dompurify";

const BACKEND = "http://127.0.0.1:5000";
var score = 0;
var timeLimit = 180; // timer length in seconds

export default function Home() {
  const [css, setCss] = useState(`
div {
  height: 100px;
  width: 100px;
  background: #00274C;
  color: #FFCB05
}`);
  const [html, _] = useState("<div>hello</div>");

  function generatePreviewHtml() {
    return `<html><style>body { margin: 0 } ${css}</style>${DOMPurify.sanitize(
      html
    )}</html>`;
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
  
  // function Timer({ expiryTimestamp }) {
  //   const timerRef = useRef(useTimer({ expiryTimestamp: time, onExpire: () => console.log('Timer expired') })); // TODO: make expiry function
  
  //   return (
  //     <div>
  //       <p>Time remaining: {timerRef.current.seconds}</p>          
  //     </div>
  //   );
  // }

  const handleCssEditorChange = useCallback((val, viewUpdate) => {
    setCss(val);
  });
  const handleHtmlChange = useCallback(() => {});

  const [expiryTimestamp, setExpiryTimestamp] = useState(null);
  
  useEffect(() => {
    const time = new Date();
    time.setSeconds(time.getSeconds() + timeLimit);
    setExpiryTimestamp(time); // Set the expiry time only once
  }, []);
  
  const { seconds, minutes } = useTimer({
    expiryTimestamp,
    onExpire: () => console.log('Timer expired'), // todo: 
  });

  const [pickedColor, setPickedColor] = useState({ rgb: "", hex: "" });
  const [eyedropOnce] = useState(true); // only 1 use of the eyedropper per button press
  const handleChangeColor = ({ rgb, hex }) => {
    setPickedColor({ rgb, hex });
  };

  return (
    <div className={styles.container}>
      <div left>
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
                backgroundColor: pickedColor.rgb || "#FFFFFF",
                width: "100px",
                height: "1em",
                verticalAlign: "middle",
                marginLeft: "8px",
              }}
            ></span>
          </p>
          <p style={{ color: "#FFFFFF" }}>RGB: {pickedColor.rgb}</p>
          <p style={{ color: "#FFFFFF" }}>HEX: {pickedColor.hex}</p>
        </div>
        <div className={styles.previewContainer}>
          <img src="https://placehold.co/300" alt="target" />
          <iframe
            className={styles.preview}
            srcDoc={generatePreviewHtml()}
          ></iframe>{" "}
        </div>
      </div>
      <div right style={{ width: '100%' }}>
        <p>Score: {score}</p>
        {expiryTimestamp ? (
          <div>
            <p>Time remaining: {minutes}:{seconds < 10 ? `0${seconds}` : seconds}</p>
          </div>
        ) : (
          <p>Loading timer...</p>
        )}
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
          </div>
        </div>
        <button onClick={handleSubmit}>Submit</button>
      </div>
    </div>
  );
}
