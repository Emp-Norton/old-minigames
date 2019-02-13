import React from 'react';
import Card from './Card.jsx';
import Deck from './Deck.jsx';
import DeckPlaceholder from './DeckPlaceholder.jsx';
import rules from './resources/war_rules.js';
import Modal from 'react-responsive-modal';

export default class War extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      player1name: '',
      player2name: '',
      player1deck: [], 
      player1pile: [],
      player2deck: [], 
      player2pile: [],
      isLoaded: false,
      modalOpen: false,
      showModalPlayer: null,
      gameIsActive: false
    }
    this.onOpenModal = this.onOpenModal.bind(this);
    this.onCloseModal = this.onCloseModal.bind(this);
    this.playRound = this.playRound.bind(this);
  }
// GAME FUNCTIONS // 
  startGame() {
    const p1 = rules.player('James');
    const p2 = rules.player('Jon');
    rules.makeDeck().shuffle().deal(p1, p2);
    this.setState({player1name: p1.name, player2name: p2.name, player1deck: p1.deck, player2deck: p2.deck, isLoaded: true, gameIsActive: true});
  }

  payoutWinner(scoreObj) {
    const {player1_card, player2_card} = scoreObj;
    const stakes = scoreObj.warstakes ? scoreObj.warstakes : [player1_card, player2_card];
    if (parseInt(player1_card) > parseInt(player2_card)) {
      console.log('p1 win')
      this.setState({player1pile: this.state.player1pile.concat(stakes)})
    } 
    if (parseInt(player1_card) < parseInt(player2_card)) {
      console.log('p2 win')
      this.setState({player2pile: this.state.player2pile.concat(stakes)})
    }
    

  }

  playRound() {
    const player1_card = this.state.player1deck.shift();
    const player2_card = this.state.player2deck.shift();
    this.payoutWinner({player1_card: player1_card, player2_card: player2_card})
  }
// PRESENTATION FUNCTIONS //
  showCards() {
    return (
      <div>
        <Card player={this.state.player1name} value={this.state.player1_card} />
        <Card player={this.state.player2name} value={this.state.player2_card} />
      </div>
    )
  }
  showDecks(){
    const {state} = this;
    return (
      <div class="battlefield">
        <div class="deck--holster">
          <DeckPlaceholder openModal={(e) => this.onOpenModal(state.player1)} cards={state.player1deck} />
          <DeckPlaceholder openModal={(e) => this.onOpenModal(state.player2)} cards={state.player2deck} />
          <button onClick={this.playRound} class="btn--play-round"> <span class="btn--text"> Play Round </span></button>
        </div>
        <div class="battlefield">
          {
            state.gameIsActive
            ? this.showCards()
            : null
          }
          <div>
            <DeckPlaceholder openModal={(e) => this.onOpenModal(this.state.player1)} cards={this.state.player1pile} />
            <DeckPlaceholder openModal={(e) => this.onOpenModal(this.state.player2)} cards={this.state.player2pile} />
          </div>
        </div>

      </div>  
    )
  }

  showDeckModal(player) {
    const {state} = this;
    return (
      <div>
      {
        player.name === state.player1.name
        ? <Modal open={state.modalOpen} center="true" onClose={this.onCloseModal.bind(this)}>
            <div class="battlefield">  
               <Deck player={state.player1} cards={state.player1deck} />
            </div>
          </Modal>
        : <Modal open={state.modalOpen} center="true" onClose={this.onCloseModal.bind(this)}>
            <div class="battlefield">
              <Deck player={state.player2} cards={state.player2deck} />
            </div>
        </Modal>
    }
    </div>
    )    
  }

  showPregame() {
    return (
      <p> Please wait... </p>
    )
  }

  onCloseModal() {
    this.setState({
      modalOpen: false
    });
  }

  onOpenModal(player) {
    this.setState({
      modalOpen: true,
      showModalPlayer: player
    });
  }
// LIFECYCLE FUNCTIONS // 
  componentDidMount() {
    this.startGame();
  }

  render(){
    const { state } = this;
    const { modalOpen } = this.state;
    return (
      <div>
        <h1> WAR </h1>
        {
          state.isLoaded 
          ? this.showDecks()
          : this.showPregame()
        }
        {
          state.showModalPlayer
          ? <Modal open={state.modalOpen} center="true" onClose={this.onCloseModal}>
              <div class="battlefield">  
                <Deck player={state.showModalPlayer} cards={state.showModalPlayer.deck} />
              </div>
            </Modal>
          : null
        }
      </div>
    )
  }
}

