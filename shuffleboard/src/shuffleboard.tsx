import React, { useState, useRef, useEffect } from 'react';
import { Position, Disc } from './types';
import { distance, areDiscsColliding, getNextPosition } from './utils.ts';
import './shuffleboard.css';

const DISC_DIAMETER = 30; // Should match CSS
const ZERO_VELOCITY_CONSTANT = {x: 0, y:0};
const PHYSICS_TIMESTEP = 16; // ~60fps
const STARTING_POSITION_CUTOFF = 100;

const ShuffleBoard: React.FC = () => {
  const [discs, setDiscs] = useState<Disc[]>([]);
  const [currentPlayer, setCurrentPlayer] = useState<1 | 2>(1);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState<Position>({ x: 0, y: 0 });
  const [currentPos, setCurrentPos] = useState<Position>({ x: 0, y: 0 });
  const boardRef = useRef<HTMLDivElement>(null);

  const updateDiscPositions = (prevDiscs: Disc[]): Disc[] => {
    return prevDiscs.map(disc => {
      const isMoving = Math.abs(disc.velocity.x) > 0.01 || Math.abs(disc.velocity.y) > 0.01;
      if (!isMoving) {
        return {
          ...disc,
          velocity: ZERO_VELOCITY_CONSTANT,
        };
      }

      const nextPosition = getNextPosition(disc.position, disc.velocity);

      const collision = prevDiscs.find(otherDisc => {
        if (otherDisc.id === disc.id || otherDisc.velocity) return false;

        return areDiscsColliding(nextPosition, otherDisc.position, DISC_DIAMETER);
      });

      if (collision) {
        return {
          ...disc,
          position: {
            x: collision.position.x - (Math.sign(disc.velocity.x) * DISC_DIAMETER),
            y: collision.position.y - (Math.sign(disc.velocity.y) * DISC_DIAMETER),
          },
          velocity: {x: 0, y: 0},
        };
      }

      // Apply friction
      const friction = 0.98;
      const newVelocity = {
        x: disc.velocity.x * friction,
        y: disc.velocity.y * friction,
      };

      // Stop moving if velocity is very small
      if (Math.abs(newVelocity.x) < 0.01 && Math.abs(newVelocity.y) < 0.01) {
        return { ...disc, velocity: ZERO_VELOCITY_CONSTANT };
      }

      // No collision, update position with velocity
      return {
        ...disc,
        position: nextPosition,
        velocity: newVelocity,
      };
    });
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    if (!boardRef.current) return;

    const boardRect = boardRef.current.getBoundingClientRect();
    const x = e.clientX - boardRect.left;
    const y = e.clientY - boardRect.top;

    if (x > STARTING_POSITION_CUTOFF) return; // Only allow starting from the first 100px

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

    const velocity = {
      x: (endX - dragStart.x) / 50,
      y: (endY - dragStart.y) / 50,
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

  useEffect(() => {
    if (discs.length === 0) return;

    const interval = setInterval(() => {
      setDiscs(prevDiscs => updateDiscPositions(prevDiscs));
    }, PHYSICS_TIMESTEP);

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
