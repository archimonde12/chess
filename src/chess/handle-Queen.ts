import { board, checkMove_BishopIsWin, checkMove_KingIsWin, checkMove_KnightIsWin, checkMove_QueenIsWin, checkMove_RookIsWin, getChessMan, iconChessWhites } from "../resolvers";
import { Cell, locationMove } from "./type";

export const checkQueenMoveIsInvalid = (location: locationMove, chess: String): boolean => {
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
  const rangeCol = before.col > after.col ? before.col - after.col : after.col - before.col;
  const rangeRow = before.row > after.row ? before.row - after.row : after.row - before.row;
  if (before.col === after.col) {
    if (after.row > before.row) {
      a = before.row;
      n = after.row;
    } else {
      a = after.row;
      n = before.row;
    }
    for (let i = a + 1 ; i < n; i++) {
      arr.push(i);
    }
    for (let el of arr) {
      if (
        board.find(
          (ele) => ele.col === before.col && ele.row === el && ele.value !== '' && ele.value !== chess
        )
      ) {
        return false;
      }
    }
  } else if (before.row === after.row) {
    if (after.col > before.col) {
      a = before.col;
      n = after.col;
    } else {
      a = after.col;
      n = before.col;
    }
    for (let i = a + 1 ; i < n; i++) {
      arr.push(i);
    }
    for (let el of arr) {
      if (
        board.find(
          (ele) => ele.row === before.row && ele.col === el && ele.value !== '' && ele.value !== chess
        )
      ) {
        return false;
      }
    }
  } else if (rangeCol === rangeRow) {
    if (after.col > before.col && after.row > before.row) {
      for (let i = 1; i < rangeCol; i++) {
        if (
          board.find(
            (el) =>
              el.col === before.col + i &&
              el.row === before.row + i &&
              el.value !== ''
          )
        ) {
          return false;
        }
      }
    } else if (after.col < before.col && after.row < before.row) {
      for (let i = 1; i < rangeCol; i++) {
        if (
          board.find(
            (el) =>
              el.col === before.col - i &&
              el.row === before.row - i &&
              el.value !== ''
          )
        ) {
          return false;
        }
      }
    } else if (after.col > before.col && after.row < before.row) {
      for (let i = 1; i < rangeCol; i++) {
        if (
          board.find(
            (el) =>
              el.col === before.col + i &&
              el.row === before.row - i &&
              el.value !== ''
          )
        ) {
          return false;
        }
      }
    } else if (after.col < before.col && after.row > before.row) {
      for (let i = 1; i < rangeCol; i++) {
        if (
          board.find(
            (el) =>
              el.col === before.col - i &&
              el.row === before.row + i &&
              el.value !== ''
          )
        ) {
          return false;
        }
      }
    }
  } else {
    return false;
  }
  return true;
};
export const queenMove = (col: number, row: number) => {
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
        checkMove_QueenIsWin(newCol, newRow, '') &&
        checkQueenMoveIsInvalid({
          before: { col, row },
          after: { col: newCol, row: newRow },
        }, '')
      ) {
        isCheck = true;
        return { newCol, newRow };
      }
    }
  }
};
export const checkQueenWin = (ChessBlacks: Array<Cell>) => {
  const queen = board.find((el) => el.value === '♕') as Cell;
  if (queen) {
    for (let chessBlack of ChessBlacks) {
      if (chessBlack.col === queen.col || chessBlack.row === queen.row) {
        if (
          checkMove_RookIsWin(chessBlack.col, chessBlack.row, '') &&
          checkMove_KnightIsWin(chessBlack.col, chessBlack.row) &&
          checkMove_BishopIsWin(chessBlack.col, chessBlack.row) &&
          checkMove_KingIsWin(chessBlack.col, chessBlack.row) &&
          checkMove_QueenIsWin(chessBlack.col, chessBlack.row, '') &&
          checkQueenMoveIsInvalid({
            before: { col: queen.col, row: queen.row },
            after: { col: chessBlack.col, row: chessBlack.row },
          }, '')
        ) {
          return {
            col: queen.col,
            row: queen.row,
            newCol: chessBlack.col,
            newRow: chessBlack.row,
          };
        }
      }
      const rangeCol = queen.col > chessBlack.col ? queen.col - chessBlack.col : chessBlack.col - queen.col;
      const rangeRow = queen.row > chessBlack.row ? queen.row - chessBlack.row : chessBlack.row - queen.row;
      if ( rangeCol === rangeRow ) {
        if (
          checkMove_RookIsWin(chessBlack.col, chessBlack.row, '') &&
          checkMove_KnightIsWin(chessBlack.col, chessBlack.row) &&
          checkMove_BishopIsWin(chessBlack.col, chessBlack.row) &&
          checkMove_KingIsWin(chessBlack.col, chessBlack.row) &&
          checkMove_QueenIsWin(chessBlack.col, chessBlack.row, '') &&
          checkQueenMoveIsInvalid({
            before: { col: queen.col, row: queen.row },
            after: { col: chessBlack.col, row: chessBlack.row },
          }, '')
        ) {
          return {
            col: queen.col,
            row: queen.row,
            newCol: chessBlack.col,
            newRow: chessBlack.row,
          };
        }
      }
    }
  }
  return false;
};
