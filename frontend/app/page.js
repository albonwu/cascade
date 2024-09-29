"use client";
import { useCallback, useState } from "react";
import CodeMirror from "@uiw/react-codemirror";
import { loadLanguage } from "@uiw/codemirror-extensions-langs";
import { tokyoNight } from "@uiw/codemirror-theme-tokyo-night";
import { EyeDropper } from "react-eyedrop";
import styles from "./page.module.css";
import DOMPurify from "dompurify";

const BACKEND = "http://127.0.0.1:5000";

export default function Home() {
  const [css, setCss] = useState(`
div {
  height: 100px;
  width: 100px;
  background: #00274C;
  color: #FFCB05
}`);
  const [html, _] = useState("<div>hello</div>");
  const [puzzleId, setPuzzleId] = useState("");

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

  const handleCssEditorChange = useCallback((val, viewUpdate) => {
    setCss(val);
  });

  async function startPuzzle() {
    const res = await fetch(`${BACKEND}/generate?theme=zen&component=clock`);
    const newPuzzleId = await res.text();
    setPuzzleId(newPuzzleId);
  }

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
          <img
            src={`${BACKEND}/static/${puzzleId}.png`}
            width="300"
            height="300"
            alt="target"
            onClick={startPuzzle}
          />
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
        </div>
      </div>
      <button onClick={handleSubmit}>Submit</button>
    </div>
  );
}
