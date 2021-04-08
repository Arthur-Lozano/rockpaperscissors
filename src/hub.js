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
  console.log(socket.id);

  socket.on("createGame", (yourName) => {
    console.log(`Thanks ${yourName} for joining the game!`);
    socket.join("gameRoom");

    if (playerOne === null) {
      playerOne = { name: yourName, socketId: socket.id };
      io.to(socket.id).emit("startgame", playerOne.name, socket.id);
    } else {
      playerTwo = { name: yourName, socketId: socket.id };
      io.to(socket.id).emit("startgame", playerTwo.name, socket.id);
    }
    // if (playerOne && playerTwo) {
    //   console.log("This is PLAYER ONE", playerOne, socket.id);
    //   console.log("This is PLAYER TWO", playerTwo, socket.id);
    //   socket.to("gameRoom").emit("startgame", playerOne, socket.id);
    //   socket.emit("startgame", playerTwo, socket.id);
    // }
  });

  socket.on("restart", (p1, p2) => {
    // if (playerOne === null) {
    //   playerOne = name;
    // } else {
    //   playerTwo = name;
    // }
    if (socket.id === playerOne.socketId) {
      io.to(playerOne.socketId).emit(
        "startgame",
        playerOne.name,
        playerOne.socketId
      );
    }
    if (socket.id === playerTwo.socketId) {
      io.to(playerTwo.socketId).emit(
        "startgame",
        playerTwo.name,
        playerTwo.socketId
      );
    }
  });

  socket.on("results", (payload) => {
    console.log("This is inside the results event", payload.player);
    if (playerOne.socketId === payload.socket) {
      choiceOne = payload.choice;
    }
    if (playerTwo.socketId === payload.socket) {
      choiceTwo = payload.choice;
    }
    if (choiceOne && choiceTwo) {
      let result = compare(choiceOne, choiceTwo);
      choiceOne = null;
      choiceTwo = null;
      console.log(socket.id);
      io.to(playerOne.socketId).emit("winner", result, playerOne, playerTwo);
      io.to(playerTwo.socketId).emit("winner", result, playerOne, playerTwo);
      // socket.to("gameRoom").emit("winner", result, playerOne, playerTwo);
      // socket.emit("winner", result, playerOne, playerTwo);
      // getWinner(result, playerOne, playerTwo);
    }
  });

  // function getWinner(result, p1, p2) {
  //   if (result === "draw") {
  //     console.log("It was a tie");
  //     socket.emit("winner", p1, p2);
  //   } else if (result === false) {
  //     console.log("Player One Won");
  //     socket.to("gameRoom").emit("winner", p1, p2);
  //     socket.emit("winner", p1, p2);
  //   } else {
  //     console.log("Player two won");
  //     socket.emit("winner", p1, p2);
  //     socket.to("gameRoom").emit("winner", p1, p2);
  //   }
  // }
});
