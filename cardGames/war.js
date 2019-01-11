const Player = (name) => { // function keyword or arrow funcs? this binding?
  const playerObj = {
    name: name,
    deck: []
  }
  return playerObj
}

const Deck = function() {
/* 
maybe this accepts an argument so when a player has an array of cards
I can make it a deck object and give it the associated methods like shuffle. 
This would allow for different rule-sets (shuffle before using "won" cards, or not /
multi-deck games / whatever else )
  
*/
  this.cards = [];
  const suits = ['C','D','H','S'];
  for (let cardVal = 1; cardVal <= 13; cardVal++) {
    for (let cardSuit = 0; cardSuit < 4; cardSuit++) {
        const card = `${cardVal}${suits[cardSuit]}`;
        this.cards.push(card);
    }
  }
}

Deck.prototype.shuffle = function() {
  const newArrangement = [];
  while (newArrangement.length < 52) {
    let index = Math.floor(Math.random() * Math.floor(52));
    if (this.cards[index]) {
      newArrangement.push(this.cards[index]);
      this.cards[index] = null;
    }
  }
  this.cards = newArrangement;
}

Deck.prototype.deal = function(p1, p2) {
  p1.deck = this.cards.slice(0, this.cards.length / 2);
  p2.deck = this.cards.slice(this.cards.length / 2, this.cards.length);
}

const Game = function(){
  this.player1 = Player('James');
  this.player2 = Player('Jon');
  deck = new Deck();

  this.report = () => {
    console.log(this.player1.deck, this.player2.deck);
  }

  this.raiseStakes = (initial, additional) => {
    return [...initial, ...additional]
  }

  this.playRound = (c1, c2, stakes = [c1,c2]) => {
    let [c1v, c2v] = [parseInt(c1), parseInt(c2)];
    if (c1v > c2v) {
      this.player1.deck.push(...stakes)
      this.player2.deck.shift();
      this.player1.deck.shift();
      console.log(`Player 1 wins with ${c1} against ${c2} : ${this.player1.deck.length} - ${this.player2.deck.length}`);
    }
    if (c1v < c2v) {
      this.player2.deck.push(...stakes);
      this.player2.deck.shift();
      this.player1.deck.shift();  
      console.log(`Player 2 wins with ${c2} against ${c1} : ${this.player2.deck.length} - ${this.player1.deck.length}`);
    }
    if (c1v === c2v) {
      let warStakes = [];
      let p1warCard;
      let p2warCard;
      // this.player1.deck.push(this.player1.deck.shift())
      // this.player2.deck.push(this.player2.deck.shift());
      if (this.player1.deck.length <= 3) {
        warStakes = [...stakes, ]
      } else if (this.player2.deck.length <= 3) {

      } else {
        warStakes = [...stakes, ...this.player1.deck.slice(0, 3), ...this.player2.deck.slice(0, 3)];
        this.player1.deck = this.player1.deck.slice(3, this.player1.deck.length);
        this.player2.deck = this.player2.deck.slice(3, this.player2.deck.length);
        console.log(`WAR! ${warStakes} at stake. P1: ${this.player1.deck[0]} - P2: ${this.player2.deck[0]}`);
        this.playRound(this.player1.deck[0], this.player2.deck[0], warStakes);
      }
      
    }
    return
  }

  this.startGame = () => {
    deck.shuffle();
    deck.deal(this.player1, this.player2);
    while (this.player1.deck.length > 0) {
      if (this.player1.deck.length >= 52) return this.player1.name
      this.playRound(this.player1.deck[0], this.player2.deck[0]);
    }
    return this.player2.name
  }

}

const game = new Game();
game.startGame();


