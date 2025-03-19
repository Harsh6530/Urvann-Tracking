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

  useEffect(() => {
    getDetails();
    const interval = setInterval(getDetails, 5000);

    return () => clearInterval(interval);
  });

  if (!info) return <Loading />;

  return (
    <div className={styles.container}>
      <div className={styles.details}>
        <p>
          Transaction ID: <b>{txn_id}</b>
        </p>
        <p>
          <span>₹ {info?.total}</span> |{" "}
          <span>
            {info?.formattedDate} At {info?.formattedTime}
          </span>{" "}
          <span>{info.status}</span>
        </p>
        <div className={styles.tracker}>
            <Tracker state={info.status} tracker={info.tracker}/>
            <div className={styles.adjust}></div>
        </div>
      </div>
    </div>
  );
};

export default Page;
