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
let initialCheck=true;
let currentBet = 0;
hitButton.disabled=true;
standButton.disabled=true;
window.onload=()=>{
    balanceDisplay.textContent=`Balance: $${balance}`;
    createDeck();
    shuffleDeck();
}

function createDeck(){
    deck=[];
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

betAmountInput.addEventListener("input", function() {
  this.value = this.value.replace(/\D/g, "");      // remove non-digits
  this.value = this.value.replace(/^0+/, "");      // remove all leading zeros
  if (this.value === "") this.value = "0";         // keep a stable value
});

newGameButton.addEventListener("click",()=>{
    balance=1000;
    initialCheck=true;
    playButton.disabled=false;
    dealerCards.innerHTML="";
    playerCards.innerHTML="";
    dealerTotal.textContent="0";
    playerTotal.textContent="0";
    newGameButton.style.border="2px solid rgb(204, 207, 16)";
    balanceDisplay.textContent=`Balance: $${balance}`;
    betAmountInput.value=0;
    createDeck();
    shuffleDeck();
});

playButton.addEventListener("click",()=>{
    if(!checkBalance()) return;
    if(!verifyBet()) return;

    playButton.disabled=true;
    initialCheck=true;

    playerHand=[];
    dealerHand=[];
    playerHand.push(deck.pop());
    deck.unshift(playerHand[playerHand.length-1]);
    playerHand.push(deck.pop());
    deck.unshift(playerHand[playerHand.length-1]);
    dealerHand.push(deck.pop());
    deck.unshift(dealerHand[dealerHand.length-1]);
    updateUI();
});

function checkBalance(){
    if(balance<=0){
        playButton.disabled=true;
        newGameButton.style.border="2px solid red";
        return false;
    }
    else{
        return true;
    }
}

function verifyBet(){
    const betAmount=parseInt(betAmountInput.value, 10);
    if(Number.isNaN(betAmount) || betAmount<=0){
        betAmountInput.value=0;
        betAmountInput.style.border="2px solid red";
        return false;
    }
    if(betAmount>balance){
      betAmountInput.value = 0;
      betAmountInput.style.border = "2px solid red";
      return false;
    }
    else{
        betAmountInput.style.border="2px solid rgb(204, 207, 16)";
        balance-=betAmount;
        currentBet = betAmount;
        balanceDisplay.textContent=`Balance: $${balance}`;
        return true;
    }};

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

    if(initialCheck){
        initialCheck = false;
        if(playerHand.length===2 && calculateTotal(playerHand)===21){
            stand();
        }else{
            hitButton.disabled=false;
            standButton.disabled=false;
        }
    }
}

hitButton.addEventListener("click",hitCard);
standButton.addEventListener("click",stand);

function hitCard(){
    playerHand.push(deck.pop());
    deck.unshift(playerHand[playerHand.length-1]);

    const playerTotalValue=calculateTotal(playerHand);
    if(playerHand.length>2 && playerTotalValue>21){
        handleResult("player-bust");
    }else if(playerTotalValue===21){
        stand();
    }else{
        hitButton.disabled=false;
        standButton.disabled=false;
    }
    updateUI();
}

function stand(){
    while(calculateTotal(dealerHand)<17){
        dealerHand.push(deck.pop());
        deck.unshift(dealerHand[dealerHand.length-1]);
    }
    const result = checkWin();
    if(result){
        handleResult(result);
    }
    updateUI();
}   

function checkWin(){
    const p = calculateTotal(playerHand);
    const d = calculateTotal(dealerHand);

    if(p>21) return "player-bust";
    if(d>21) return "dealer-bust";

    if(p===21) return "player-win";
    if(d===21) return "dealer-win";

    if(p===d) return "equal";
    return p > d ? "player-win" : "dealer-win";
}

function handleResult(result){
    const bet = (Number.isFinite(currentBet) && currentBet>0) ? currentBet : parseInt(betAmountInput.value, 10);
    switch(result){
        case "player-win":
                balance += bet * 2;
                disableButtons();
                break;
        case "dealer-bust":
                balance += bet * 2;
                disableButtons();
                break;
        case "equal":
                balance += bet;
                disableButtons();
                break;
        case "player-bust":
                disableButtons();
                break;
        case "dealer-win":
                disableButtons();
                break;
        default:
            break;
    }
    if(!checkBalance()){
        balance=0;
        balanceDisplay.textContent=`Balance: $${balance}`;
    }else{
        balanceDisplay.textContent=`Balance: $${balance}`;
    }
    currentBet = 0;
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
