import React, { createContext, useEffect, useState } from "react";
import { useWallet } from "@suiet/wallet-kit";
import { getUserData, createUserData } from "../pages/api/db_services";
import { createClient } from "@supabase/supabase-js";

export const AppContext = createContext();

export const AppDataProvider = ({ children }) => {
  const [walletData, setWalletData] = useState();
  const [userData, setUserData] = useState();
  const wallet = useWallet();
  const supabase = createClient(
    "https://ufelwnylsmdquentynib.supabase.co",
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVmZWx3bnlsc21kcXVlbnR5bmliIiwicm9sZSI6ImFub24iLCJpYXQiOjE2ODU2MjMxNTQsImV4cCI6MjAwMTE5OTE1NH0.NMUn8xqjit6NdPKYTPOVAMMUDRbeEiez_vM-17lqg60"
  );

  useEffect(() => {
    if (wallet?.connected) {
      console.log("wallet connected");
      fetchUserData().then((value) => {
        setUserData(value);
      });
    }
  }, [wallet]);

  const fetchUserData = async () => {
    try {
      const userTempData = await getUserData(wallet.address);

      return userTempData === undefined
        ? await createUserData(wallet.address)
        : userTempData;
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
          supabase,
        },
        setWalletData,
        setUserData,
        fetchUserData,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};
