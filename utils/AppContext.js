import React, { createContext, useEffect, useState } from "react";
import { useWallet } from "@suiet/wallet-kit";
import { getUserData } from "../pages/api/db_services";

export const AppContext = createContext();

export const AppDataProvider = ({ children }) => {
  const [walletData, setWalletData] = useState();
  const [userData, setUserData] = useState();
  const wallet = useWallet();

  useEffect(() => {
    if (wallet?.connected) {
      console.log("wallet connected");
      fetchUserData();
    }
  }, [wallet]);

  const fetchUserData = async () => {
    try {
      const userTempData = await getUserData(wallet.address);
      console.log("User data: ", userTempData[0]);
      setUserData(userTempData[0]);
    } catch (error) {
      console.error("Error fetching user data: ", error);
    }
  };

  return (
    <AppContext.Provider
      value={{
        state: {
          walletData,
          userData,
        },
        setWalletData,
        setUserData,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};
