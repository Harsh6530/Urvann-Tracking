"use client";

import styles from "./Tracker.module.css";
import { useEffect, useState, ReactNode } from "react";
import { mapping } from "@/Utils/StateMapping";

const Delayed = ({ children, wait = 1000 }) => {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShow(true);
    }, wait);
    return () => clearTimeout(timer);
  }, [wait]);

  return show ? <>{children}</> : null;
};

const Dot = ({ state }) => {
  return (
    <div className={styles.dotContainer}>
      <div className={styles.dot}>
        {state === "Order Placed" ? (
          <p>Your Order Has been placed</p>
        ) : state === "Picking Up" ? (
          <p>Your Order is being picked up</p>
        ) : state === "Out for Delivery" ? (
          <p>Your Order is out for Delivery</p>
        ) : state === "Delivered" ? (
          <p>Your Order is Delivered</p>
        ) : (
          ""
        )}
      </div>
      <span>{state}</span>
    </div>
  );
};

const Bar = ({ idx, total }) => {
  return <div className={styles.bar}></div>;
};

const Tracker = ({ tracker }) => {
  const [visibleSteps, setVisibleSteps] = useState(0);

  useEffect(() => {
    if (visibleSteps < tracker.length) {
      const timer = setTimeout(() => setVisibleSteps(visibleSteps + 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [visibleSteps, tracker.length]);

  return (
    <div className={styles.tracker}>
      {tracker.slice(0, visibleSteps).map((step, idx) => (
        <div key={idx} className={styles.state}>
          <Dot state={mapping[step]} isActive={idx === visibleSteps - 1} />
          {idx < visibleSteps - 1 && <Bar />}
        </div>
      ))}
    </div>
  );
};


export default Tracker;
