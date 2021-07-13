import { board, Cell } from "../resolvers";

export const checkMove_BishopIsWin = (col: number, row: number) => {
    const bishop = board.find((el) => el.value === "♝") as Cell;
    let isCheck = true;
    if (bishop) {
      for (let i = -7; i < 8; i++) {
        if (col + i == bishop.col && row + i == bishop.row && i != 0) {
          isCheck = false;
          return false;
        } else if (col + i == bishop.col && row - i == bishop.row && i != 0) {
          isCheck = false;
          return false;
        }
      }
    }
    return isCheck;
  };