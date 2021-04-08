'use strict';

const express = require('express');
const app = express();

const port = 3333;

const server = app.listen(port, () => {
  console.log(`Server is up on ${port}`)
});

const io = require('socket.io')(server);

let playerOne = null;
let playerTwo = null;

let choiceOne = null;
let choiceTwo = null;


function getWinner(result, playerOne, playerTwo) {
  if (result === 'draw') {
    console.log('It was a tie');
    io.emit('draw');
  } else if (result === true) {
    console.log('Player One Won');
    io.emit('player1', playerOne);

  } else {
    console.log('Player two won');
    io.emit('player2', playerTwo);
  }
}


function compare(c1, c2) {
  if (c1 === c2) {
    return 'draw';
  } else if (c1 === 'rock') {
    if (c2 === 'paper') {
      return false;
    } else {
      return true;
    }
  } else if (c1 === 'paper') {
    if (c2 === 'scissor') {
      return false;
    } else {
      return true;
    }
  } else if (c1 === 'scissor') {
    if (c2 === 'rock') {
      return false;
    } else {
      return true;
    }
  }
}


io.on('connection', (socket) => {
  console.log('Up and running');

  socket.on('tikTak', (data) => {
    console.log('Your in our room');
  })

  socket.on('createGame', yourName => {
    socket.join('gameRoom');
    if (playerOne === null) {
      playerOne = yourName;
    } else {
      playerTwo = yourName;
    }
    if (playerOne && playerTwo) {
      console.log('This should start the game');
      socket.to('gameRoom').emit('startgame', playerOne);
      socket.emit('startgame', playerTwo);
    }
    // socket.emit('newGame', 'gameRoom');
  })

  socket.on('results', payload => {
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
  })


})

