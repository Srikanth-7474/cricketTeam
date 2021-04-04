const express = require("express");
const path = require("path");

const { open } = require("sqlite");
const sqlite3 = require("sqlite3");

const app = express();

const dbPath = path.join(__dirname, "cricketTeam.db");

let db = null;

const initializeDbAndServer = async () => {
  try {
    db = await open({
      filename: dbPath,
      driver: sqlite3.Database,
    });
    app.listen(3000, () => {
      console.log("Server Running");
    });
  } catch (e) {
    console.log(e.message);
    process.exit(1);
  }
};

initializeDbAndServer();

//get Players API
app.get("/players/", async (request, response) => {
  const getPlayersQuery = `
  SELECT *
  FROM cricket_team;`;

  const playersArray = await db.all(getPlayersQuery);
  response.send(playersArray);
});

//add player API
app.post("/players/", async (request, response) => {
  const playerDetails = request.body;
  const { playerName, jerseyNumber, role } = playerDetails;
  const addPlayerQuery = `
  INSERT INTO 
  cricket_team (playerName, jerseyNumber, role )
  values (${playerName}, ${jerseyNumber}, ${role});`;

  await db.run(addPlayerQuery);
  response.send("Player Added to Team");
});

//get player API
app.get("/players/:playerId/", async (request, response) => {
  const { playerId } = request.params;

  const getplayerQuery = `
    SELECT *
    FROM cricket_team
    WHERE player_id = ${playerId};`;

  const player = await db.get(getplayerQuery);
  response.send(player);
});

//update player API
app.get("/players/:playerId/", async (request, response) => {
  const { playerId } = request.params;
  const playerDetails = request.body;

  const { playerName, jerseyNumber, role } = playerDetails;

  const updatePlayerQuery = `
    UPDATE 
      cricket_team
    SET
      playerName = '${playerName}',
      jerseyNumber = ${jerseyNumber},
      role = '${role}'
    WHERE player_id = ${playerId};`;

  await db.run(updatePlayerQuery);
  response.send("Player Details Updated");
});

//delete player API
app.delete("/players/:playerId/", async (request, response) => {
  const { playerId } = request.params;
  const deletePlayerQuery = `
    DELETE FROM
    cricket_team
    WHERE player_id = ${playerId};`;
  await db.run(deletePlayerQuery);
  response.send("Player Removed");
});

module.exports = app;
