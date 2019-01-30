import React from 'react';
import Page from './resources/snake_templ.html';
import $ from 'jquery';
const htmlDoc = {__html: Page};

export default class Snake extends React.Component {
  constructor(props){
    super(props);
  }

  componentDidMount() {
    let gameTimer;
    let difficultyModifier = 2;
    let score = 0;
    let bestScore = 0;
    const canvas = document.getElementById("field");
    const difficultyControls = document.getElementsByClassName('difficulty');
    const ctx = canvas.getContext("2d");
    const snakeGreen = '#00FF00';
    const appleRed = '#FF0000';
    const poisonYellow = '#FFFF33';
    const backgroundBlack = '#000'
    let snakeCoordX = 10;
    let snakeCoordY = 10;
    let gridSize = 20;
    let tileCount = 20;
    let appleX = 15;
    let appleY = 15;
    let poison1X, poison1Y, poison2X, poison2Y, poison3X, poison3Y;
    let horizSpeed = 0;
    let vertSpeed = 0;
    const trail = [];
    let tail = 5;
    const updateScore = (newScore) => {
      switch (difficultyModifier) {
        case "1":
          score += 3;
          break;
        case "3":
          score += 1;
          break;
        default: 
          score += 2;
          break;
      }
      const scoreArea = $('#score');
      const highscoreArea = $('#highscore');
      scoreArea.html(`Score: ${score}`);
      bestScore > highscore
        ? highscoreArea.html(`Highest Score is now: ${bestScore}!`)
        : highscoreArea.html(`Highest Score: ${bestScore}.`)
    };

    const getColor = () => {
      const rgbVals = [];
      for (let i = 0; i < 3; i++) {
        rgbVals.push(Math.floor(Math.random() * Math.floor(256)));
      }
      return `rgba(${rgbVals[0]},${rgbVals[1]},${rgbVals[2]})`
    }
    
    const keyPush = (e) => {
      getColor()
      switch(e.keyCode) {
        case 37:
          horizSpeed = -1;
          vertSpeed = 0;
          break;
        case 38:
          horizSpeed = 0;
          vertSpeed = -1;
          break;
        case 39:
          horizSpeed = 1;
          vertSpeed = 0;
          break;
        case 40:
          horizSpeed = 0;
          vertSpeed = 1;
          break;
      }
    }

    const checkPoison = () => {
      let isPoisonApple = false;
      if (snakeCoordX == poison1X && snakeCoordY == poison1Y ||
          snakeCoordX == poison2X && snakeCoordY == poison2Y ||
          snakeCoordX == poison3X && snakeCoordY == poison3Y) {
        poisonSnake();
      }
      return isPoisonApple
    }

    const poisonSnake = () => {
      score = 0;
      tail = 5;
      updateScore(score);
    }

    const placePoison = (p1, p2, p3) => {
      const [poison1X, poison1Y] = p1;
      const [poison2X, poison2Y] = p2;
      const [poison3X, poison3Y] = p3;
      ctx.fillStyle = poisonYellow;  
      ctx.fillRect(poison1X * gridSize, poison1Y * gridSize, gridSize - 2, gridSize - 2);
      ctx.fillRect(poison2X * gridSize, poison2Y * gridSize, gridSize - 2, gridSize - 2);
      ctx.fillRect(poison3X * gridSize, poison3Y * gridSize, gridSize - 2, gridSize - 2);
    }

    const placeApple = (appleX, appleY) => {
      ctx.fillStyle = appleRed; 
      ctx.fillRect(appleX * gridSize, appleY * gridSize, gridSize - 2, gridSize - 2);
    }

    const changeDifficulty = (level) => {
      difficultyModifier = level;
      console.log(difficultyModifier)
      clearInterval(gameTimer);
      gameTimer = setInterval(game, level * 100);
    }

    const generateCoordinates = (n) => {
      const coords = [];
      for (let i = 0; i < n; i++) {
        let c = Math.floor((Math.random() * tileCount));
        coords.push(c);
      }
      return coords
    }

    document.addEventListener("keydown", keyPush);
    for (let i = 0; i < document.getElementsByClassName('difficulty').length; i++){
      console.log(difficultyControls[i])
      difficultyControls[i].onclick = function() {
        changeDifficulty(difficultyControls[i].dataset.difficulty);
      }
    }
    gameTimer = setInterval(game, 200);
    if (!!localStorage.getItem('highscore')) {
      bestScore = localStorage.getItem('highscore');
    }
    
    const game = () => {
      snakeCoordX += horizSpeed;
      snakeCoordY += vertSpeed;
      if (snakeCoordX < 0) snakeCoordX = tileCount - 1;
      if (snakeCoordX > tileCount - 1) snakeCoordX = 0;
      if (snakeCoordY < 0) snakeCoordY = tileCount - 1;
      if (snakeCoordY > tileCount - 1) snakeCoordY = 0;
    
      ctx.fillStyle = backgroundBlack; 
      ctx.fillRect(0,0,canvas.width,canvas.height);
      ctx.fillStyle = snakeGreen; 
      
      for (let i = 0; i < trail.length; i++) {
        
        if (trail.length > 7) {  
          let colorString = getColor();
          ctx.fillStyle = colorString;
        }

        ctx.fillRect(trail[i].x * gridSize, trail[i].y * gridSize, gridSize - 2, gridSize - 2)
        if (trail[i].x == snakeCoordX && trail[i].y == snakeCoordY) {
          score = 0;
          updateScore(score);
          tail = 5;
        }
      }

      trail.push({x: snakeCoordX, y: snakeCoordY});
      while (trail.length > tail) {
        trail.shift();
      }

      if (appleX == snakeCoordX && appleY == snakeCoordY) {
        tail++;
        if (score > bestScore){
          bestScore = score;
          localStorage.setItem('highscore', bestScore);
        }
        updateScore(10 * (1 / difficultyModifier));
        [appleX, appleY] = generateCoordinates(2);
        [poison1X, poison1Y, poison2X, poison2Y, poison3X, poison3Y] = generateCoordinates(6);
      } else {
        checkPoison();
      }

      placeApple(appleX, appleY);
      placePoison([poison1X, poison1Y], [poison2X, poison2Y], [poison3X, poison3Y]);
    }
  }
  // convert this to state / templ within this component. This hybrid approach makes no sense.
  render(){
     return (<div dangerouslySetInnerHTML={htmlDoc} />)
  }
}