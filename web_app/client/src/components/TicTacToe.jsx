import React from 'react';
import Page from './resources/ttt_templ.html';
const htmlDoc = {__html: Page};
import rules from './resources/ttt_rules.js';

 // starting to look like this should be a generic component that
 // accepts a filestring for the template to load instead of a 
 // stateful component for each unique script / game.
    // how to handle game-specific complex functions?
export default class TicTacToe extends React.Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    rules.init();
  }

  render() {
    return (
      <div>
        <div dangerouslySetInnerHTML = {htmlDoc} />
      </div>
    )
  }
}