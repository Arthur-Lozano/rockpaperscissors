"use strict";

const express = require("express");
const app = express();

const port = 3333;

const server = app.listen(port, () => {
  console.log(`Server is up on ${port}`);
});

const io = require("socket.io")(server);

let playerOne = null;
let playerTwo = null;

let choiceOne = null;
let choiceTwo = null;

function getWinner(result, p1, p2) {
  if (result === "draw") {
    console.log("It was a tie");
    io.emit("draw");
  } else if (result === true) {
    console.log("Player One Won");
    io.emit("player1", p1);
  } else {
    console.log("Player two won");
    io.emit("player2", p2);
  }
}

function compare(c1, c2) {
  if (c1 === c2) {
    return "draw";
  } else if (c1 === "rock") {
    if (c2 === "paper") {
      return false;
    } else {
      return true;
    }
  } else if (c1 === "paper") {
    if (c2 === "scissor") {
      return false;
    } else {
      return true;
    }
  } else if (c1 === "scissor") {
    if (c2 === "rock") {
      return false;
    } else {
      return true;
    }
  }
}

io.on("connection", (socket) => {
  console.log("Up and running");

  socket.on("createGame", (yourName) => {
    console.log(`Thanks ${yourName} for joining the game!`);
    socket.join("gameRoom");

    if (playerOne === null) {
      playerOne = yourName;
    } else {
      playerTwo = yourName;
    }
    if (playerOne && playerTwo) {
      console.log("This is PLAYER ONE", playerOne);
      console.log("This is PLAYER TWO", playerTwo);
      socket.to("gameRoom").emit("startgame", playerOne);
      socket.emit("startgame", playerTwo);
    }
  });

  socket.on("restart", (name) => {
    if (playerOne === null) {
      playerOne = name;
    } else {
      playerTwo = name;
    }
    socket.to("gameRoom").emit("startgame", playerOne);
    socket.emit("startgame", playerTwo);
  });

  socket.on("results", (payload) => {
    console.log("This is inside the results event", payload.player);
    if (playerOne === payload.player) {
      choiceOne = payload.choice;
    } else {
      choiceTwo = payload.choice;
    }

    if (choiceOne && choiceTwo) {
      let result = compare(choiceOne, choiceTwo);
      choiceOne = null;
      choiceTwo = null;

      getWinner(result, playerOne, playerTwo);
    }
  });

  function getWinner(result, p1, p2) {
    if (result === "draw") {
      console.log("It was a tie");
      socket.emit("draw");
    } else if (result === false) {
      console.log("Player One Won");
      socket.to("gameRoom").emit("player1", p1);
      socket.emit("player1", p1);
    } else {
      console.log("Player two won");
      socket.emit("player2", p2);
      socket.to("gameRoom").emit("player2", p2);
    }
  }
});
