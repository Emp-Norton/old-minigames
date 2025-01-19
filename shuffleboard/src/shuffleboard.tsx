import React, { useState } from 'react';
import { Position, Disc } from './types';
import './shuffleboard.css';

const ShuffleBoard: React.FC = () => {
  const [discs, setDiscs] = useState<Disc[]>([]);
  const [currentPlayer, setCurrentPlayer] = useState<1 | 2>(1);
  const [isDragging, setIsDragging] = useState(false);
  const [startPos, setStartPos] = useState<Position>({ x: 0, y: 0 });

  const handleMouseDown = (e: React.MouseEvent) => {
    const boardRect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - boardRect.left;
    const y = e.clientY - boardRect.top;
    
    setIsDragging(true);
    setStartPos({ x, y });
  };

  const handleMouseUp = (e: React.MouseEvent) => {
    if (!isDragging) return;

    const boardRect = e.currentTarget.getBoundingClientRect();
    const endX = e.clientX - boardRect.left;
    const endY = e.clientY - boardRect.top;

    // Calculate velocity based on start and end positions
    const velocity = {
      x: (endX - startPos.x) * 0.1,
      y: (endY - startPos.y) * 0.1,
    };

    // Add new disc
    const newDisc: Disc = {
      id: discs.length,
      position: { x: startPos.x, y: startPos.y },
      player: currentPlayer,
    };

    setDiscs([...discs, newDisc]);
    setCurrentPlayer(currentPlayer === 1 ? 2 : 1);
    setIsDragging(false);
  };

  return (
    <div 
      className="shuffleboard"
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
    >
      {discs.map((disc) => (
        <div
          key={disc.id}
          className={`disc player${disc.player}`}
          style={{
            left: disc.position.x,
            top: disc.position.y,
          }}
        />
      ))}
      {isDragging && (
        <div
          className={`disc player${currentPlayer}`}
          style={{
            left: startPos.x,
            top: startPos.y,
          }}
        />
      )}
    </div>
  );
};

export default ShuffleBoard;
