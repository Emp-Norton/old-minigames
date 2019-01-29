import React from 'react';
import Page from './snake.html';
var htmlDoc = {__html: Page};

export default class Snake extends React.Component {
  constructor(props){
    super(props);
  }

  render(){
     return (<div dangerouslySetInnerHTML={htmlDoc} />)
}}