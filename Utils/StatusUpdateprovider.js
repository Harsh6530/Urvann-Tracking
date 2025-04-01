"use client"
import React, { useEffect, useState } from "react";
import axios from "axios";

const StatusUpdateProvider = () => {

  useEffect(() => {
    const fetchStatus = async () => {
      try {
        const response = await axios.post(
          "http://13.127.231.132:5001/api/TrackerStatusUpdate"
        );
      } catch (error) {
        console.error("Error fetching status:", error);
        console.log(error)
      }
    };

    fetchStatus();
    const interval = setInterval(fetchStatus, 5000);

    return () => clearInterval(interval);
  }, []);

  return <></>;
};

export default StatusUpdateProvider;
