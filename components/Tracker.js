"use client";

import styles from "./Tracker.module.css";
import { useEffect, useState, ReactNode } from "react";
import { mapping, failureStates } from "@/Utils/StateMapping";

// const Delayed = ({ children, wait = 1000 }) => {
//   const [show, setShow] = useState(false);

//   useEffect(() => {
//     const timer = setTimeout(() => {
//       setShow(true);
//     }, wait);
//     return () => clearTimeout(timer);
//   }, [wait]);

//   return show ? <>{children}</> : null;
// };

const Dot = ({ state, rider_name, rider_number }) => {
  const isFailed = failureStates.includes(state);
  return (
    <div className={styles.dotContainer}>
      <div
        className={styles.dot}
        style={{ backgroundColor: isFailed ? "red" : "green"}}>
        {state === "Order Placed" ? (
          <p>Your Order Has been placed</p>
        ) : state === "Picking Up" ? (
          <p>Your Order is being picked up</p>
        ) : state === "Out for Delivery" ? (
          <p>
            Your Order is out for Delivery
            <br />
            Rider:{rider_name}
            <br />
            No:
            <a
              href={`tel:${rider_number}`}
              className="text-blue-600 underline">
              {rider_number}
            </a>
          </p>
        ) 
        // : state === "Delivered" && orderType === "Replacement" ? (
        //   <p>Replacement Successful</p>
        // ) 
        : state === "Delivered" ? (
          <p>Your Order is Delivered</p>
        ) : state === "Delivery Failed No Response" ? (
          <p>Your Order is failed to be delivered</p>
        ) : (
          ""
        )}
      </div>
      <span>{state}</span>
    </div>
  );
};

const Bar = ({ idx, total, state }) => {
  const isFailed = failureStates.includes(state);
  return (
    <div
      className={styles.bar}
      style={{ backgroundColor: isFailed ? "red" : "green"}}></div>
  );
};

const Tracker = ({ tracker, stamps, rider_name, rider_number, orderType }) => {
  const [visibleSteps, setVisibleSteps] = useState(0);
  useEffect(() => {
    if (visibleSteps < tracker?.length) {
      const timer = setTimeout(() => setVisibleSteps(visibleSteps + 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [visibleSteps, tracker?.length]);

  return (
    <div className={styles.tracker}>
      {!tracker || tracker?.length === 0 || !stamps || stamps?.length === 0
        ? null
        : tracker.slice(0, visibleSteps).map((step, idx) => {
            return (
              <div
                key={idx}
                className={styles.state}>
                <>
                  <Dot
                    state={mapping[step]}
                    isActive={idx === visibleSteps - 1}
                    rider_name={rider_name}
                    rider_number={rider_number}
                    orderType={orderType}
                  />
                  {stamps[idx] && (
                    <div className={styles.timeStamp}>
                      <p>{new Date(stamps[idx]).toLocaleDateString()}</p>{" "}
                      <p>{new Date(stamps[idx]).toLocaleTimeString()}</p>
                    </div>
                  )}
                </>
                {idx < visibleSteps - 1 && step!=="Z-Delivered" && (
                  <Bar state={mapping[tracker[idx + 1]]} />
                )}
              </div>
            );
          })}
    </div>
  );
};

export default Tracker;
