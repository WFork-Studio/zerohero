var authKey = "Basic emVyb2hlcm86bm9wYXNzd29yZA==";
var schema = "zerohero_app";

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

export async function getAllHistoriesTotalWager(result = null) {
  var myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/json");
  myHeaders.append("Authorization", authKey);

  var raw = JSON.stringify({
    operation: "sql",
    sql:
      result === null
        ? `SELECT SUM(CAST(wager as float)) as totalWager FROM zerohero_app.histories`
        : `SELECT SUM(CAST(wager as float)) as totalWager FROM zerohero_app.histories WHERE result = ${result}`,
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

export async function getAllHistoriesCount(result = null) {
  var myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/json");
  myHeaders.append("Authorization", authKey);

  var raw = JSON.stringify({
    operation: "sql",
    sql:
      result === null
        ? `SELECT COUNT(id) AS numberOfHistories FROM zerohero_app.histories`
        : `SELECT COUNT(case when result = '${result}' then 1 else null end) AS numberOfHistories FROM zerohero_app.histories`,
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

export function getUserData({ walletAddress }) {
  var myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/json");
  myHeaders.append("Authorization", authKey);

  var raw = JSON.stringify({
    operation: "sql",
    sql: `SELECT * FROM ${schema}.users where walletAddress = ${walletAddress}`,
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

export function updateUserData({ walletAddress, query }) {
  var myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/json");
  myHeaders.append("Authorization", authKey);

  var raw = JSON.stringify({
    operation: "sql",
    sql: query + ` WHERE walletAddress = ${walletAddress}`,
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

export async function getPlayerHistories(walletAddress, limit = null) {
  var myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/json");
  myHeaders.append("Authorization", authKey);

  var raw = JSON.stringify({
    operation: "sql",
    sql: limit !== null ?
      `SELECT * FROM ${schema}.histories WHERE walletAddress = "${walletAddress}" ORDER BY __createdtime__ DESC LIMIT ${limit}`
      :
      `SELECT * FROM ${schema}.histories WHERE walletAddress = "${walletAddress}" ORDER BY __createdtime__ DESC`
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

export async function getPlayerWager(walletAddress) {
  var myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/json");
  myHeaders.append("Authorization", authKey);

  var raw = JSON.stringify({
    operation: "sql",
    sql: `SELECT SUM(CAST(wager as float)) as totalWager FROM zerohero_app.histories WHERE walletAddress = "${walletAddress}"`
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

export async function getPlayerProfit(walletAddress) {
  var myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/json");
  myHeaders.append("Authorization", authKey);

  var raw = JSON.stringify({
    operation: "sql",
    sql: `SELECT SUM(CAST(profit as float)) as totalProfit FROM zerohero_app.histories WHERE walletAddress = "${walletAddress}"`
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

export async function getAllHistories(game = null, limit = 10) {
  var myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/json");
  myHeaders.append("Authorization", authKey);

  var raw = JSON.stringify({
    operation: "sql",
    sql:
      game === null
        ? `SELECT * FROM ${schema}.histories ORDER BY __createdtime__ DESC LIMIT ${limit}`
        : `SELECT * FROM ${schema}.histories WHERE gameName = '${game}' ORDER BY __createdtime__ DESC LIMIT ${limit}`,
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
