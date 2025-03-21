"use client";

import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { authenticate } from "@/server/auth-actions";
import { checkAuth } from "@/redux/features/auth";
import Loading from "@/components/Loading";
import { useEffect, useState } from "react";
import { fetchOrderByTxn } from "@/server/order-actions";
import styles from "./page.module.css";
import Tracker from "@/components/Tracker";
import{mapping} from "@/Utils/StateMapping"

const Page = ({ params }) => {
  const router = useRouter();
  const dispatch = useDispatch();
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const token = useSelector((state) => state.auth.userToken);

  const [info, setInfo] = useState(null);

  const txn_id = params.slug;

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/login");
    }
  }, [isAuthenticated, router]);

  // Check authentication on mount
  useEffect(() => {
    dispatch(checkAuth());
  }, [dispatch]);

  // Function to fetch details
  const getDetails = async () => {
    try {
      const response = await fetchOrderByTxn(txn_id);

      if (response.success) {
        if (!info || info.status !== response.data.status) {
          setInfo(response.data);
        }
      } else {
        console.log("Unsuccessful fetch");
      }
    } catch (error) {
      console.error("Error fetching details:", error);
    }
  };

  const getNextDayParts = (formattedDate) => {
    if (!formattedDate) return { month: "", day: "", year: "" };
  
    const currentDate = new Date(formattedDate);
    currentDate.setDate(currentDate.getDate() + 1); 
  
    return {
      month: currentDate.toLocaleDateString("en-US", { month: "short" }), // "Mar"
      day: currentDate.toLocaleDateString("en-US", { day: "2-digit" }),    // "20"
      year: currentDate.toLocaleDateString("en-US", { year: "numeric" })   // "2025"
    };
  };

  useEffect(() => {
    getDetails();
    const interval = setInterval(getDetails, 5000);

    return () => clearInterval(interval);
  });

  if (!info) return <Loading />;

  const { month, day, year } = getNextDayParts(info?.formattedDate);

  return (
    <div className={styles.container}>
      <div className={styles.details}>
        <div className={styles.orderInfo}>
          <p className={styles.estimate}>ESTIMATED DELIVERY DATE</p>
          <span className={styles.day}>{day}</span>
          {" "}
          <span className={styles.month}>{month},</span>
          {" "}
          <span className={styles.year}>{year}</span>
          <p>
            Transaction ID: <b>{txn_id}</b>
          </p>
          <p>
            <b>₹ {parseFloat(info?.total?.toFixed(2))}</b>
          </p>
          {" "}
          <p style={{marginTop:"1rem", fontSize:"1rem", fontWeight:600}}>Order Status</p>
          <span className={styles.order_status}>{mapping[info.status]}</span>
        </div>
        <div className={styles.productDetails}>
          
        </div>
        <div className={styles.tracker}>
          <Tracker
            className={styles.track}
            state={info.status}
            tracker={info.tracker}
            stamps={info.trackerStamp}
            rider_name={info.rider_name}
            rider_number={info.rider_number}
          />
        </div>
      </div>
    </div>
  );
};

export default Page;
