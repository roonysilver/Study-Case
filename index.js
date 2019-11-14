const startButton = document.getElementById("start-button");
const instructions = document.getElementById("instructions-text");
const shooter = document.getElementById('player-controlled-blaster');
const mainPlayArea = document.getElementById("main-play-area");
const monsterImgs = ['images/godd.png', 'images/monster-2.png', 'images/monster-3.png', 'images/monster-4.png', 'images/monster1.png'];
const scoreCounter = document.querySelector('#score span');
// put const to connect with CSS


let justice;
let monsterInterval;

startButton.addEventListener("click", (event) => {
    playGame();
    
  })
  
function letShipFly(event) {
    if (event.key === "ArrowUp") {
        event.preventDefault();
        moveUp();
    } else if (event.key === "ArrowDown") {
        event.preventDefault();
        moveDown();
    } else if (event.key === " ") {
        event.preventDefault();
        fireLaser();
    }
};
// input funtion songoku fly

function moveUp() {
    let topPosition = window.getComputedStyle(shooter).getPropertyValue('top');
    if (shooter.style.top === "0px") {
        return
    } else {
        let position = parseInt(topPosition);
        position -= 10;
        shooter.style.top = `${position}px`;
    }
};
// make songoku fly up. use getComputerStyle to get id from CSS

function moveDown() {
    let topPosition = window.getComputedStyle(shooter).getPropertyValue('top');
    if (shooter.style.top === "440px") {
        return
    } else {
        let position = parseInt(topPosition);
        position += 10;
        shooter.style.top = `${position}px`;
    }
}
// make sogoku fly down.



function fireLaser() {
    let laser = createLaserElement();
    mainPlayArea.appendChild(laser);
    let laserSound = new Audio('audios/laserr.mp3');
    laserSound.play();
    moveLaser(laser);
}
//this is an important funtion. it makes sogoku fire kame. I added audio name laserr in it to make sound when you press.

function createLaserElement() {
    let xPosition = parseInt(window.getComputedStyle(shooter).getPropertyValue('left'));
    let yPosition = parseInt(window.getComputedStyle(shooter).getPropertyValue('top'));
    let newLaser = document.createElement('img');
    newLaser.src ='images/kame.png';
    newLaser.classList.add('laser');
    newLaser.style.left = `${xPosition}px`;
    newLaser.style.top = `${yPosition - 50}px`;
    return newLaser;
};
//create laser element, choose picture and put position where to fired from

function moveLaser(laser) {
    let laserInterval = setInterval(() => {
      let xPosition = parseInt(laser.style.left);
      let monsters = document.querySelectorAll(".monster");
      monsters.forEach(monster => {
        if (checkLaserCollision(laser, monster)) {
        //   monster.src = "images/explosion.png"
        // you can input some explosion images to make explose monster
          monster.classList.remove("monster");
          monster.classList.add("dead-monster");
          scoreCounter.innerText = parseInt(scoreCounter.innerText) + 100;
        }
      })
      if (xPosition === 800) {
        laser.remove();
      } else {
        laser.style.left = `${xPosition + 4}px`;
      }
    }, 2)
  }
//this furntion make laser fly and impact with monster makes them disapear.each impact will make your score increase 100.


function createMonster() {
    let newMonster = document.createElement('img');
    let monsterSpriteImg = monsterImgs[Math.floor(Math.random()*monsterImgs.length)];
    newMonster.src = monsterSpriteImg;
    newMonster.classList.add('monster');
    newMonster.classList.add('monster-transition');
    newMonster.style.left = '840px';
    newMonster.style.top = `${Math.floor(Math.random() * 420) + 30}px`;
    mainPlayArea.appendChild(newMonster);
    moveMonster(newMonster);
  }
  
//create a monster and make them jump out random from right of the screen.

function moveMonster(monster) {
    let moveMonsterInterval = setInterval(() => {
        let xPosition = parseInt(window.getComputedStyle(monster).getPropertyValue('left'));
        if(xPosition <= 50) {
            if (Array.from(monster.classList).includes("dead-monster")) {
            monster.remove();
        } else {
            gameOver();
          }
        } else {
            monster.style.left = `${xPosition - 4}px` ;
        }
    } , 18);
}
//this is where you can make monster fly, it's speed , monter will be removed if they are "dead-monster" 
// or they will win if the reach the left side of screen!

  function checkLaserCollision(laser, monster) {
    let laserLeft = parseInt(laser.style.left);
    let laserTop = parseInt(laser.style.top);
    let laserBottom = laserTop - 5;
    let monsterTop = parseInt(monster.style.top)
    let monsterBottom = monsterTop - 115;
    let monsterLeft = parseInt(monster.style.left);
    if (laserLeft != 800 && laserLeft + 40 >= monsterLeft) {
      if ( (laserTop <= monsterTop && laserTop >= monsterBottom) ) {
        return true
      } else {
        return false
      }
    } else {
      return false
    }
  }
// this function perform between laser and monster, where they meet , radius if they meet. 
// You have to adjust it correctly else it won't be fit with images.

  function gameOver() {
    window.removeEventListener("keydown", letShipFly);
    justice.pause();
    let gameOverSfx = new Audio('audios/oh-no.mp3');
    gameOverSfx.play();
// this is where game stop. music will stop, you cannot move your character anymore. I put an audio when you lose name "oh-no.mo3"
    clearInterval(monsterInterval);
    let monsters = document.querySelectorAll(".monster");
    monsters.forEach(monster => monster.remove());
    let lasers = document.querySelectorAll(".laser");
    lasers.forEach(laser => laser.remove());
    setTimeout(() => {
      alert(`Game Over! The villain Destroyed your house. Your final score is ${scoreCounter.innerText}!`);
      shooter.style.top = "180px";
      startButton.style.display = "block";
      instructions.style.display = "block";
      scoreCounter.innerText = 0;
    }, 1100)
  }
//after you lose. there will stop everything and an alert box will appeare to let you know your score!

  function playGame() {
    startButton.style.display = 'none';
    instructions.style.display = 'none';
    window.addEventListener("keydown", letShipFly);
    justice = new Audio("audios/kaii.mp3");
    justice.play();
    monsterInterval = setInterval(() => { createMonster() }, 2100);
  }
  //call and play game. after you click playgame. 
  // letters inside screen will disappeare, you can move character, music will play and monster will arrive. 