import React, { useState, useRef, useEffect } from 'react';
import { Position, Disc } from './types';
import './shuffleboard.css';

const ShuffleBoard: React.FC = () => {
  const [discs, setDiscs] = useState<Disc[]>([]);
  const [currentPlayer, setCurrentPlayer] = useState<1 | 2>(1);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState<Position>({ x: 0, y: 0 });
  const [currentPos, setCurrentPos] = useState<Position>({ x: 0, y: 0 });
  const boardRef = useRef<HTMLDivElement>(null);

  const checkPositionUnoccupied = (pos: Position) :boolean  => {
    let positions = discs.map((disc: Disc):Position => {
      return disc.position
    });
    return positions.some((obj) => obj.x === pos.x && obj.y === pos.y);
  }

  const handleMouseDown = (e: React.MouseEvent) => {
    if (!boardRef.current) return;
    
    const boardRect = boardRef.current.getBoundingClientRect();
    const x = e.clientX - boardRect.left;
    const y = e.clientY - boardRect.top;
    
    // Only allow dragging from the starting area (left side of board)
    if (x > 100) return; // Only allow starting from the first 100px

    setIsDragging(true);
    setDragStart({ x, y });
    setCurrentPos({ x, y });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !boardRef.current) return;

    const boardRect = boardRef.current.getBoundingClientRect();
    const x = e.clientX - boardRect.left;
    const y = e.clientY - boardRect.top;
    
    setCurrentPos({ x, y });
  };

  const handleMouseUp = (e: React.MouseEvent) => {
    if (!isDragging || !boardRef.current) return;

    const boardRect = boardRef.current.getBoundingClientRect();
    const endX = e.clientX - boardRect.left;
    const endY = e.clientY - boardRect.top;

    // Calculate velocity based on drag distance
    const velocity = {
      x: (endX ** 2 - dragStart.x ** 2) / 50,
      y: (endY ** 2 - dragStart.y ** 2) / 50,
    };

    // Add new disc with initial velocity
    const newDisc: Disc = {
      id: discs.length,
      position: { ...dragStart },
      player: currentPlayer,
      velocity: velocity,
    };

    setDiscs([...discs, newDisc]);
    setCurrentPlayer(currentPlayer === 1 ? 2 : 1);
    setIsDragging(false);
  };

  // Simple physics simulation
  useEffect(() => {
    if (discs.length === 0) return;

    const friction = 0.98;
    const interval = setInterval(() => {
      setDiscs(prevDiscs => 
        prevDiscs.map(disc => {
          if (!disc.velocity) return disc;
          
          const newVelocity = {
            x: disc.velocity.x * friction,
            y: disc.velocity.y * friction,
          };

          // Stop moving if velocity is very small
          if (Math.abs(newVelocity.x) < 0.01 && Math.abs(newVelocity.y) < 0.01) {
            return { ...disc, velocity: undefined };
          }
          let newPosition = {
            x: disc.position.x + newVelocity.x,
            y: disc.position.y + newVelocity.y,
          }

          console.log(checkPositionUnoccupied(newPosition));

          return {
            ...disc,
            newPosition,
            velocity: newVelocity,
          };
        })
      );
    }, 16); // ~60fps

    return () => clearInterval(interval);
  }, [discs.length]);

  return (
    <div 
      ref={boardRef}
      className="shuffleboard"
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={() => setIsDragging(false)}
    >

      <div className="starting-area" />
      

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
        <>
          <div
            className={`disc player${currentPlayer}`}
            style={{
              left: currentPos.x,
              top: currentPos.y,
            }}
          />
          <div className="drag-line" style={{
            left: dragStart.x,
            top: dragStart.y,
            width: `${Math.hypot(currentPos.x - dragStart.x, currentPos.y - dragStart.y)}px`,
            transform: `rotate(${Math.atan2(currentPos.y - dragStart.y, currentPos.x - dragStart.x)}rad)`,
          }} />
        </>
      )}
    </div>
  );
};

export default ShuffleBoard;
