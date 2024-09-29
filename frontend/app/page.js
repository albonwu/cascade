"use client";

import CodeMirror from "@uiw/react-codemirror";
import { loadLanguage } from "@uiw/codemirror-extensions-langs";
import { tokyoNight } from "@uiw/codemirror-theme-tokyo-night";
import { EyeDropper } from "react-eyedrop";
import styles from "./page.module.css";
import DOMPurify from "dompurify";
import Home from "../components/views/home";
import { useState } from "react";
import Start from "../components/views/start";
import { useSelector } from "react-redux";

export default function Root() {
  const pageState = useSelector((state) => state.example.value);
  return (
    <>
      <div className={styles.container}>
        <div className={styles.page}>
          {pageState === "start" && <Start />}
          {pageState === "home" && <Home />}
        </div>
      </div>
    </>
  );
}
