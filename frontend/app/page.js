"use client";
import { useCallback, useState } from "react";
import CodeMirror from "@uiw/react-codemirror";
import { loadLanguage } from "@uiw/codemirror-extensions-langs";
import { tokyoNight } from "@uiw/codemirror-theme-tokyo-night";
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

  return (
    <div className={styles.container}>
      <div className={styles.previewContainer}>
        <img src="https://placehold.co/400" alt="target" />
        <iframe
          className={styles.preview}
          srcDoc={generatePreviewHtml()}
        ></iframe>{" "}
        // todo: debounce this since it is very expensive
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
