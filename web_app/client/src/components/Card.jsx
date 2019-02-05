import React from 'react';

const Card = (props) => {
  return (
    <div>
      <h1 class="battlefield--card" onClick={props.clickHandler}> {props.value} </h1>
    </div>
  )
}

export default Card;