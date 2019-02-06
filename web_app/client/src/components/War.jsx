import React from 'react';
import Deck from './Deck.jsx';
import DeckPlaceholder from './DeckPlaceholder.jsx';
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
        <DeckPlaceholder cardClick={(e) => this.onOpenModal(e)} cards={state.player1.deck} />
        <DeckPlaceholder cardClick={(e) => this.onOpenModal(e)} cards={state.player2.deck} />
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
               <Deck player={state.player1} cards={state.player1.deck} />
            </div>
          </Modal>
        : <Modal open={state.modalOpen} center="true" onClose={this.onCloseModal.bind(this)}>
            <div class="battlefield">
              <Deck player={state.player2} cards={state.player2.deck} />
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
          !!state.showModalPlayer
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

