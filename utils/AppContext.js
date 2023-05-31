import React, { createContext, useEffect, useState } from "react";
import { useWallet } from "@suiet/wallet-kit";
import { getUserData, createUserData } from "../pages/api/db_services";

export const AppContext = createContext();

export const AppDataProvider = ({ children }) => {
  const [walletData, setWalletData] = useState();
  const [userData, setUserData] = useState();
  const wallet = useWallet();

  useEffect(() => {
    if (wallet?.connected) {
      console.log("wallet connected");
      fetchUserData().then((value) => {
        console.log("Data User: " + value[0]);
        setUserData(value[0]);
      });
    }
  }, [wallet]);

  const fetchUserData = async () => {
    try {
      const userTempData = await getUserData(wallet.address);
      console.log("User data: ", userTempData[0]);

      if (userTempData[0] === undefined) {
        await createUserData(wallet.address);
      }

      return await getUserData(wallet.address);
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
