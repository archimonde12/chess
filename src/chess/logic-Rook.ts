import {
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

export const rookMoveIsInvalid = (location: locationMove): boolean => {
  const { before, after } = location;
  const allys = getChessMan(iconChessWhites).concat();
  for (let ally of allys) {
    if (ally.col === after.col && ally.row === after.row) {
      return false;
    }
  }
  var a: number;
  var n: number;
  var arr: number[] = [];
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
  for (let i = a + 1; i < n; i++) {
    arr.push(i);
  }
  if (before.col === after.col) {
    for (let el of arr) {
      if (
        board.find(
          (ele) => ele.col === before.col && ele.row === el && ele.value !== ""
        )
      ) {
        return false;
      }
    }
  } else {
    for (let el of arr) {
      if (
        board.find(
          (ele) => ele.row === before.row && ele.col === el && ele.value !== ""
        )
      ) {
        return false;
      }
    }
  }
  return true;
};
export const rookMove = (col: number, row: number) => {
  var rand = Math.floor(Math.random() * 15) - 7;
  var local = Math.floor(Math.random() * 2);
  let newCol = col;
  let newRow = row;
  local === 1 ? (newCol = rand + col) : (newRow = rand + row);
  if (newCol >= 0 && newCol < 8 && newRow >= 0 && newRow < 8) {
    if (
      checkMove_RookIsWin(newCol, newRow) &&
      checkMove_KnightIsWin(newCol, newRow) &&
      checkMove_BishopIsWin(newCol, newRow) &&
      checkMove_KingIsWin(newCol, newRow) &&
      rookMoveIsInvalid({
        before: { col, row },
        after: { col: newCol, row: newRow },
      })
    ) {
      return { newCol, newRow };
    }
  }
  return rookMove(col, row);
};
export const checkRookWin = (ChessBlacks: Array<Cell>) => {
  const rook = board.find((el) => el.value === "♖") as Cell;
  if (rook) {
    for (let chessBlack of ChessBlacks) {
      if (chessBlack.col === rook.col || chessBlack.row === rook.row) {
        if (
          rookMoveIsInvalid({
            before: { col: rook.col, row: rook.row },
            after: { col: chessBlack.col, row: chessBlack.row },
          })
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
