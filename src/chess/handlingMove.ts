import { requestLogs } from "../mongo";
import {
  board,
  checkMove_BishopIsWin,
  checkMove_KingIsWin,
  checkMove_KnightIsWin,
  checkMove_RookIsWin,
} from "../resolvers";
import { bishopMove, checkBishopWin } from "./handl-Bishop";
import { checkKingWin, kingMove } from "./handl-King";
import { checkKnightWin, knightMove } from "./handl-Knight";
import { checkRookWin, rookMove } from "./handl-Rook";
import { Cell, locationMove, newLocation } from "./type";

export const changeLocationChess = (value: locationMove) => {
  const valueAtBefore = board[value.before.col * 8 + value.before.row].value;
  board[value.before.col * 8 + value.before.row].value = "";
  board[value.after.col * 8 + value.after.row].value = valueAtBefore;
  // pubsub.publish(BOARD_CHANEL, { boardSub: board });
};
export const chooseChessPieces = (
  chessWhites: Array<Cell>,
  chessBlacks: Array<Cell>
) => {
  type newLoca = {
    col: number;
    row: number;
    newCol: number;
    newRow: number;
  };
  const rook = board.find((el) => el.value === "♖")
  const kningt = board.find((el) => el.value === "♘")
  const bishop = board.find((el) => el.value === "♗")
  if (checkKingWin(chessBlacks)) {
    var { col, row, newCol, newRow } = checkKingWin(chessBlacks) as newLoca;
  } else if (checkRookWin(chessBlacks)) {
    var { col, row, newCol, newRow } = checkRookWin(chessBlacks) as newLoca;
  } else if (checkKnightWin(chessBlacks)) {
    var { col, row, newCol, newRow } = checkKnightWin(chessBlacks) as newLoca;
  } else if (checkBishopWin(chessBlacks)) {
    var { col, row, newCol, newRow } = checkBishopWin(chessBlacks) as newLoca;
  } else if(rook && (!checkMove_RookIsWin(rook.col, rook.row, '')
  || !checkMove_KnightIsWin(rook.col, rook.row) 
  || !checkMove_BishopIsWin(rook.col, rook.row)
  || !checkMove_KingIsWin(rook.col, rook.row))){
    var { newCol, newRow } = rookMove(
      rook.col,
      rook.row
    ) as newLocation;
    var col = rook.col;
    var row = rook.row;
  } else if(kningt && (!checkMove_RookIsWin(kningt.col, kningt.row, '')
  || !checkMove_KnightIsWin(kningt.col, kningt.row) 
  || !checkMove_BishopIsWin(kningt.col, kningt.row)
  || !checkMove_KingIsWin(kningt.col, kningt.row))){
    var { newCol, newRow } = knightMove(
      kningt.col,
      kningt.row
    ) as newLocation;
    var col = kningt.col;
    var row = kningt.row;
  } else if(bishop && (!checkMove_RookIsWin(bishop.col, bishop.row, '')
  || !checkMove_KnightIsWin(bishop.col, bishop.row) 
  || !checkMove_BishopIsWin(bishop.col, bishop.row)
  || !checkMove_KingIsWin(bishop.col, bishop.row))){
    var { newCol, newRow } = bishopMove(
      bishop.col,
      bishop.row
    ) as newLocation;
    var col = bishop.col;
    var row = bishop.row;
  }
  else {
    const rand = chessWhites[Math.floor(Math.random() * chessWhites.length)];
    var col = rand.col;
    var row = rand.row;
    switch (rand.value) {
      case "♖":
        var { newCol, newRow } = rookMove(rand.col, rand.row) as newLocation;
        break;
      case "♔":
        var { newCol, newRow } = kingMove(rand.col, rand.row) as newLocation;
        break;
      case "♘":
        var { newCol, newRow } = knightMove(rand.col, rand.row) as newLocation;
        break;
      case "♗":
        var { newCol, newRow } = bishopMove(rand.col, rand.row) as newLocation;
        break;
    }
    if (!newCol && !newRow && chessWhites.length > 1) {
      console.log('------------load lại')
      return chooseChessPieces(chessWhites, chessBlacks);
    }
  }
  return {
    col,
    row,
    newCol,
    newRow,
  };
};
