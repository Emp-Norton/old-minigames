export interface Position {
  x: number;
  y: number;
}

export interface Disc {
  id: number;
  position: Position;
  player: 1 | 2;
}
