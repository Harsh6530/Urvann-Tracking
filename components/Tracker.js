"use client";
import styles from "./Tracker.module.css";
import { useEffect, useState } from "react";

const Dot = ({ state }) => {
  return (
    <div className={styles.dotContainer}>
      <div className={styles.dot}></div>
      <span>{state}</span>
    </div>
  );
};

const Bar = () => {
  return <div className={styles.bar}></div>;
};

const Tracker = ({ state, tracker }) => {
  console.log(tracker);
  return (
    <div className={styles.tracker}>
      {tracker.map((step, idx) => (
        <div
          key={idx}
          className={styles.state}>
          <Dot state={step} />
          {idx < tracker.length - 1 && <Bar />}
        </div>
      ))}
    </div>
  );
};

export default Tracker;
