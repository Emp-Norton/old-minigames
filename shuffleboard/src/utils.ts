import { Position } from './types';


export const distance = (p1: Position, p2: Position): number => {
    return Math.sqrt(Math.pow(p2.x - p1.x, 2) + Math.pow(p2.y - p1.y, 2));
};

export const areDiscsColliding = (p1: Position, p2: Position, discDiameter: number): boolean => {
    return distance(p1, p2) <= discDiameter;
};

export const getNextPosition = (position: Position, velocity: Position): Position => {
    return {
        x: position.x + velocity.x,
        y: position.y + velocity.y,
    };
};