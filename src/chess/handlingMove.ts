import { requestLogs } from "../mongo";
import {
  board,
  checkMove_BishopIsWin,
  checkMove_KnightIsWin,
  checkMove_RookIsWin,
  getChessMan,
  iconChessBlacks,
  iconChessWhites,
} from "../resolvers";
import { sendRequestToServer } from "../util";
import { bishopMove, checkBishopWin } from "./logic-Bishop";
import { checkKingWin, kingMove } from "./logic-King";
import { checkKnightWin, knightMove } from "./logic-Knight";
import { checkRookWin, rookMove } from "./logic-Rook";
import { Cell, locationMove, newLocation } from "./type";

export const changeLocationChess = (value: locationMove) => {
  const valueAtBefore = board[value.before.col * 8 + value.before.row].value;
  board[value.before.col * 8 + value.before.row].value = "";
  board[value.after.col * 8 + value.after.row].value = valueAtBefore;
  // pubsub.publish(BOARD_CHANEL, { boardSub: board });
};
const getChess = (value: String) => {
  return board.find(el => el.value === value);
}
const chooseChessPieces = (
  chessWhites: Array<Cell>,
  chessBlacks: Array<Cell>
) => {
  type newLoca = {
    col: number;
    row: number;
    newCol: number;
    newRow: number;
  };
  if (checkKingWin(chessBlacks)) {
    var { col, row, newCol, newRow } = checkKingWin(chessBlacks) as newLoca;
  } else if (checkRookWin(chessBlacks)) {
    var { col, row, newCol, newRow } = checkRookWin(chessBlacks) as newLoca;
  } else if (checkKnightWin(chessBlacks)) {
    var { col, row, newCol, newRow } = checkKnightWin(chessBlacks) as newLoca;
  } else if (checkBishopWin(chessBlacks)) {
    var { col, row, newCol, newRow } = checkBishopWin(chessBlacks) as newLoca;
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
export const handlingMove = () => {
  const locationKing = board.find((el) => el.value === "♔") as Cell;
  const chessWhites = getChessMan(iconChessWhites).concat();
  const chessBlacks = getChessMan(iconChessBlacks).concat();
  checkMove_RookIsWin(locationKing.col, locationKing.row)
  if (!locationKing) {
    console.log("You Lose!");
    return "Black win!";
  }
  // if (
  //   !checkMove_RookIsWin(locationKing.col, locationKing.row) ||
  //   !checkMove_KnightIsWin(locationKing.col, locationKing.row) ||
  //   !checkMove_BishopIsWin(locationKing.col, locationKing.row) ||
  //   chessWhites.length === 1
  // ) {
  //   var { newCol, newRow } = kingMove(
  //     locationKing.col,
  //     locationKing.row
  //   ) as newLocation;
  //   var col = locationKing.col;
  //   var row = locationKing.row;
  // } else {
  //   var { col, row, newCol, newRow } = chooseChessPieces(
  //     chessWhites,
  //     chessBlacks
  //   ) as {col: number, row: number, newCol: number, newRow: number};
  // }
  //   requestLogs.insertOne({
  //     content: "White move",
  //     before: { col, row },
  //     after: { col: newCol, row: newRow },
  //   });
  //   console.log("request: ", col, row, newCol, newRow);
    // Gửi request chessMove ở sever của công
    // sendRequestToServer({
    //   before: { col: col, row: row },
    //   after: { col: newCol, row: newRow },
    // }).then(async (response) => {
    //   console.log(response);
    //   if (response.errors) {
    //     // requestLogs.insertOne({
    //     //   error: response.errors,
    //     //   board
    //     // });
    //     throw response.errors;
    //   }
    //   if (response.data.chessMove === "White win!") {
    //     requestLogs.insertOne({ status: response.data.chessMove, board });
    //   }
    //   changeLocationChess({
    //     before: { col, row },
    //     after: { col: newCol, row: newRow },
    //   });
    // });
};
