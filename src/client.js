"use strict";

const { Socket } = require("dgram");
const readline = require("readline");
const io = require("socket.io-client");
const host = "http://localhost:3333";
const tak = io.connect(host);

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

let firstPlayer = false;

tak.on("connect", () => {
  rl.question("Enter your player name: ", (yourName) => {
    console.log(`Welcome ${yourName}`);
    tak.emit("createGame", yourName);
  });
});

tak.on("draw", () => {
  console.log("You both tied");
  rl.question("Want to play again? Yes or no? ", (response) => {
    if (response === "yes") {
      tak.emit("restart");
    } else {
      rl.close();
    }
  });
});

tak.on("player1", (name) => {
  console.log(`Player ${name} wins!`);
  rl.question("Want to play again? Yes or no? ", (response) => {
    if (response === "yes") {
      tak.emit("restart", name);
    } else {
      rl.close();
    }
  });
});

tak.on("player2", (name) => {
  console.log(`Player ${name} wins!`);
  rl.question("Want to play again? Yes or no? ", (response) => {
    if (response === "yes") {
      tak.emit("restart", name);
    } else {
      rl.close();
    }
  });
});

tak.on("startgame", (player) => {
  rl.question("Please enter rock, paper, or scissor: ", (choice) => {
    console.log(`You chose ${choice}`);
    console.log(player);
    tak.emit("results", { choice, player });
  });
});

rl.on("close", () => {
  console.log("Thanks for playing, bye bye");
  process.exit(0);
});
