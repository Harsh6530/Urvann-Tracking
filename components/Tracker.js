"use client";
import styles from "./Tracker.module.css";
import { mapping } from "@/Utils/StateMapping";
import { useEffect, useState } from "react";

const Dot = () => {
  return <div className={styles.dot}></div>;
};

const Bar = () => {
  return <div className={styles.bar}></div>;
};

const Tracker = ({ state }) => {
  const [progress, setProgress] = useState([]);

  useEffect(() => {
    if (!state || !mapping[state]) return;

    const keys = Object.keys(mapping);
    const index = keys.indexOf(state);
    const value = mapping[state];

    setProgress((prevProgress) => {
      if (index > prevProgress.length - 1) {
        if (index >= 3) {
          return [...prevProgress, value];
        } else {
          const values = Object.values(mapping);
          const newData = [];
          for (let i = prevProgress.length; i <= index; i++) {
            newData.push(values[i]);
          }
          return [...prevProgress, ...newData];
        }
      }
      return prevProgress; // No update needed
    });
  }, [state]);

  return (
    <div className={styles.tracker}>
      {progress.map((step, idx) => (
        <div
          key={idx}
          className={styles.state}>
          <Dot />
          {step}
          {idx < progress.length - 1 && <Bar />}
        </div>
      ))}
    </div>
  );
};

export default Tracker;
