import { createClient } from "@supabase/supabase-js";

var authKey = "Basic emVyb2hlcm86bm9wYXNzd29yZA==";
var schema = "zerohero_app";

const supabase = createClient(
  "https://ufelwnylsmdquentynib.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVmZWx3bnlsc21kcXVlbnR5bmliIiwicm9sZSI6ImFub24iLCJpYXQiOjE2ODU2MjMxNTQsImV4cCI6MjAwMTE5OTE1NH0.NMUn8xqjit6NdPKYTPOVAMMUDRbeEiez_vM-17lqg60"
);

export function storeHistory(
  walletAddress,
  profit,
  wager,
  data,
  result,
  gameName
) {
  var myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/json");
  myHeaders.append("Authorization", authKey);

  var raw = JSON.stringify({
    operation: "insert",
    schema: schema,
    table: "histories",
    records: [
      {
        gameName: gameName,
        walletAddress: walletAddress,
        profit: profit,
        wager: wager,
        result: result,
        gameData: data,
      },
    ],
  });

  var requestOptions = {
    method: "POST",
    headers: myHeaders,
    body: raw,
    redirect: "follow",
  };

  fetch("https://zerohero-wfs.harperdbcloud.com", requestOptions)
    .then((response) => response.text())
    .then((result) => console.log(result))
    .catch((error) => console.log("error", error));
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

    console.log("User Data Supa: ", records[0]);
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
    const totalProfit = records.reduce((acc, row) => acc + row.profit, 0);

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

export async function sendMessage(userid, message) {
  try {
    const { error } = await supabase
      .from("messages")
      .insert([{ message: message, userId: userid }]);

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
      .select("*, users!fk_messages_users(walletAddress, username)")
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

export async function getPlayerProfit(walletAddress) {
  var myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/json");
  myHeaders.append("Authorization", authKey);

  var raw = JSON.stringify({
    operation: "sql",
    sql: `SELECT SUM(CAST(profit as float)) as totalProfit FROM zerohero_app.histories WHERE walletAddress = "${walletAddress}"`,
  });

  var requestOptions = {
    method: "POST",
    headers: myHeaders,
    body: raw,
    redirect: "follow",
  };

  try {
    const response = await fetch(
      "https://zerohero-wfs.harperdbcloud.com",
      requestOptions
    );
    const result_1 = await response.text();
    return JSON.parse(result_1);
  } catch (error) {
    return console.log("error", error);
  }
}

export async function getPlayerWins(walletAddress) {
  var myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/json");
  myHeaders.append("Authorization", authKey);

  var raw = JSON.stringify({
    operation: "sql",
    sql: `SELECT COUNT(result) AS totalWins FROM zerohero_app.histories WHERE result = "win" AND walletAddress = "${walletAddress}"`,
  });

  var requestOptions = {
    method: "POST",
    headers: myHeaders,
    body: raw,
    redirect: "follow",
  };

  try {
    const response = await fetch(
      "https://zerohero-wfs.harperdbcloud.com",
      requestOptions
    );
    const result_1 = await response.text();
    return JSON.parse(result_1);
  } catch (error) {
    return console.log("error", error);
  }
}

export async function getPlayerBets(walletAddress) {
  var myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/json");
  myHeaders.append("Authorization", authKey);

  var raw = JSON.stringify({
    operation: "sql",
    sql: `SELECT COUNT(id) AS totalBets FROM zerohero_app.histories WHERE walletAddress = "${walletAddress}"`,
  });

  var requestOptions = {
    method: "POST",
    headers: myHeaders,
    body: raw,
    redirect: "follow",
  };

  try {
    const response = await fetch(
      "https://zerohero-wfs.harperdbcloud.com",
      requestOptions
    );
    const result_1 = await response.text();
    return JSON.parse(result_1);
  } catch (error) {
    return console.log("error", error);
  }
}

export async function getPlayerBiggestBet(walletAddress) {
  var myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/json");
  myHeaders.append("Authorization", authKey);

  var raw = JSON.stringify({
    operation: "sql",
    sql: `SELECT MAX(CAST(wager as float)) AS biggestBet FROM zerohero_app.histories WHERE walletAddress = "${walletAddress}"`,
  });

  var requestOptions = {
    method: "POST",
    headers: myHeaders,
    body: raw,
    redirect: "follow",
  };

  try {
    const response = await fetch(
      "https://zerohero-wfs.harperdbcloud.com",
      requestOptions
    );
    const result_1 = await response.text();
    return JSON.parse(result_1);
  } catch (error) {
    return console.log("error", error);
  }
}

export async function getPlayerFavoriteGame(walletAddress) {
  var myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/json");
  myHeaders.append("Authorization", authKey);

  var raw = JSON.stringify({
    operation: "sql",
    sql: `SELECT gameName, COUNT(gameName) AS totalFavGame FROM zerohero_app.histories GROUP BY gameName ORDER BY totalFavGame DESC LIMIT 1`,
  });

  var requestOptions = {
    method: "POST",
    headers: myHeaders,
    body: raw,
    redirect: "follow",
  };

  try {
    const response = await fetch(
      "https://zerohero-wfs.harperdbcloud.com",
      requestOptions
    );
    const result_1 = await response.text();
    return JSON.parse(result_1);
  } catch (error) {
    return console.log("error", error);
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
