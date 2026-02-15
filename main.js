const dealerTotal=document.getElementById("dealer-total");
const playerTotal=document.getElementById("player-total");
const dealerCards=document.getElementById("dealer-cards");
const playerCards=document.getElementById("player-cards");
const hitButton=document.getElementById("hit-button");
const standButton=document.getElementById("stand-button");
const newGameButton=document.getElementById("new-game-button");
const betAmountInput=document.getElementById("bet-amount");
const balanceDisplay=document.getElementById("balance");
const playButton=document.getElementById("play-button");
let deck=[];
let playerHand=[];
let dealerHand=[];
let balance=1000;
hitButton.disabled=true;
standButton.disabled=true;

function createDeck(){
    const suits=["rosu","romb","trefla","negru"];
    const values=["2","3","4","5","6","7","8","9","10","J","Q","K","A"];
    for(let suit of suits){
        for(let value of values){
            deck.push({suit,value,image:`cards/${suit}${value}.png`});
        }
    }
}
function shuffleDeck(){
    for(let i=deck.length-1;i>0;i--){
        const j=Math.floor(Math.random()*(i+1));
        [deck[i],deck[j]]=[deck[j],deck[i]];
    }
}

newGameButton.addEventListener("click",()=>{
    let balance=1000;
    newGameButton.style.border="2px solid rgb(204, 207, 16)";
    balanceDisplay.textContent=`Balance: $${balance}`;
    betAmountInput.value=0;
});

playButton.addEventListener("click",()=>{
    const betAmount=parseInt(betAmountInput.value);
    if(balance<=0){
        disableButtons();
        newGameButton.style.border="2px solid red";
        return;
    }
    if(betAmount>balance){
        betAmountInput.value=0;
        betAmountInput.style.border="2px solid red";
        return;
    }
    else if(betAmount<=0){
        betAmountInput.value=0;
        betAmountInput.style.border="2px solid red";
        return;
    }
    playButton.disabled=true;
    betAmountInput.style.border="2px solid rgb(204, 207, 16)";
    balance-=betAmount;
    balanceDisplay.textContent=`Balance: $${balance}`;
    deck=[];
    playerHand=[];
    dealerHand=[];
    createDeck();
    shuffleDeck();
    playerHand.push(deck.pop());
    playerHand.push(deck.pop());
    dealerHand.push(deck.pop());
    updateUI();
});

hitButton.addEventListener("click",hitCard);
standButton.addEventListener("click",stand);

function updateUI(){
    dealerCards.innerHTML="";
    playerCards.innerHTML="";
    for(let card of playerHand){
        const img=document.createElement("img");
        img.src=card.image;
        playerCards.appendChild(img);
    }
    for(let card of dealerHand){
        const img=document.createElement("img");
        img.src=card.image;
        dealerCards.appendChild(img);
    }
    dealerTotal.textContent=`${calculateTotal(dealerHand)}`;
    playerTotal.textContent=`${calculateTotal(playerHand)}`;
    if(calculateTotal(playerHand)===21){
        disableButtons();
    }else if(calculateTotal(playerHand)>21){
        disableButtons();
    }else{
        hitButton.disabled=false;
        standButton.disabled=false;
    }
}

function hitCard(){
    playerHand.push(deck.pop());
    updateUI();
    if(calculateTotal(playerHand)>21){
        balance-=parseInt(betAmountInput.value);
        balanceDisplay.textContent=`Balance: $${balance}`;
        disableButtons();
    }
    else if(calculateTotal(playerHand)===21){
        balance+=parseInt(betAmountInput.value)*2;
        balanceDisplay.textContent=`Balance: $${balance}`;
        disableButtons();
    }
}
function stand(){
    while(calculateTotal(dealerHand)<17){
        dealerHand.push(deck.pop());
    }
    updateUI();
    const playerTotalValue=calculateTotal(playerHand);
    const dealerTotalValue=calculateTotal(dealerHand);
    if(dealerTotalValue>21||playerTotalValue>dealerTotalValue){
        balance+=parseInt(betAmountInput.value)*2;
        balanceDisplay.textContent=`Balance: $${balance}`;
    }else if(playerTotalValue<dealerTotalValue){
        balance-=parseInt(betAmountInput.value);
        balanceDisplay.textContent=`Balance: $${balance}`;
    }else{
        balance+=parseInt(betAmountInput.value);
        balanceDisplay.textContent=`Balance: $${balance}`;
    }
    disableButtons();
}   

function calculateTotal(hand){
    let total=0;
    let aces=0;
    for(let card of hand){
        if(card.value==="J"||card.value==="Q"||card.value==="K"){
            total+=10;
        }else if(card.value==="A"){
            aces++;
            total+=11;
        }else{
            total+=parseInt(card.value);
        }
    }
    while(total>21&&aces>0){
        total-=10;
        aces--;
    }
    return total;
}

function disableButtons(){
    hitButton.disabled=true;
    standButton.disabled=true;
    playButton.disabled=false;
}
