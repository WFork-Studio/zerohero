var authKey = "Basic emVyb2hlcm86bm9wYXNzd29yZA==";
var schema = "zerohero_app";

function storeHistory(walletAddress, profit, wager, data, result, gameName) {
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

function getUserData({ walletAddress }) {
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

function updateUserData({ walletAddress, query }) {
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

function getPlayerHistories({ walletAddress }) {
  var myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/json");
  myHeaders.append("Authorization", authKey);

  var raw = JSON.stringify({
    operation: "sql",
    sql: `SELECT * FROM ${schema}.histories where walletAddress = ${walletAddress}`,
  });

  var requestOptions = {
    method: "POST",
    headers: myHeaders,
    body: raw,
    redirect: "follow",
  };

  return fetch("https://zerohero-wfs.harperdbcloud.com", requestOptions)
    .then((response) => response.text())
    .then((result) => console.log(result))
    .catch((error) => console.log("error", error));
}

function getAllHistories(game = null, limit = 10) {
  var myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/json");
  myHeaders.append("Authorization", authKey);

  var raw = JSON.stringify({
    operation: "sql",
    sql:
      game === null
        ? `SELECT * FROM ${schema}.histories LIMIT ${limit}`
        : `SELECT * FROM ${schema}.histories WHERE gameName = ${game} LIMIT ${limit}`,
  });

  var requestOptions = {
    method: "POST",
    headers: myHeaders,
    body: raw,
    redirect: "follow",
  };

  return fetch("https://zerohero-wfs.harperdbcloud.com", requestOptions)
    .then((response) => response.text())
    .then((result) => console.log(result))
    .catch((error) => console.log("error", error));
}

export default {
  storeHistory,
  getUserData,
  updateUserData,
  getPlayerHistories,
  getAllHistories,
};
