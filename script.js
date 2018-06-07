'use strict';

// Winner Status Enum
let winnerStatus = Object.freeze({ Dealer: 0, Player: 1, Draw: 2 });

// Card variables
let suits = ['Hearts', 'Clubs', 'Diamonds', 'Spades'],
    values = ['Ace', 'King', 'Queen', 'Jack',
    'Nine', 'Eight', 'Seven', 'Six',
    'Five', 'Four', 'Three', 'Two'];

// DOM variables
let textArea = document.getElementById('text-area'),
    newGameButton = document.getElementById('new-game-button'),
    hitButton = document.getElementById('hit-button'),
    stayButton = document.getElementById('stay-button');

// Game variables
let gameStarted = false,
    gameOver = false,
    winner = null,
    dealerCards = [],
    playerCards = [],
    dealerScore = 0,
    playerScore = 0,
    deck = [];

hitButton.style.display = 'none';
stayButton.style.display = 'none';
ShowStatus();

function NewGame() {
    gameStarted = true;
    gameOver = false;
    winner = null;

    deck = CreateDeck();
    ShuffleDeck(deck);
    dealerCards = [ GetNextCard(), GetNextCard() ];
    playerCards = [ GetNextCard(), GetNextCard() ];

    newGameButton.style.display = 'none';
    hitButton.style.display = 'inline';
    stayButton.style.display = 'inline';

    if (GetScore(playerCards) === 21) {
        Stay();
    } else {
        ShowStatus();
    }
}

function Hit() {
    playerCards.push(GetNextCard());
    CheckForEndOfGame();
    ShowStatus();
}

function Stay() {
    gameOver = true;
    CheckForEndOfGame();
    ShowStatus();
}

function CreateDeck() {
    let deck = [];
    for (let suitIdx = 0; suitIdx < suits.length; suitIdx++) {
        for (let valueIdx = 0; valueIdx < values.length; valueIdx++) {
            let card = {
                suit: suits[suitIdx],
                value: values[valueIdx]
            };
            deck.push(card);
        }
    }
    return deck;
}

function ShuffleDeck(deck) {
    for (let i = 0; i < deck.length; i++) {
        let swapIdx = Math.trunc(Math.random() * deck.length);
        let tmp = deck[swapIdx];
        deck[swapIdx] = deck[i];
        deck[i] = tmp;
    }
}

function GetCardString(card) {
    return `${card.value} of ${card.suit}`;
}

function GetCard(card) {
    let styledCard = `<div class="card ${GetCardStylingValue(card)} card-${card.suit.toLowerCase()}"><span></span></div>`;
    return styledCard;
}

function GetNextCard() {
    return deck.shift();
}

function GetCardNumericValue(card) {
    switch(card.value) {
        case 'Ace':
            return 1;
        case 'Two':
            return 2;
        case 'Three':
            return 3;
        case 'Four':
            return 4;
        case 'Five':
            return 5;
        case 'Six':
            return 6;
        case 'Seven':
            return 7;
        case 'Eight':
            return 8;
        case 'Nine':
            return 9;
        default:
            return 10;
    }
}

function GetCardStylingValue(card) {
    switch(card.value) {
        case 'Ace':
            return 'card-a';
        case 'Two':
            return 'card-2';
        case 'Three':
            return 'card-3';
        case 'Four':
            return 'card-4';
        case 'Five':
            return 'card-5';
        case 'Six':
            return 'card-6';
        case 'Seven':
            return 'card-7';
        case 'Eight':
            return 'card-8';
        case 'Nine':
            return 'card-9';
        case 'Jack':
            return 'card-j';
        case 'Queen':
            return 'card-q';
        case 'King':
            return 'card-k';
        default:
            return '';
    }
}

function GetScore(cards) {
    let score = 0;
    let hasAce = false;
    for (let i = 0; i < cards.length; i++) {
        let card = cards[i];
        score += GetCardNumericValue(card);
        if (card.value === 'Ace') {
            hasAce = true;
        }
    }
    if (hasAce && score + 10 <= 21) {
        return score + 10;
    }
    return score;
}

function UpdateScores() {
    dealerScore = GetScore(dealerCards);
    playerScore = GetScore(playerCards);
}

function CheckForEndOfGame() {
    UpdateScores();
    if (gameOver) {
        while(dealerScore < playerScore
                && playerScore <= 21
                && dealerScore <= 21) {
            dealerCards.push(GetNextCard());
            UpdateScores();
        }
    }

    if (playerScore > 21) {
        winner = winnerStatus.Dealer;
        gameOver = true;
    } else if (dealerScore > 21) {
        winner = winnerStatus.Player;
        gameOver = true;
    } else if (gameOver) {
        if (playerScore > dealerScore) {
            winner = winnerStatus.Player;
        } else if (playerScore === dealerScore) {
            winner = winnerStatus.Draw;
        } else {
            winner = winnerStatus.Dealer;
        }
    }
}

function ShowStatus() {
    if (!gameStarted) {
        textArea.innerHTML = 'Welcome to Blackjack!';
        return;
    }

    let dealerCardString = '';
    for (let i = 0; i < dealerCards.length; i++) {
        dealerCardString += GetCard(dealerCards[i]) + '\n';
    }

    let playerCardString = '';
    for (let i = 0; i < playerCards.length; i++) {
        playerCardString += GetCard(playerCards[i]) + '\n';
    }

    UpdateScores();

    textArea.innerHTML = 
    '<p>Dealer has:</p>' +
    dealerCardString +
    '<p>(score: ' + dealerScore + ')</p>' +

    '<p>Player has:\n</p>' +
    playerCardString +
    '<p>(score: ' + playerScore + ')</p>';

    CheckForEndOfGame();

    if (gameOver) {
        if (winner === winnerStatus.Player) {
            textArea.innerHTML += "YOU WIN!";
        } else if (winner === winnerStatus.Dealer) {
            textArea.innerHTML += "DEALER WINS";
        } else {
            textArea.innerHTML += "IT'S A DRAW";
        }
        newGameButton.style.display = 'inline';
        hitButton.style.display = 'none';
        stayButton.style.display = 'none';
    }
}