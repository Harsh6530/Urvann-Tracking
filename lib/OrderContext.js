"use client";
import { createContext, useContext, useState } from "react";

const OrderContext = createContext();

export const OrderProvider = ({ children }) => {
  const [selectedOrders, setSelectedOrders] = useState(null);

  return (
    <OrderContext.Provider value={{ selectedOrders, setSelectedOrders }}>
      {children}
    </OrderContext.Provider>
  );
};

export const useOrder = () => useContext(OrderContext);
