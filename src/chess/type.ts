export type Cell = {
  col: number;
  row: number;
  value: String;
};
export type locationMove = {
  before: { col: number; row: number };
  after: { col: number; row: number };
};
export type newLocation = {
  newCol: number;
  newRow: number;
};