import {
  arrRand,
  board,
  Cell,
  checkMove_BishopIsWin,
  checkMove_KingIsWin,
  checkMove_KnightIsWin,
  checkMove_RookIsWin,
  getChessMan,
  iconChessWhites,
  locationMove,
} from "../resolvers";

export const Kxy = [
  { x: 0, y: -1 },
  { x: 0, y: 1 },
  { x: -1, y: 0 },
  { x: 1, y: 0 },
  { x: -1, y: -1 },
  { x: 1, y: -1 },
  { x: -1, y: 1 },
  { x: 1, y: 1 },
];

const checkKingMoveIsInvalid = (location: locationMove): boolean => {
  const { after } = location;
  const allys = getChessMan(iconChessWhites).concat();
  for (let ally of allys) {
    if (ally.col === after.col && ally.row === after.row) {
      return false;
    }
  }
  return true;
};
export const kingMove = (col: number, row: number) => {
  let arrRands = arrRand.concat();
  let isCheck = false;
  while (!isCheck || arrRands.length > 0) {
    const index = Math.floor(Math.random() * arrRands.length);
    const rand = arrRands[index];
    const newCol: number = col + Kxy[rand].x;
    const newRow: number = row + Kxy[rand].y;
    arrRands.splice(index, 1);
    if (
      newCol >= 0 &&
      newCol < 8 &&
      newRow >= 0 &&
      newRow < 8 &&
      checkMove_RookIsWin(newCol, newRow) &&
      checkMove_KnightIsWin(newCol, newRow) &&
      checkMove_BishopIsWin(newCol, newRow) &&
      checkMove_KingIsWin(newCol, newRow) &&
      checkKingMoveIsInvalid({
        before: { col, row },
        after: { col: newCol, row: newRow },
      })
    ) {
      isCheck = true;
      return {
        newCol,
        newRow,
      };
    }
  }
  console.log("Hết đường đi!");
  return "Black win!";
};
export const checkKingWin = (ChessBlacks: Array<Cell>) => {
  const king = board.find((el) => el.value === "♔") as Cell;
  for (let locationKing of Kxy) {
    for (let ChessBlack of ChessBlacks) {
      let u = king.col + locationKing.x;
      let v = king.row + locationKing.y;
      if (u === ChessBlack.col && v === ChessBlack.row) {
        return {
          col: king.col,
          row: king.row,
          newCol: ChessBlack.col,
          newRow: ChessBlack.row,
        };
      }
    }
  }
  return false;
};
