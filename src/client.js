'use strict';

const { Socket } = require('dgram');
const readline = require('readline');
const io = require('socket.io-client');
const host = 'http://localhost:3333';
const tak = io.connect(host);


const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

let firstPlayer = false;

tak.on('connect', () => {
  rl.question('Enter your player name', (yourName) => {
    console.log(`Welcome ${yourName}`);
    // rl.close();
    tak.emit('createGame', yourName);
  });
})

tak.on('newGame', room => {
  console.log(`Waiting for player 2 to join ${room}`);
})

tak.on('results', payload => {
  if (payload === 'draw') {
    console.log('It was a tie');
  } else if (payload === true) {
    console.log('Player One Won');
  } else {
    console.log('Player two won');
  }
})

tak.on('startgame', (player) => {
  rl.question('Please enter rock, paper, or scissor', choice => {
    console.log(choice);
    console.log(player);
    tak.emit('results', { choice, player });
  });
})

tak.emit('tikTak');
tak.emit('received', messageReceived);

function messageReceived() {
  console.log('Got it');
}

rl.on('close', () => {
  console.log('Closing prompt');
  process.exit(0);
})