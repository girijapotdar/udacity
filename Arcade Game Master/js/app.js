//Variable declaration
const playerStartX = 200;
const playerStartY = 380;
const allEnemies = [];
const enemySmallestX = -100;
const enemyY = [60, 145, 230]
const playerStepSizeX = 100;
const playerStepSizeY = 80;
const enemyStepSize = 5;

//Generate random vaules
function rand(val) {
    return Math.floor(Math.random() * val);
}

//Open modal box on win
function openModalBox() {
    let modal = document.getElementById('myModal');
    let span = document.getElementsByClassName("close")[0];
    modal.style.display = "block";
    span.onclick = function() {
        modal.style.display = "none";
        player.reset();
    }
}

//Enemies our player must avoid
class Enemy {
    constructor(x, y) {
            this.x = x;
            this.y = y;
            this.speed = 0.5 + rand(2);
            this.sprite = 'images/enemy-bug.png';
        }
        //Check if the new x co-ordinate is within the bounds of the smallest x co-ordinate and 500(which is the width of canvas)
    checkWithinBound(newX) {
        return newX >= enemySmallestX && newX <= 500;
    }

    //Update the enemy's position, required method for game
    update(dt) {
            //update new value using x co-ordinate, speed and the step size
            let newX = this.x + this.speed * enemyStepSize;
            //keep updating the x co-ordinate if it is within the bounds
            if (this.checkWithinBound(newX)) {
                this.x = newX;
                //start from the smallest x co-ordinate, random y co-ordinate from enemyY array and speed
            } else {
                this.x = enemySmallestX;
                this.y = enemyY[rand(3)];
                this.speed = 1 + rand(2);
            }
        }
        // Draw the enemy on the screen, required method for game
    render() {
        ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
    }
}

class Player {

    constructor(x, y) {
            this.x = x;
            this.y = y;
            this.disableHandleInput = false;
            this.sprite = 'images/char-boy.png';
        }
        //Checks for possible collision
        //Opens modal box on winning the game and disables the keys so that the player dies not move
    update(dt) {
            let player = this;
            allEnemies.forEach(function(enemy) {
                let withinXScope = enemy.x + 20 > player.x && enemy.x - 20 < player.x;
                let withinYScope = enemy.y + 20 > player.y && enemy.y - 20 < player.y;
                if (withinXScope && withinYScope) {
                    player.reset();
                } else if (player.y == -20) {
                    player.disableHandleInput = true;
                    openModalBox();
                }
            });
        }
        //Enables right,left,top,bottom keys and reset start positions
    reset() {
            player.disableHandleInput = false;
            this.x = playerStartX;
            this.y = playerStartY;
        }
        // Draw the player on the screen, required method for game
    render() {
        ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
    }

    checkWithinBound(newX, newY) {
            return newX >= 0 && newX <= 400 && newY >= -80 && newY <= 450;
        }
        //update the player position on the screen on click of left,right,top,down keys
    handleInput(actionStr) {
        if (this.disableHandleInput) {
            return;
        }
        let newX = this.x;
        let newY = this.y;
        switch (actionStr) {
            case 'left':
                newX -= playerStepSizeX;
                break;
            case 'right':
                newX += playerStepSizeX;
                break;
            case 'up':
                newY -= playerStepSizeY;
                break;
            case 'down':
                newY += playerStepSizeY;
                break;
        }

        if (this.checkWithinBound(newX, newY)) {
            this.x = newX;
            this.y = newY;
        }
    }
}
// This listens for key presses and sends the keys to your

document.addEventListener('keyup', function(e) {
    var allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down'
    };

    if (!allowedKeys[e.keyCode]) {
        return;
    }

    player.handleInput(allowedKeys[e.keyCode]);
});

allEnemies.push(new Enemy(enemySmallestX, enemyY[rand(3)]));
allEnemies.push(new Enemy(enemySmallestX + 30, enemyY[rand(3)]));
allEnemies.push(new Enemy(enemySmallestX + 50, enemyY[rand(3)]));
const player = new Player(playerStartX, playerStartY);