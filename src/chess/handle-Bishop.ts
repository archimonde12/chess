import {
  board,
  checkMove_BishopIsWin,
  checkMove_KingIsWin,
  checkMove_KnightIsWin,
  checkMove_QueenIsWin,
  checkMove_RookIsWin,
  getChessMan,
  iconChessWhites,
} from "../resolvers";
import { Cell, locationMove } from "./type";


export const checkBishopMoveIsInvalid = (location: locationMove): boolean => {
  const { before, after } = location;
  const allys = getChessMan(iconChessWhites).concat();
  for (let ally of allys) {
    if (ally.col === after.col && ally.row === after.row) {
      return false;
    }
  }
  const rangeCol = before.col > after.col ? before.col - after.col : after.col - before.col;
  const rangeRow = before.row > after.row ? before.row - after.row : after.row - before.row;
  if(rangeCol !== rangeRow) {
    return false;
  }
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
  } else {
    return false;
  }
  return true;
};
export const checkBishopWin = (ChessBlacks: Array<Cell>) => {
  const bishop = board.find((el) => el.value === '♗') as Cell;
  if (bishop) {
    for (let i = -7; i < 8; i++) {
      for (let chessBlack of ChessBlacks) {
        if (
          bishop.col + i === chessBlack.col &&
          bishop.row + i === chessBlack.row
        ) {
          if (
            checkMove_RookIsWin(chessBlack.col, chessBlack.row, '') &&
            checkMove_KnightIsWin(chessBlack.col, chessBlack.row) &&
            checkMove_BishopIsWin(chessBlack.col, chessBlack.row) &&
            checkMove_KingIsWin(chessBlack.col, chessBlack.row) &&
            checkMove_QueenIsWin(chessBlack.col, chessBlack.row, '') &&
            checkBishopMoveIsInvalid({
              before: { col: bishop.col, row: bishop.row },
              after: { col: chessBlack.col, row: chessBlack.row },
            })
          ) {
            return {
              col: bishop.col,
              row: bishop.row,
              newCol: chessBlack.col,
              newRow: chessBlack.row,
            };
          }
        } else if (
          bishop.col + i === chessBlack.col &&
          bishop.row - i === chessBlack.row
        ) {
          if (
            checkMove_RookIsWin(chessBlack.col, chessBlack.row, '') &&
            checkMove_KnightIsWin(chessBlack.col, chessBlack.row) &&
            checkMove_BishopIsWin(chessBlack.col, chessBlack.row) &&
            checkMove_KingIsWin(chessBlack.col, chessBlack.row) &&
            checkMove_QueenIsWin(chessBlack.col, chessBlack.row, '') &&
            checkBishopMoveIsInvalid({
              before: { col: bishop.col, row: bishop.row },
              after: { col: chessBlack.col, row: chessBlack.row },
            })
          ) {
            return {
              col: bishop.col,
              row: bishop.row,
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
export const bishopMove = (col: number, row: number) => {
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
    if (
      newCol >= 0 &&
      newCol < 8 &&
      newRow >= 0 &&
      newRow < 8 &&
      checkBishopMoveIsInvalid({
        before: { col, row },
        after: { col: newCol, row: newRow },
      }) &&
      checkMove_RookIsWin(newCol, newRow, '') &&
      checkMove_KnightIsWin(newCol, newRow) &&
      checkMove_BishopIsWin(newCol, newRow) &&
      checkMove_QueenIsWin(newCol, newRow, '') &&
      checkMove_KingIsWin(newCol, newRow)
    ) {
      isCheck = true;
      return { newCol, newRow };
    }
  }
  console.log('Tượng hết đường đi!');
  return false;
};
