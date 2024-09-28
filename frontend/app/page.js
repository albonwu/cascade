"use client";
import { useCallback, useState } from "react";
import CodeMirror from "@uiw/react-codemirror";
import { loadLanguage } from "@uiw/codemirror-extensions-langs";
import { tokyoNight } from "@uiw/codemirror-theme-tokyo-night";
import styles from "./page.module.css";

export default function Home() {
  const [css, setCss] = useState(`
div {
  height: 100px;
  width: 100px;
}`);
  const [html, setHtml] = useState("<div></div>");

  const handleCssEditorChange = useCallback((val, viewUpdate) => {
    setCss(val);
  });
  const handleHtmlChange = useCallback(() => {});
  return (
    <div className={styles.container}>
      <div className={styles.previewContainer}>
        <img src="https://placehold.co/400" alt="target" />
        <img src="https://placehold.co/400" alt="preview" />
      </div>
      <div className={styles.editorContainer}>
        <CodeMirror
          value={html}
          height="200px"
          theme={tokyoNight}
          extensions={[loadLanguage("html")]}
          onChange={handleHtmlChange}
        />
        <CodeMirror
          value={css}
          height="200px"
          theme={tokyoNight}
          extensions={[loadLanguage("css")]}
          onChange={handleCssEditorChange}
        />
      </div>
    </div>
  );
}
