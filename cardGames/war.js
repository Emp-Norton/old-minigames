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

** Definitely need to do the above. https://www.wimpyprogrammer.com/the-statistics-of-war-the-card-game/
    The site linked here points out that games in which the winning pile isn't shuffled tend to go 
    much, much longer. player.deck object must be Deck type so it can use .shuffle method. when the player's
    offensive pile is depleted.
  
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
      console.log(`Player 1 wins with ${c1} against ${c2} : ${this.player1.deck.length} -- ${this.player2.deck.length}. Wins ${stakes}`);
    }
    if (c1v < c2v) {
      this.player2.deck.push(...stakes); 
      console.log(`Player 2 wins with ${c2} against ${c1} : ${this.player1.deck.length} -- ${this.player2.deck.length}. Wins ${stakes}`);
    }
    if (c1v === c2v) { // this case is still broken. cards are falling into the void because I'm not moving them properly
      console.log('war', c1, c2)
      let warStakes = [];
      let p1warCard;
      let p2warCard;
      // this.player1.deck.push(this.player1.deck.shift())
      // this.player2.deck.push(this.player2.deck.shift());
      switch (true) {
        case this.player1.deck.length > 3 && this.player2.deck.length <= 3:         // p1 has > 3, p2 doesn't
          p2warCard = this.player2.deck.pop();
          p1warCard = this.player1.deck.shift();
          const p1stakes = ...this.player1.deck.slice(0, 3);
          const p2stakes = ...this.player2.deck.slice();
          warStakes = [...stakes, p1stakes, p2stakes];
          console.log(`P1 ${p1stakes} : ${p1warCard} \n P2 ${p2stakes} : ${p2warCard}`);
          this.playRound(p1warCard, p2warCard, warStakes);
          break;
        case this.player2.deck.length > 3 && this.player1.deck.length <= 3:         // p2 has > 3, p1 doesn't
          p1warCard = this.player1.deck.pop();
          p2warCard = this.player2.deck.shift();
          const p1stakes = ...this.player1.deck.slice();
          const p2stakes = ...this.player2.deck.slice(0, 3);
          warStakes = [...stakes, p2stakes, p1stakes];
          console.log(`P1 ${p1stakes} : ${p1warCard} \n P2 ${p2stakes} : ${p2warCard}`);
          this.playRound(p1warCard, p2warCard, warStakes);
          break;
        case this.player1.deck.length <= 3 && this.player2.deck.length <= 3: // both <= 3
          p1warCard = this.player1.deck.pop();
          p2warCard = this.player2.deck.pop();
          const p1stakes = ...this.player1.deck.slice();
          const p2stakes = ...this.player2.deck.slice();
          warStakes = [...stakes, p1stakes, p2stakes];
          console.log(`P1 ${p1stakes} : ${p1warCard} \n P2 ${p2stakes} : ${p2warCard}`);
          this.playRound(p1warCard, p2warCard, warStakes);
          break;
        default:
          warStakes = [...stakes, ...this.player1.deck.slice(0, 3), ...this.player2.deck.slice(0, 3)];
          this.player1.deck = this.player1.deck.slice(3, this.player1.deck.length);
          this.player2.deck = this.player2.deck.slice(3, this.player2.deck.length);
          p1warCard = this.player1.deck.shift();
          p2warCard = this.player2.deck.shift();
          console.log(`P1 ${p1stakes} : ${p1warCard} \n P2 ${p2stakes} : ${p2warCard}`);
          this.playRound(p1warCard, p2warCard, [p1warCard, p2warCard, ...warStakes]);
          break;
      }
    }
    return
  }

  this.startGame = () => {
    deck.shuffle();
    deck.deal(this.player1, this.player2);
    while (this.player1.deck.length > 0) {
      if (this.player1.deck.length >= 52) return this.player1.name
      if (this.player2.deck.length >= 52) return this.player2.name 
      let p1card = this.player1.deck.shift();
      let p2card = this.player2.deck.shift();
      this.playRound(p1card, p2card);
    }
    return this.player2.name
  }

}

const game = new Game();
game.startGame();


