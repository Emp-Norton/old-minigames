import React from 'react';
import Deck from './Deck.jsx';
import rules from './resources/war_rules.js';
import Modal from 'react-responsive-modal';

export default class War extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      player1: {deck: []},
      player2: {deck: []},
      isLoaded: false,
      modalOpen: false,
      showModalPlayer: null
    }
    this.onOpenModal = this.onOpenModal.bind(this);
    this.onCloseModal = this.onCloseModal.bind(this);
  }

  startGame() {
    const p1 = rules.player('James');
    const p2 = rules.player('Jon');
    rules.makeDeck().shuffle().deal(p1, p2);
    this.setState({player1: p1, player2: p2, isLoaded: true});
  }

  showDecks(){
    const {state} = this;
    return (
      <div id="battlefield">
        <Deck cardClick={(e) => this.onOpenModal(e)} name={state.player1.name} cards={state.player1.deck} />
        <Deck cardClick={(e) => this.onOpenModal(e)} cards={state.player2.deck} />
      </div>
    )
  }

  showDeckModal(player) {
    console.log(player)
    const {state} = this;
    return (
      <div>
      {
        player.name === state.player1.name
        ? <Modal open={state.modalOpen} center="true" onClose={this.onCloseModal.bind(this)}>
            <div class="battlefield">  
              <Deck name={state.player1.name} cards={state.player1.deck} />
            </div>
          </Modal>
        : <Modal open={state.modalOpen} center="true" onClose={this.onCloseModal.bind(this)}>
            <div class="battlefield">
              <Deck name={state.player2.name} cards={state.player1.deck} />
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
    console.log(player);
    this.setState({
      modalOpen: true,
      showModalPlayer: player
    });
  }

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
          this.state.isLoaded 
          ? this.showDecks()
          : this.showPregame()
        }
        <Modal open={state.modalOpen} center="true" onClose={this.onCloseModal}>
          <div class="battlefield">  
            <Deck name={state.showModalPlayer.name} cards={state.showModalPlayer.deck} />
          </div>
        </Modal>
          
      </div>
    )
  }
}

