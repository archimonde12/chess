import { PubSub, withFilter } from "apollo-server";
import { bishopMove, checkBishopWin } from "./chess/logic-Bishop";
import { checkKingWin, kingMove, Kxy } from "./chess/logic-King";
import { checkKnightWin, Hxy, knightMove } from "./chess/logic-Knight";
import { checkRookWin, rookMove } from "./chess/logic-Rook";
import { errorConsoleLog } from "./color-log";
import { requestLogs } from "./mongo";
import { sendRequestToServer } from "./util";
export const pubsub = new PubSub();
export const BOARD_CHANEL = "UPDATED_BOARD";

export const arrRand = [0, 1, 2, 3, 4, 5, 6, 7];
export const iconChessBlacks = ['♚', '♜', '♞', '♝'];
export const iconChessWhites = ['♔', '♖', '♘', '♗'];
export type Cell = {
  col: number;
  row: number;
  value: String;
};
export type locationMove = {
  before: { col: number; row: number };
  after: { col: number; row: number };
};
export type newLocation = {
  newCol: number;
  newRow: number;
}
export var isWin = '';
export let board: Cell[] = (() => {
  let result: Cell[] = [];
  for (let col = 0; col < 8; col++) {
    for (let row = 0; row < 8; row++) {
      result.push({
        col,
        row,
        value: "",
      });
    }
  }
  return result;
})();

export const getChessMan = (chess: Array<String>) : Cell[] => {
  const result: Array<Cell> = [];
  chess.map(element => {
    if(board.find(el => el.value === element) as Cell) {
      result.push(board.find(el => el.value === element) as Cell);
    }
  })
  return result;
};

export const checkMove_RookIsWin = (col: number, row: number) => {
  const rook = board.find((el) => el.value === "♜") as Cell;
  let isCheck = true;
  if (rook) {
    if ((col === rook.col && row !== rook.row) || (row === rook.row && col !== rook.col)) {
      isCheck = false;
      return false;
    }
  }
  return isCheck;
};
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
export const checkMove_KnightIsWin = (col: number, row: number) => {
  const knight = board.find((el) => el.value === "♞") as Cell;
  let isCheck = true;
  if (knight) {
    Hxy.forEach((element) => {
      const u = knight.col + element.x;
      const v = knight.row + element.y;
      if (u == col && v == row) {
        isCheck = false;
        return false;
      }
    });
  }
  return isCheck;
};
export const checkMove_KingIsWin = (col: number, row: number) => {
  const king = board.find((el) => el.value === "♚") as Cell;
  if (king) {
    for(let element of Kxy) {
      const u = king.col + element.x;
      const v = king.row + element.y;
      if (u === col && v === row) {
        return false;
      }
    };
  }
  return true;
};
const changeLocationChess = (value: locationMove) => {
  const valueAtBefore = board[value.before.col * 8 + value.before.row].value;
  board[value.before.col * 8 + value.before.row].value = "";
  board[value.after.col * 8 + value.after.row].value = valueAtBefore;
  // pubsub.publish(BOARD_CHANEL, { boardSub: board });
};
const chooseChessPieces = (chessWhites: Array<Cell>, chessBlacks: Array<Cell>) => {
  type newLoca = {
    col: number,
    row: number,
    newCol: number,
    newRow: number,
  };
  if (checkKingWin(chessBlacks)) {
    var { col, row, newCol, newRow } = checkKingWin(chessBlacks) as newLoca;
  } else if (checkRookWin(chessBlacks)) {
    var { col, row, newCol, newRow } = checkRookWin(chessBlacks) as newLoca;
  } else if (checkKnightWin(chessBlacks)) {
    var { col, row, newCol, newRow } = checkKnightWin(chessBlacks) as newLoca;
  } else if (checkBishopWin(chessBlacks)) {
    var { col, row, newCol, newRow } = checkBishopWin(chessBlacks) as newLoca;
  } else {
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
    if(!newCol && !newRow && chessWhites.length > 1) {
      chooseChessPieces(chessWhites, chessBlacks);
    }
  }
  return {
    col,
    row,
    newCol,
    newRow
  }
}
export const resolvers = {
  Query: {
    boardGet: () => {
      return board;
    },
    getBoard: () => {
      return {
        board: board,
        status: 200,
        isWin,
      }
    }
  },
  Mutation: {
    chessMove: async (parent,args: locationMove,ctx,info) => {
      try {
        // Request
        const { before, after } = args;
        console.log(before, after);
        // Lưu lại tọa độ di chuyển của đối thủ
        await requestLogs.insertOne({ content: "công move", before, after});
        // Kiểm tra có quân cờ hay không
        const isChessMan = board.find(
          (el) => el.col === before.col && el.row === before.row
        ) as Cell;
        if(isChessMan.value === '') {
          throw new Error("Không có quân cờ ở vị trí xuất phát");
        }
        changeLocationChess({ before, after });
        //Xử lý nước đi tiếp theo của mình=> gửi nước đi tiếp theo cho server đối thủ => Lưu log cái request gửi đi
        //Trả kết quả
        const locationKing = board.find((el) => el.value === "♔") as Cell;
        const chessWhites = getChessMan(iconChessWhites).concat(); 
        const chessBlacks = getChessMan(iconChessBlacks).concat();
        if (!locationKing) {
          console.log("You Lose!");
          isWin = 'Black win!'
          return 'Black win!'
        }
        if (!checkMove_RookIsWin(locationKing.col, locationKing.row) ||
            !checkMove_KnightIsWin(locationKing.col, locationKing.row) || 
            !checkMove_BishopIsWin(locationKing.col, locationKing.row) ||
            chessWhites.length < 1) {
          var { newCol, newRow } = kingMove(locationKing.col, locationKing.row) as newLocation;
          var col = locationKing.col;
          var row = locationKing.row;
        } else {
          var { col, row, newCol, newRow } = chooseChessPieces(chessWhites, chessBlacks);
        }
        setTimeout(async () => {
          await requestLogs.insertOne({
            content: "White move",
            before: { col, row },
            after: { col: newCol, row: newRow },
          });
          console.log('request: ', col, row, newCol, newRow )
          // Gửi request chessMove ở sever của công
          sendRequestToServer({
            before: { col: col, row: row },
            after: { col: newCol, row: newRow },
          }).then(async (response) => {
            console.log(response)
            if(response.errors){
              // requestLogs.insertOne({
              //   error: response.errors,
              //   board
              // });
              throw response.errors;
            }
            if(response.data.chessMove === 'White win!'){
              isWin = response.data.chessMove;
              requestLogs.insertOne({ status: response.data.chessMove, board });
            }
            changeLocationChess({
              before: { col, row },
              after: { col: newCol, row: newRow },
            });
          });
        }, 1000);
        return "OK";
      } catch (error) {
        requestLogs.insertOne({ status: 500, error: error.message, board});
        console.log(error);
        throw error;
      }
    },
    start: async () => {
      try {
        const locationKing = board.find((el) => el.value === "♔") as Cell;
        const chessWhites = getChessMan(['♖', '♘', '♗']).concat();
        const chessBlacks = getChessMan(iconChessBlacks).concat();
        if (!locationKing) {
          console.log("You Lose!");
          isWin = 'Black win!'
          return 'Black win!';
        }
        if (!checkMove_RookIsWin(locationKing.col, locationKing.row) ||
            !checkMove_KnightIsWin(locationKing.col, locationKing.row) || 
            !checkMove_BishopIsWin(locationKing.col, locationKing.row) ||
            chessWhites.length < 1) {
          var { newCol, newRow } = kingMove(locationKing.col, locationKing.row) as newLocation;
          var col = locationKing.col;
          var row = locationKing.row;
        } else {
          var { col, row, newCol, newRow } = chooseChessPieces(chessWhites, chessBlacks);
        }
        // Gửi request
        await requestLogs.insertOne({
          content: "White move",
          before: { col, row },
          after: { col: newCol, row: newRow },
        });
        console.log('request: ', col, row, newCol, newRow )
        sendRequestToServer({
          before: { col, row },
          after: { col: newCol, row: newRow },
        }).then(async(response) => {
          if(response.errors){
            // requestLogs.insertOne({
            //   Error: response.errors,
            //   board
            // });
            throw response.errors;
          }
          if(response.data.chessMove === 'OK'){
            changeLocationChess({
              before: { col, row },
              after: { col: newCol, row: newRow },
            });
          }
        });
        return "OK";
      } catch (error) {
        requestLogs.insertOne({ status: 500, error: error.message, board});
        console.log(error);
        throw error;
      }
    },
    boardInit: (parent, args, ctx, info) => {
      const { init } = args as {
        init: { col: number; row: number; value: String }[];
      };
      board = (() => {
        let result: Cell[] = [];
        for (let col = 0; col < 8; col++) {
          for (let row = 0; row < 8; row++) {
            result.push({
              col,
              row,
              value:
                init.find((val) => val.col === col && val.row === row)?.value ||
                "",
            });
          }
        }
        return result;
      })();
      pubsub.publish(BOARD_CHANEL, { boardSub: board });
      return board;
    },
    newGame: () => {
      isWin = '';
      return 'OK';
    }
  },
  Subscription: {
    boardSub: {
      subscribe: () => pubsub.asyncIterator([BOARD_CHANEL]),
    },
  },
};
