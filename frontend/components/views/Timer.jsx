import React from "react";
import { useTimer } from "react-timer-hook";
import styles from "../../styles/timer.module.css";

export default function Timer({ length, onExpire }) {
  const { minutes, seconds, isRunning } = useTimer({
    expiryTimestamp: new Date(new Date().getTime() + length),
    onExpire,
  });
  return (
    <div className={styles.timer}>
      {minutes.toLocaleString("en-US", {
        minimumIntegerDigits: 2,
        useGrouping: false,
      })}
      :
      {seconds.toLocaleString("en-US", {
        minimumIntegerDigits: 2,
        useGrouping: false,
      })}
    </div>
  );
}
