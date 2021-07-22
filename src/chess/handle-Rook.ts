import {
  board,
  checkMove_BishopIsWin,
  checkMove_KingIsWin,
  checkMove_KnightIsWin,
  checkMove_RookIsWin,
  getChessMan,
  iconChessWhites,
} from "../resolvers";
import { Cell, locationMove } from "./type";

export const rookMoveIsInvalid = (location: locationMove, chess: String): boolean => {
  const { before, after } = location;
  const allys = getChessMan(iconChessWhites).concat();
  for (let ally of allys) {
    if (ally.col === after.col && ally.row === after.row) {
      return false;
    }
  }
  let a: number;
  let n: number;
  let arr: Array<number> = [];
  
  if (before.col === after.col) {
    if (after.row > before.row) {
      a = before.row;
      n = after.row;
    } else {
      a = after.row;
      n = before.row;
    }
  } else if (before.row === after.row) {
    if (after.col > before.col) {
      a = before.col;
      n = after.col;
    } else {
      a = after.col;
      n = before.col;
    }
  } else {
    return false;
  }
  
  for (let i = a + 1 ; i < n; i++) {
    arr.push(i);
  }
  if (before.col === after.col) {
    for (let el of arr) {
      if (
        board.find(
          (ele) => ele.col === before.col && ele.row === el && ele.value !== '' && ele.value !== chess
        )
      ) {
        return false;
      }
    }
  } else {
    for (let el of arr) {
      if (
        board.find(
          (ele) => ele.row === before.row && ele.col === el && ele.value !== '' && ele.value !== chess
        )
      ) {
        return false;
      }
    }
  }
  return true;
};
export const rookMove = (col: number, row: number) => {
  const arrRands: Array<number> = [];
  let isCheck = false;
  board.forEach((value, index) => {
    arrRands.push(index);
  })
  while (!isCheck && arrRands.length > 0) {
    const index = Math.floor(Math.random() * arrRands.length);
    const rand = arrRands[index];
    const newCol: number = board[rand].col;
    const newRow: number = board[rand].row;
    arrRands.splice(index, 1);
    if (newCol >= 0 && newCol < 8 && newRow >= 0 && newRow < 8) {
      if (
        checkMove_RookIsWin(newCol, newRow, '') &&
        checkMove_KnightIsWin(newCol, newRow) &&
        checkMove_BishopIsWin(newCol, newRow) &&
        checkMove_KingIsWin(newCol, newRow) &&
        rookMoveIsInvalid({
          before: { col, row },
          after: { col: newCol, row: newRow },
        }, '')
      ) {
        isCheck = true;
        return { newCol, newRow };
      }
    }
  }
  console.log('Xe hết đường!');
  return false;
};
export const checkRookWin = (ChessBlacks: Array<Cell>) => {
  const rook = board.find((el) => el.value === '♖') as Cell;
  if (rook) {
    for (let chessBlack of ChessBlacks) {
      if (chessBlack.col === rook.col || chessBlack.row === rook.row) {
        if (
          checkMove_RookIsWin(chessBlack.col, chessBlack.row, '') &&
          checkMove_KnightIsWin(chessBlack.col, chessBlack.row) &&
          checkMove_BishopIsWin(chessBlack.col, chessBlack.row) &&
          checkMove_KingIsWin(chessBlack.col, chessBlack.row) &&
          rookMoveIsInvalid({
            before: { col: rook.col, row: rook.row },
            after: { col: chessBlack.col, row: chessBlack.row },
          }, '')
        ) {
          return {
            col: rook.col,
            row: rook.row,
            newCol: chessBlack.col,
            newRow: chessBlack.row,
          };
        }
      }
    }
  }
  return false;
};
