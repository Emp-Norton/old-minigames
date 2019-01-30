import React from 'react';
import Page from './resources/ttt_templ.html';
const htmlDoc = {__html: Page};

const TicTacToe = (props) => {
  return (<div dangerouslySetInnerHTML={htmlDoc} />)
}

export default TicTacToe;