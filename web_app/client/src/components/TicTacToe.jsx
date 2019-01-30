import React from 'react';
import Page from './resources/ttt_templ.html';
const htmlDoc = {__html: Page};

const TicTacToe = (props) => {
  return (
    <div>
      <iframe src="/ttt_templ"></iframe>
      <div dangerouslySetInnerHTML={htmlDoc} />
    </div>
    )
}

export default TicTacToe;