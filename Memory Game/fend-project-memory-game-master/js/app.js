/*
 * Create a list that holds all of your cards
 */


/*
 * Display the cards on the page
 *   - shuffle the list of cards using the provided "shuffle" method below
 *   - loop through each card and create its HTML
 *   - add each card's HTML to the page
 */

// Shuffle function from http://stackoverflow.com/a/2450976
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
let timer = document.getElementById("timer")

function setTime() {
    if (dt == null) {
        dt = new Date();
    }
    let secFromStart = parseInt(((new Date()) - dt) / 1000);
    hours = parseInt(secFromStart / (60 * 60));
    mins = parseInt((secFromStart - (hours * 60 * 60)) / 60);
    secs = parseInt(secFromStart - (hours * 60 * 60) - (mins * 60));
    timer.value = appendZero(hours) + ":" + appendZero(mins) + ":" + appendZero(secs);

    if (!stopTimer) {
        setTimeout(setTime, 1000);
    }
}
document.querySelector('.moves').innerHTML = moves;
init();


let restart = document.querySelector('.restart');
restart.addEventListener('click', function(event) {
    restartGame();
});

function appendZero(val) {
    return (val > 9 ? val : ('0' + val));
}

function init() {
    listOfCards = Array.from(document.querySelectorAll('.card'));
    attachEvents();
    stopTimer = false;
    dt = null;
    setTime();

}

function restartGame() {
    resetCards();
    shuffle(listOfCards);
    listOuterHtml = listOfCards.map(function(card) {
        return card.outerHTML;
    })
    document.querySelector('.deck').innerHTML = listOuterHtml.join('');
    init();
}

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

function attachEvents() {
    listOfCards.forEach(function(card) {
        card.addEventListener('click', function(event) {
            if (!card.classList.contains('match') && !(card === previousOpenCard) && !twoCardsOpen) {
                moves++;
                starRating();
            }
            document.querySelector('.moves').innerHTML = moves;
            if (twoCardsOpen || card === previousOpenCard || card.classList.contains('match')) {
                return;
            }
            card.classList.add('open', 'show');
            if (previousOpenCard) {
                let prevCardCopy = previousOpenCard;
                twoCardsOpen = true;
                let previouOpenCardArray = Array.from(previousOpenCard.firstElementChild.classList);
                let currentCardArray = Array.from(card.firstElementChild.classList);
                let isMatch = arrayEquals(previouOpenCardArray, currentCardArray);
                if (isMatch) {
                    card.classList.add('match');
                    prevCardCopy.classList.add('match');
                    twoCardsOpen = false;
                    numberOfMatchedCards += 2;
                    if (numberOfMatchedCards == listOfCards.length) {
                        stopTimer = true;
                        openModalBox();
                    }
                } else {
                    card.classList.add('mismatch');
                    prevCardCopy.classList.add('mismatch');
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

function arrayEquals(a, b) {
    return (a.length === b.length && a.every((value, index) => value === b[index]));
}
/*
 * set up the event listener for a card. If a card is clicked:
 *  - display the card's symbol (put this functionality in another function that you call from this one)
 *  - add the card to a *list* of "open" cards (put this functionality in another function that you call from this one)
 *  - if the list already has another card, check to see if the two cards match
 *    + if the cards do match, lock the cards in the open position (put this functionality in another function that you call from this one)
 *    + if the cards do not match, remove the cards from the list and hide the card's symbol (put this functionality in another function that you call from this one)
 *    + increment the move counter and display it on the page (put this functionality in another function that you call from this one)
 *    + if all cards have matched, display a message with the final score (put this functionality in another function that you call from this one)
 */