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


  const { before, after } = location;
  const allys = getChessMan(iconChessWhites).concat();
  for (let ally of allys) {
    if (ally.col === after.col && ally.row === after.row) {
      return false;
    }
  }
  var range: number;
  range =
    before.col > after.col ? before.col - after.col : after.col - before.col;
  if (after.col > before.col && after.row > before.row) {
    for (let i = 1; i < range; i++) {
      if (
        board.find(
          (el) =>
            el.col === before.col + i &&
            el.row === before.row + i &&
            el.value !== "" &&
            el.value !== "♚" &&
            el.value !== "♜" &&
            el.value !== "♞" &&
            el.value !== "♝"
        )
      ) {
        return false;
      }
    }
  } else if (after.col < before.col && after.row < before.row) {
    for (let i = 1; i < range; i++) {
      if (
        board.find(
          (el) =>
            el.col === before.col - i &&
            el.row === before.row - i &&
            el.value !== "" &&
            el.value !== "♚" &&
            el.value !== "♜" &&
            el.value !== "♞" &&
            el.value !== "♝"
        )
      ) {
        return false;
      }
    }
  } else if (after.col > before.col && after.row < before.row) {
    for (let i = 1; i < range; i++) {
      if (
        board.find(
          (el) =>
            el.col === before.col + i &&
            el.row === before.row - i &&
            el.value !== "" &&
            el.value !== "♚" &&
            el.value !== "♜" &&
            el.value !== "♞" &&
            el.value !== "♝"
        )
      ) {
        return false;
      }
    }
  } else if (after.col < before.col && after.row > before.row) {
    for (let i = 1; i < range; i++) {
      if (
        board.find(
          (el) =>
            el.col === before.col - i &&
            el.row === before.row + i &&
            el.value !== "" &&
            el.value !== "♚" &&
            el.value !== "♜" &&
            el.value !== "♞" &&
            el.value !== "♝"
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
  const bishop = board.find((el) => el.value === "♗") as Cell;
  if (bishop) {
    for (let i = -7; i < 8; i++) {
      for (let chessBlack of ChessBlacks) {
        if (
          bishop.col + i === chessBlack.col &&
          bishop.row + i === chessBlack.row
        ) {
          if (
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
  let select = Math.floor(Math.random() * 4);
  let rand = Math.floor(Math.random() * 7) + 1;
  let newCol: number;
  let newRow: number;
  switch (select) {
    case 0:
      newCol = col + rand;
      newRow = row - rand;
      break;
    case 1:
      newCol = col + rand;
      newRow = row + rand;
      break;
    case 2:
      newCol = col - rand;
      newRow = row + rand;
      break;
    case 3:
      newCol = col - rand;
      newRow = row - rand;
      break;
    default:
      newCol = -1;
      newRow = -1;
      break;
  }
  if (
    newCol >= 0 &&
    newCol < 8 &&
    newRow >= 0 &&
    newRow < 8 &&
    checkBishopMoveIsInvalid({
      before: { col, row },
      after: { col: newCol, row: newRow },
    }) &&
    checkMove_RookIsWin(newCol, newRow) &&
    checkMove_KnightIsWin(newCol, newRow) &&
    checkMove_BishopIsWin(newCol, newRow) &&
    checkMove_KingIsWin(newCol, newRow)
  ) {
    return { newCol, newRow };
  } else {
    return bishopMove(col, row);
  }
};
