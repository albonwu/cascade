"use client";

import styles from "./page.module.css";
import Home from "../components/views/home";
import Start from "../components/views/start";
import { useSelector } from "react-redux";

export default function Root() {
  const pageState = useSelector((state) => state.example.value);
  return (
    <>
      {pageState === "start" && <Start />}
      {pageState === "home" && <Home />}
    </>
  );
}
