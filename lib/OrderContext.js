"use client";
import { createContext, useContext, useState, useEffect } from "react";

export const OrderContext = createContext();

export const useOrder = () => {
  const context = useContext(OrderContext);
  if (!context) {
    throw new Error("useOrder must be used within an OrderProvider");
  }
  return context;
};

// Order Provider Component
export const OrderProvider = ({ children }) => {
  const [orders, setOrders] = useState(null);

  useEffect(() => {
    const savedOrders = typeof window !== "undefined" ? localStorage.getItem("orders") : null;
    if (savedOrders) {
      setOrders(JSON.parse(savedOrders));
    }
  }, []);

  useEffect(() => {
    if (orders) {
      localStorage.setItem("orders", JSON.stringify(orders));
    }
  }, [orders]);

  return (
    <OrderContext.Provider value={{ orders, setOrders }}>
      {children}
    </OrderContext.Provider>
  );
};