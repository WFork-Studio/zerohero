import React, { createContext, useEffect, useState, useRef } from "react";
import { useWallet } from "@suiet/wallet-kit";
import {
  getUserData,
  createUserData,
  getAllMessages,
  getPlayerHistories,
  getAllLevels
} from "../pages/api/db_services";
import { createClient } from "@supabase/supabase-js";

export const AppContext = createContext();

export const AppDataProvider = ({ children }) => {
  const [walletData, setWalletData] = useState();
  const [userData, setUserData] = useState();
  const [playerCurrentLevel, setPlayerCurrentLevel] = useState();
  const [messagesReceived, setMessagesReceived] = useState([]);
  const isEffectExecutedRef = useRef(false);
  const wallet = useWallet();
  const supabase = createClient(
    "https://ufelwnylsmdquentynib.supabase.co",
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVmZWx3bnlsc21kcXVlbnR5bmliIiwicm9sZSI6ImFub24iLCJpYXQiOjE2ODU2MjMxNTQsImV4cCI6MjAwMTE5OTE1NH0.NMUn8xqjit6NdPKYTPOVAMMUDRbeEiez_vM-17lqg60"
  );

  const levelPlayer = async (e) => {
    const resp = await getPlayerHistories(wallet.address, null);
    const levels = await getAllLevels();
    const calculatedLevel = calculateLevel(resp.totalWager, levels);

    setPlayerCurrentLevel(calculatedLevel);
  };

  const calculateLevel = (userExp, levelThresholds) => {
    for (let i = levelThresholds.length - 1; i >= 0; i--) {
      if (userExp >= levelThresholds[i].threshold) {
        return levelThresholds[i];
      }
    }

    return levelThresholds[0]; // Default level if no threshold is met
  };

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
        image: message.playerLv?.image,
        colorHex: message.playerLv?.colorHex
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
                image: newMessage.playerLv?.image,
                colorHex: newMessage.playerLv?.colorHex
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
        levelPlayer();
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
          playerCurrentLevel
        },
        chatbox: {
          messagesReceived,
        },
        setWalletData,
        setUserData,
        fetchUserData,
        setPlayerCurrentLevel
      }}
    >
      {children}
    </AppContext.Provider>
  );
};
