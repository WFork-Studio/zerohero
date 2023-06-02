import React, { createContext, useEffect, useState, useRef } from "react";
import { useWallet } from "@suiet/wallet-kit";
import {
  getUserData,
  createUserData,
  getAllMessages,
} from "../pages/api/db_services";
import { createClient } from "@supabase/supabase-js";

export const AppContext = createContext();

export const AppDataProvider = ({ children }) => {
  const [walletData, setWalletData] = useState();
  const [userData, setUserData] = useState();
  const [messagesReceived, setMessagesReceived] = useState([]);
  const isEffectExecutedRef = useRef(false);
  const wallet = useWallet();
  const supabase = createClient(
    "https://ufelwnylsmdquentynib.supabase.co",
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVmZWx3bnlsc21kcXVlbnR5bmliIiwicm9sZSI6ImFub24iLCJpYXQiOjE2ODU2MjMxNTQsImV4cCI6MjAwMTE5OTE1NH0.NMUn8xqjit6NdPKYTPOVAMMUDRbeEiez_vM-17lqg60"
  );

  const getMessages = async () => {
    const messages = await getAllMessages();
    const newMessages = messages.filter(
      (message) =>
        !messagesReceived.some(
          (existingMessage) => existingMessage.id === message.id
        )
    );
    setMessagesReceived((messagesReceived) => [
      ...messagesReceived,
      ...newMessages.map((message) => ({
        message: message.message,
        walletAddress: message.users?.walletAddress,
        username: message.users?.username,
      })),
    ]);
  };

  useEffect(() => {
    if (!isEffectExecutedRef.current) {
      getMessages();
      isEffectExecutedRef.current = true;
    }

    const subsMessages = supabase
      .channel("schema-db-changes")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
        },
        async (payload) => {
          const newMessage = payload.new;
          // Retrieve the related user data
          const { data: user, error } = await supabase
            .from("users")
            .select("walletAddress, username")
            .match({ id: newMessage.userId })
            .single();

          if (error) {
            console.error("Error fetching user data:", error);
            return;
          }

          // Check if the new message already exists in the state
          if (
            !messagesReceived.some(
              (existingMessage) => existingMessage.id === newMessage.id
            )
          ) {
            // Update the state by adding the new message
            setMessagesReceived((messagesReceived) => [
              ...messagesReceived,
              {
                message: newMessage.message,
                walletAddress: user.walletAddress,
                username: user.username,
              },
            ]);
          }
        }
      )
      .subscribe();

    return () => {
      subsMessages.unsubscribe();
    };
  }, [setMessagesReceived]);

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
        chatbox: {
          messagesReceived,
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
