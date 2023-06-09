import { createClient } from "@supabase/supabase-js";

var authKey = "Basic emVyb2hlcm86bm9wYXNzd29yZA==";
var schema = "zerohero_app";

const supabase = createClient(
  "https://blznedvnlyxsgwpzewas.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJsem5lZHZubHl4c2d3cHpld2FzIiwicm9sZSI6ImFub24iLCJpYXQiOjE2ODY1ODA5MTgsImV4cCI6MjAwMjE1NjkxOH0.WV8XqUaK4Zrkj2aTvb7AJ45JvTG98N2oXRucnA6P5EM"
);

export async function storeHistory(
  walletAddress,
  profit,
  payout,
  wager,
  gameData,
  result,
  gameName,
  playerLv,
  username
) {
  try {
    const { error } = await supabase
      .from("histories")
      .insert([
        { gameData: gameData, gameName: gameName, profit: profit, payout: payout, result: result, wager: wager, walletAddress: walletAddress, playerLv: playerLv, username: username },
      ]);

    if (error) {
      throw error;
    }

    console.log("Data inserted.");
    return "Data inserted.";
  } catch (error) {
    console.error("Error inserting data into Supabase:", error.message);
  }
}

export async function createUserData(walletAddress) {
  try {
    const { error } = await supabase
      .from("users")
      .insert([
        { username: null, walletAddress: walletAddress, firstTimePlay: true },
      ]);

    if (error) {
      throw error;
    }

    // Fetch the updated user data
    const { data, error: fetchError } = await supabase
      .from("users")
      .select("*")
      .eq("walletAddress", walletAddress);

    if (fetchError) {
      throw fetchError;
    }

    console.log("Data inserted to supa: ", data);
    return data[0];
  } catch (error) {
    console.error("Error inserting data into Supabase:", error.message);
  }
}

export async function getUserData(walletAddress) {
  try {
    const { data: records, error } = await supabase
      .from("users")
      .select("*")
      .eq("walletAddress", walletAddress);

    if (error) {
      throw error;
    }

    return records[0];
  } catch (error) {
    console.error("Error fetching data from Supabase:", error.message);
    return null;
  }
}

export async function updateUsernameData(walletAddress, newUsername) {
  try {
    const { error } = await supabase
      .from("users")
      .update({ username: newUsername })
      .eq("walletAddress", walletAddress);

    if (error) {
      throw error;
    }

    // Fetch the updated user data
    const { data, error: fetchError } = await supabase
      .from("users")
      .select("*")
      .eq("walletAddress", walletAddress);

    if (fetchError) {
      throw fetchError;
    }

    return data[0];
  } catch (error) {
    console.error("Error updating username in Supabase:", error.message);
  }
}

export async function getPlayerHistories(walletAddress, limit = null) {
  try {
    const {
      data: records,
      count,
      error,
    } = await supabase
      .from("histories")
      .select("*", { count: "exact" })
      .eq("walletAddress", walletAddress)
      .order("createdAt", { ascending: false });
    if (error) {
      throw error;
    }

    const totalWager = records.reduce((acc, row) => acc + row.wager, 0);
    const wins = records.filter((row) => row.result === "win").length;
    const losses = records.filter((row) => row.result === "lose").length;
    const biggestWager = Math.max(...records.map((row) => row.wager));
    
    const winsFilter = records.filter((row) => row.result === "win");
    const totalProfit = winsFilter.reduce((acc, row) => acc + row.profit, 0);

    let slicedRecords = records;

    if (limit !== null) {
      slicedRecords = records.slice(0, limit);
    }
    // Find the most favorite game
    const gameCounts = {};
    let maxCount = 0;
    let mostFavoriteGame = "";

    records.forEach((row) => {
      const gameName = row.gameName;
      gameCounts[gameName] = (gameCounts[gameName] || 0) + 1;
      if (gameCounts[gameName] > maxCount) {
        maxCount = gameCounts[gameName];
        mostFavoriteGame = gameName;
      }
    });

    return {
      records: slicedRecords,
      count: count,
      totalWager,
      wins,
      losses,
      biggestWager,
      totalProfit,
      mostFavoriteGame,
    };
  } catch (error) {
    console.error("Error fetching data from Supabase:", error.message);
    return null;
  }
}

export async function getAllLevels() {
  try {
    const { data: records, error } = await supabase.from("levels").select("*");

    if (error) {
      throw error;
    }

    return records;
  } catch (error) {
    console.error("Error fetching data from Supabase:", error.message);
    return null;
  }
}

export async function sendMessage(userid, message, playerLv) {
  try {
    const { error } = await supabase
      .from("messages")
      .insert([{ message: message, userId: userid, playerLv: playerLv }]);

    if (error) {
      throw error;
    }
  } catch (error) {
    console.error("Error inserting data into Supabase:", error.message);
  }
}

export async function getAllMessages() {
  try {
    const { data: records, error } = await supabase
      .from("messages")
      .select("*, users!messages_userId_fkey(walletAddress, username)")
      .order("createdAt", { ascending: true });

    if (error) {
      throw error;
    }
    return records;
  } catch (error) {
    console.error("Error fetching data from Supabase:", error.message);
    return null;
  }
}

export async function getStatsData() {
  try {
    const { data: records, error } = await supabase
      .from("statsdata")
      .select("*");

    if (error) {
      throw error;
    }

    return records;
  } catch (error) {
    console.error("Error fetching data from Supabase:", error.message);
    return null;
  }
}

export async function getAllHistories(game = null, limit = 10) {
  try {
    const {
      data: records,
      count,
      error,
    } = game !== null
        ? await supabase
          .from("histories")
          .select("*", { count: "exact" })
          .eq("gameName", game)
          .limit(limit)
          .order("createdAt", { ascending: false })
        : await supabase
          .from("histories")
          .select("*", { count: "exact" })
          .limit(limit)
          .order("createdAt", { ascending: false });
    if (error) {
      throw error;
    }
    return { records, count: count };
  } catch (error) {
    console.error("Error fetching data from Supabase:", error.message);
    return null;
  }
}
