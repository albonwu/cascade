"use client";

import CodeMirror from "@uiw/react-codemirror";
import { loadLanguage } from "@uiw/codemirror-extensions-langs";
import { tokyoNight } from "@uiw/codemirror-theme-tokyo-night";
import { EyeDropper } from "react-eyedrop";
import styles from "./page.module.css";
import DOMPurify from "dompurify";
import Home from "../components/views/home";


export default function Root() {
  return <Home />
}
