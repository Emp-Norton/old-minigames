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
    const newDiscs = [...prevDiscs];

    prevDiscs.forEach((disc, index) => {
      const isMoving = Math.abs(disc.velocity.x) > 0.01 || Math.abs(disc.velocity.y) > 0.01;
      if (!isMoving) return;

      const nextPosition = getNextPosition(disc.position, disc.velocity);

      const collisionIndex = prevDiscs.findIndex((otherDisc, otherIndex) => {
        if (index === otherIndex) return false;

        return areDiscsColliding(nextPosition, otherDisc.position, DISC_DIAMETER);
      });

      if (collisionIndex !== -1) {
        // TODO: Play "knock" sound
        const hitDisc = prevDiscs[collisionIndex];

        const angle = Math.atan2(
            hitDisc.position.y - disc.position.y,
            hitDisc.position.x - disc.position.x
        );

        const speed = Math.sqrt(
            Math.pow(disc.velocity.x, 2) +
            Math.pow(disc.velocity.y, 2)
        );

        newDiscs[index] = {
          ...disc,
          position: {
            x: hitDisc.position.x - (Math.cos(angle) * DISC_DIAMETER),
            y: hitDisc.position.y - (Math.sin(angle) * DISC_DIAMETER)
          },
          velocity: { x: 0, y: 0 }
        };

        newDiscs[collisionIndex] = {
          ...hitDisc,
          velocity: {
            x: Math.cos(angle) * speed * 0.8,
            y: Math.sin(angle) * speed * 0.8
          }
        };
      } else {
        const friction = 0.98;
        const newVelocity = {
          x: disc.velocity.x * friction,
          y: disc.velocity.y * friction
        };

        newDiscs[index] = {
          ...disc,
          position: nextPosition,
          velocity: Math.abs(newVelocity.x) < 0.01 && Math.abs(newVelocity.y) < 0.01
              ? { x: 0, y: 0 }
              : newVelocity
        };
      }
    });

    return newDiscs;
  };

  useEffect(() => {
    if (discs.length === 0) return;

    const interval = setInterval(() => {
      setDiscs(prevDiscs => updateDiscPositions(prevDiscs));
    }, PHYSICS_TIMESTEP);

    return () => clearInterval(interval);
  }, [discs.length]);

  const handleMouseDown = (e: React.MouseEvent) => {
    if (!boardRef.current) return;

    const boardRect = boardRef.current.getBoundingClientRect();
    const x = e.clientX - boardRect.left;
    const y = e.clientY - boardRect.top;

    if (x > STARTING_POSITION_CUTOFF) return;

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


  return (
    <div
      ref={boardRef}
      className="shuffleboard"
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={() => setIsDragging(false)}
    >

      <div className="starting-area"> THROW </div>
      <div className="foul-line"> FOUL </div>
      <div className="scoring-area score-1">
        <div className="score-indicator"> 1 </div>
      </div>

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
