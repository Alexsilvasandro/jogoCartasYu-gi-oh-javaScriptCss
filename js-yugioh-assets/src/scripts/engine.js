const state = {
    scores: {
        playerScore: 0,
        computerScore: 0,
        score_box: document.getElementById("score_pointer"),
    },
    cardSprites: {
        avatar: document.getElementById("card-image"),
        name: document.getElementById("card-name"),
        type: document.getElementById("card-type"),
    },
    fieldCards: {
        // usar os ids que existem no HTML: player-field-card / computer-field-card
        player: document.getElementById("player-field-card"),
        computer: document.getElementById("computer-field-card"),
    },

    playerSides: {
        player1: "player-card",
        computer: "computer-card",
        player1Box: document.querySelector("#player-card"),
        computerBox: document.querySelector("#computer-card"),
    },

    actions: {
        button: document.getElementById("btn"),

    },
};



const pathImages = "./src/assets/icons/";
const cardData = [
    {
        id: 0,
        name: "Blue-Eyes White Dragon",
        type: "Paper",
        image: `${pathImages}dragon.png`,
        WinOf: [1],
        LoseOf: [2],
    },

    {
        id: 1,
        name: "Dark Magician",
        type: "Rock",
        image: `${pathImages}magician.png`,
        WinOf: [2],
        LoseOf: [0],
    },
    {
        id: 2,
        name: "Exodia",
        type: "Scissors",
        image: `${pathImages}exodia.png`,
        WinOf: [0],
        LoseOf: [1],
    },
];

async function createCardImage(cardId, fieldSide) {

    const cardImage = document.createElement("img");
    cardImage.setAttribute("height", "100px");
    cardImage.setAttribute("src", "./src/assets/icons/card-back.png");
    cardImage.setAttribute("data-id", cardId);
    cardImage.classList.add("card");
    if (fieldSide === state.playerSides.player1) {

        cardImage.addEventListener("mouseover", () => {
            drawSelectCard(cardId);
        });

        cardImage.addEventListener("click", () => {
            setCardsField(cardImage.getAttribute("data-id"));
        });
    }

    return cardImage;


}

async function getRandomCardId() {
    const randomIndex = Math.floor(Math.random() * cardData.length);
    return cardData[randomIndex].id;
}

async function setCardsField(cardId) {
    await removeAllCardsImages();
    let computerCardId = await getRandomCardId();

    await ShowHiddenCardFieldsImages(true);
    await hiddenCardDetails();
    await drawCardsInField(cardId, computerCardId);


    let duelResults = await checkDuelResults(cardId, computerCardId);

    await updateScores();
    await drawButton(duelResults);


}
async function drawCardsInField(cardId, computerCardId) {
    state.fieldCards.player.src = cardData[cardId].image;
    state.fieldCards.computer.src = cardData[computerCardId].image;
}

async function ShowHiddenCardFieldsImages(value) {
    if (value === true) {
        state.fieldCards.player.style.display = "block";
        state.fieldCards.computer.style.display = "block";
    }

    if (value === false) {
        state.fieldCards.player.style.display = "none";
        state.fieldCards.computer.style.display = "none";
    }
}

async function hiddenCardDetails() {
    state.cardSprites.avatar.src = "";
    state.cardSprites.name.innerText = "";
    state.cardSprites.type.innerText = "";
    state.actions.button.style.display = "none";
}


async function drawButton(text) {
    state.actions.button.innerText = text.toUpperCase();
    state.actions.button.style.display = "block";

}

async function updateScores() {
    state.scores.score_box.innerText = `win: ${state.scores.playerScore} | 
    lose: ${state.scores.computerScore}`;
}


async function checkDuelResults(playerCardId, computerCardId) {
    let duelResults = "Draw";
    let playerCard = cardData[playerCardId];
    if (playerCard.WinOf.includes(computerCardId)) {
        duelResults = "win";
        await playAudio(duelResults);
        state.scores.playerScore++;
    }
    if (playerCard.LoseOf.includes(computerCardId)) {
        duelResults = "lose";
        await playAudio(duelResults);
        state.scores.computerScore++;
    }
    return duelResults;


}

async function removeAllCardsImages() {
    let cards = state.playerSides.computerBox;
    let imageElements = cards.querySelectorAll("img");
    imageElements.forEach((img) => img.remove());

    cards = state.playerSides.player1Box;
    imageElements = cards.querySelectorAll("img");
    imageElements.forEach((img) => img.remove());

}

async function drawSelectCard(index) {
    state.cardSprites.avatar.src = cardData[index].image;
    state.cardSprites.name.innerText = cardData[index].name;
    state.cardSprites.type.innerText = "attribute: " + cardData[index].type;



}

async function drawCard(numCards, fieldSide) {

    for (let i = 0; i < numCards; i++) {
        const randomIdCard = await getRandomCardId();
        const cardImage = await createCardImage(randomIdCard, fieldSide);

        document.getElementById(fieldSide).appendChild(cardImage);
    }
}

async function resetDuel() {
    state.cardSprites.avatar.src = "";
    state.actions.button.style.display = "none";
    state.fieldCards.player.style.display = "none";
    state.fieldCards.computer.style.display = "none";
    init();
}
async function playAudio(status) {
    const audio = new Audio(`./src/assets/audios/${status}.wav`);

    audio.play();

}



function init() {
    // desenha cartas para jogador e computador.
    ShowHiddenCardFieldsImages(false);
    drawCard(5, state.playerSides.player1);
    drawCard(5, state.playerSides.computer);
    const bgm = document.getElementById("bgm");
    bgm.play();

}
init();


