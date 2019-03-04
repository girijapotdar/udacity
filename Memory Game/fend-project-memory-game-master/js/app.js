//Variable declaration
let previousOpenCard;
let twoCardsOpen = false;
let listOfCards;
let moves = 0;
let numberOfMatchedCards = 0;
let noOfStars = 3;
let dt = null;
let hours;
let mins;
let secs;
let stopTimer = true;
let isTimerStarted = false;
let timer = document.getElementById("timer");
document.querySelector('.moves').innerHTML = moves;

//Call to start the game
init();


// Shuffle the list of cards 
function shuffle(array) {
    var currentIndex = array.length,
        temporaryValue, randomIndex;

    while (currentIndex !== 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }

    return array;
}

//Start the timer
function setTime() {
    if (dt == null) {
        dt = new Date();
    }
    let secFromStart = parseInt(((new Date()) - dt) / 1000);
    hours = parseInt(secFromStart / (60 * 60));
    mins = parseInt((secFromStart - (hours * 60 * 60)) / 60);
    secs = parseInt(secFromStart - (hours * 60 * 60) - (mins * 60));
    timer.value = appendZero(hours) + ":" + appendZero(mins) + ":" + appendZero(secs);

    if (isTimerStarted) {
        setTimeout(setTime, 1000);
    }
}


let restart = document.querySelector('.restart');
restart.addEventListener('click', function(event) {
    restartGame();
});

function appendZero(val) {
    return (val > 9 ? val : ('0' + val));
}

//Function to start a new game
function init() {
    listOfCards = Array.from(document.querySelectorAll('.card'));
    //added shuffle in init code to reshuffle the game every time it starts
    shuffle(listOfCards);
    listOuterHtml = listOfCards.map(function(card) {
        return card.outerHTML;
    })
    document.querySelector('.deck').innerHTML = listOuterHtml.join('');
    listOfCards = Array.from(document.querySelectorAll('.card'));
    attachEvents();
    isTimerStarted = false;
    stopTimer = false;
    dt = null;
    setTime();
}
//On click of restart icon, the game resets and starts a new game
function restartGame() {
    resetCards();
    // shuffle(listOfCards);
    // listOuterHtml = listOfCards.map(function(card) {
    //     return card.outerHTML;
    // })
    // document.querySelector('.deck').innerHTML = listOuterHtml.join('');
    init();
}

//Opens popup on win displaying the score(star rating, moves, duration)
function openModalBox() {
    let modal = document.getElementById('myModal');
    let span = document.getElementsByClassName("close")[0];
    modal.style.display = "block";
    document.getElementById('score-card').innerHTML = `<h3> With ${moves} Moves and ${noOfStars} Stars in ${timer.value}! </h3>`;
    span.onclick = function() {
        restartGame();
        modal.style.display = "none";
    }
    document.getElementById('play-button').addEventListener('click', function(event) {
        restartGame();
        modal.style.display = "none";
    });
    window.onclick = function(event) {
        if (event.target == modal) {
            modal.style.display = "none";
        }
    }
}
//Attach click event to list element in the DOM
function attachEvents() {
    listOfCards.forEach(function(card) {
        //set up the event listener for a card. If a card is clicked
        card.addEventListener('click', function(event) {
            if (!isTimerStarted) {
                dt = null;
                isTimerStarted = true;
                setTime();

            }

            //When the cards do not match
            if (!card.classList.contains('match') && !(card === previousOpenCard) && !twoCardsOpen) {
                moves++;
                starRating();
            }
            document.querySelector('.moves').innerHTML = moves;
            //Return if 1: Check if trying to click the third card when two cards are open 
            //2: Or Check if the same card is already clicked
            //3: Or the matched card is clicked

            if (twoCardsOpen || card === previousOpenCard || card.classList.contains('match')) {
                return;
            }
            card.classList.add('open', 'show');
            //Check if the card clicked is a previous card
            if (previousOpenCard) {
                let prevCardCopy = previousOpenCard;
                twoCardsOpen = true;
                //Check the classes of two opened cards. 
                //If match then add the 'match' class, stop the timer, open win popup 
                let previouOpenCardArray = Array.from(previousOpenCard.firstElementChild.classList);
                let currentCardArray = Array.from(card.firstElementChild.classList);
                let isMatch = arrayEquals(previouOpenCardArray, currentCardArray);
                if (isMatch) {
                    card.classList.add('match');
                    prevCardCopy.classList.add('match');
                    twoCardsOpen = false;
                    numberOfMatchedCards += 2;
                    if (numberOfMatchedCards == listOfCards.length) {
                        isTimerStarted = false;
                        stopTimer = true;
                        openModalBox();
                    }
                    //If no match, add mismatch class to indicate user that there is a mismatch
                } else {
                    card.classList.add('mismatch');
                    prevCardCopy.classList.add('mismatch');
                    //after a second remove the classes applied 
                    setTimeout(function() {
                        card.classList.remove('open', 'show', 'mismatch');
                        prevCardCopy.classList.remove('open', 'show', 'mismatch');
                        twoCardsOpen = false;
                    }, 1000);
                }
                previousOpenCard = null;
            } else {
                previousOpenCard = card;
            }
        });
    });

}
//Calculate star rating depending on the moves
function starRating() {
    if (moves > 40) {
        document.querySelector('.stars').children[2].style.display = 'none';
        document.querySelector('.stars').children[1].style.display = 'none';
        noOfStars = 1;
    } else if (moves > 20 && moves <= 40) {
        document.querySelector('.stars').children[2].style.display = 'none';
        noOfStars = 2;
    }
}
// Reset cards to original state, clear moves and rating
function resetCards() {
    listOfCards.forEach(function(card) {
        card.classList.remove('open', 'show', 'match', 'mismatch');
    });
    for (let i = 0; i < document.querySelector('.stars').children.length; i++) {
        document.querySelector('.stars').children[i].style.display = '';
    }
    noOfStars = 3;
    moves = 0;
    numberOfMatchedCards = 0;
    document.querySelector('.moves').innerHTML = moves;
}

//Compare two array's length and values 
function arrayEquals(a, b) {
    return (a.length === b.length && a.every((value, index) => value === b[index]));
}