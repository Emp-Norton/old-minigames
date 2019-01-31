import React from 'react';

const Card = (props) => {
  return (
    <div>
      <h1 class="battlefield--card"> {props.value} </h1>
    </div>
  )
}

export default Card;