import {
  arrRand,
  board,
  checkMove_BishopIsWin,
  checkMove_KingIsWin,
  checkMove_KnightIsWin,
  checkMove_RookIsWin,
  getChessMan,
  iconChessWhites,
} from "../resolvers";
import { Cell, locationMove } from "./type";
export const Hxy = [
  { x: -2, y: -1 },
  { x: -2, y: 1 },
  { x: -1, y: -2 },
  { x: -1, y: 2 },
  { x: 1, y: -2 },
  { x: 1, y: 2 },
  { x: 2, y: -1 },
  { x: 2, y: 1 },
];
export const checkKnightWin = (ChessBlacks: Array<Cell>) => {
  const knight = board.find((el) => el.value === "♘") as Cell;
  if (knight) {
    for (let locationKnight of Hxy) {
      for (let chessBlack of ChessBlacks) {
        var u = knight.col + locationKnight.x;
        var v = knight.row + locationKnight.y;
        if (u === chessBlack.col && v === chessBlack.row) {
          if(
            checkMove_RookIsWin(chessBlack.col, chessBlack.row, '') &&
            checkMove_KnightIsWin(chessBlack.col, chessBlack.row) &&
            checkMove_BishopIsWin(chessBlack.col, chessBlack.row) &&
            checkMove_KingIsWin(chessBlack.col, chessBlack.row)
          ) {
            return {
              col: knight.col,
              row: knight.row,
              newCol: chessBlack.col,
              newRow: chessBlack.row,
            };
          }
          
        }
      }
    }
  }
  return false;
};
const checkKnightMoveIsInvalid = (location: locationMove): boolean => {
  const { after } = location;
  const allys = getChessMan(iconChessWhites).concat();
  for (let ally of allys) {
    if (ally.col === after.col && ally.row === after.row) {
      return false;
    }
  }
  return true;
};
export const knightMove = (col: number, row: number) => {
  var arrRands = arrRand.concat();
  var isCheck = false;
  while (!isCheck && arrRands.length > 0) {
    const index = Math.floor(Math.random() * arrRands.length);
    const rand = arrRands[index];
    arrRands.splice(index, 1);
    let newCol = col + Hxy[rand].x;
    var newRow = row + Hxy[rand].y;
    if (
      newCol >= 0 &&
      newCol < 8 &&
      newRow >= 0 &&
      newRow < 8 &&
      checkKnightMoveIsInvalid({
        before: { col, row },
        after: { col: newCol, row: newRow },
      }) &&
      checkMove_RookIsWin(newCol, newRow, '') &&
      checkMove_KnightIsWin(newCol, newRow) &&
      checkMove_BishopIsWin(newCol, newRow) &&
      checkMove_KingIsWin(newCol, newRow)
    ) {
      isCheck = true;
      return { newCol, newRow };
    }
  }
  console.log("Mã hết đường đi!");
  return "Do not way";
};
