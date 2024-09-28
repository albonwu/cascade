"use client";
import { useCallback, useState } from "react";
import styles from "./page.module.css";
import CodeMirror from "@uiw/react-codemirror";
import { loadLanguage } from "@uiw/codemirror-extensions-langs";

export default function Home() {
  const [text, setText] = useState(
    `
div {
  height: 100px;
  width: 100px;
}`
  );
  const onChange = useCallback((val, viewUpdate) => {
    console.log("val", val), setText(val);
  });
  return (
    <CodeMirror
      value={text}
      height="200px"
      extensions={[loadLanguage("css")]}
      onChange={onChange}
    />
  );
}
