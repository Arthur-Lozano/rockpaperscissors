"use strict";

const readline = require("readline");
const io = require("socket.io-client");
const host = "http://localhost:3333";
const tak = io.connect(host);

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

tak.on("connect", () => {
  console.log('______               _        ______                                _____        _                         _ ');
  console.log('| ___ \\             | |       | ___ \\                              /  ___|      (_)                       | |');
  console.log('| |_/ /  ___    ___ | | __    | |_/ /  __ _  _ __    ___  _ __     \\ `--.   ___  _  ___  ___   ___   _ __ | |');
  console.log("|    /  / _ \\  / __|| |/ /    |  __/  / _` || '_ \\  / _ \\| '__|     `--. \\ / __|| |/ __|/ __| / _ \\ | '__|| |");
  console.log('| |\\ \\ | (_) || (__ |   <  _  | |    | (_| || |_) ||  __/| |    _  /\\__/ /| (__ | |\\__ \\__  \\| (_) || |   |_|');
  console.log('\\_| \\_| \\___/  \\___||_|\\_\\( ) \\_|     \\__,_|| .__/  \\___||_|   ( ) \\____/  \\___||_||___/|___/ \\___/ |_|   (_)');
  console.log('                          |/                | |                |/                                            ');
  console.log('                                            |_|                                                              ')

  console.log('By: Arthur Lozano and Mark Duenas');


  rl.question("Enter your player name: ", (yourName) => {
    console.log(`Welcome ${yourName}`);
    tak.emit("createGame", yourName);
  });
});

tak.on("startgame", (player, socket) => {
  rl.question("Please enter rock, paper, or scissor: ", (choice) => {
    if(choice === 'rock'){
      console.log('    _______');
      console.log('---\'   ____)');
      console.log('      (_____)');
      console.log('      (____)');
      console.log('---.__(___)');
    }
    if(choice === 'paper'){
      console.log('    _______');
      console.log('---\'   ____)____');
      console.log('          ______)');
      console.log('          _______)');
      console.log('         _______)');
      console.log('---.__________)');
    }
    if(choice === 'scissor'){
      console.log('    _______');
      console.log('---\'   ____)____');
      console.log('          ______)');
      console.log('       __________)');
      console.log('      (____)');
      console.log('---.__(___)');
    }
    console.log(`You chose ${choice}`);
    tak.emit("results", { choice, player, socket });
  });

tak.on("winner", (results, p1, p2) => {
  if (results === "draw") {
    console.log("It was a draw! Better luck next time!");
    rl.question("Want to play again? Yes or no? ", (response) => {
      if (response === "yes") {
        tak.emit("restart");
      } else {
        rl.close();
      }
    });
  }
  if (results === true) {
    console.log(`Player ${p1.name} wins!`);
    rl.question("Want to play again? Yes or no? ", (response) => {
      if (response === "yes") {
        tak.emit("restart");
      } else {
        rl.close();
      }
    });
  }
  if (results === false) {
    console.log(`Player ${p2.name} wins!`);
    rl.question("Want to play again? Yes or no? ", (response) => {
      if (response === "yes") {
        tak.emit("restart");
      } else {
        rl.close();
      }
    });
  }
});


  // tak.on("draw", () => {
  //   console.log("You both tied");
  // rl.question("Want to play again? Yes or no? ", (response) => {
  //   if (response === "yes") {
  //     tak.emit("restart");
  //   } else {
  //     rl.close();
  //   }
  // });
  // });

  // tak.on("player1", (name) => {
  //   console.log(`Player ${name} wins!`);
  //   rl.question("Want to play again? Yes or no? ", (response) => {
  //     if (response === "yes") {
  //       tak.emit("restart", name);
  //     } else {
  //       rl.close();
  //     }
  //   });
  // });

  // tak.on("player2", (name) => {
  //   console.log(`Player ${name} wins!`);
  //   rl.question("Want to play again? Yes or no? ", (response) => {
  //     if (response === "yes") {
  //       tak.emit("restart", name);
  //     } else {
  //       rl.close();
  //     }
  //   });
  // });
});

rl.on("close", () => {
  console.log("Thanks for playing, bye bye");
  process.exit(0);
});
