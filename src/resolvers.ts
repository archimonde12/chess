import { PubSub } from "apollo-server";
import { changeLocationChess, chooseChessPieces } from "./chess/handlingMove";
import { checkBishopMoveIsInvalid } from "./chess/handl-Bishop";
import { kingMove, Kxy } from "./chess/handl-King";
import { Hxy } from "./chess/handl-Knight";
import { rookMoveIsInvalid } from "./chess/handl-Rook";
import { Cell, locationMove, newLocation } from "./chess/type";
import { requestLogs } from "./mongo";
import { initBoard, sendRequestToServer } from "./util";
export const pubsub = new PubSub();
export const BOARD_CHANEL = "UPDATED_BOARD";

export const arrRand = [0, 1, 2, 3, 4, 5, 6, 7];
export const iconChessBlacks = ["♚", "♜", "♞", "♝"];
export const iconChessWhites = ["♔", "♖", "♘", "♗"];

export var isWin = "";
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

export const getChessMan = (chess: Array<String>): Cell[] => {
  const result: Array<Cell> = [];
  chess.map((element) => {
    if (board.find((el) => el.value === element) as Cell) {
      result.push(board.find((el) => el.value === element) as Cell);
    }
  });
  return result;
};

export const checkMove_RookIsWin = (col: number, row: number, chess: String): boolean => {
  const rook = board.find((el) => el.value === "♜") as Cell;
  if (rook) {
    if (
      (col === rook.col && row !== rook.row) ||
      (row === rook.row && col !== rook.col)
    ) {
      if (
        rookMoveIsInvalid({
          before: { col, row },
          after: { col: rook.col, row: rook.row },
        }, chess)
      ) {
        return false;
      }
    }
  }
  return true;
};
export const checkMove_BishopIsWin = (col: number, row: number): boolean => {
  const bishop = board.find((el) => el.value === "♝") as Cell;
  if (bishop) {
    for (let i = -7; i < 8; i++) {
      if (col + i == bishop.col && row + i == bishop.row && i != 0) {
        if (
          checkBishopMoveIsInvalid({
            before: { col, row },
            after: { col: bishop.col, row: bishop.row },
          })
        ) {
          return false;
        }
      } else if (col + i == bishop.col && row - i == bishop.row && i != 0) {
        if (
          checkBishopMoveIsInvalid({
            before: { col, row },
            after: { col: bishop.col, row: bishop.row },
          })
        ) {
          return false;
        }
      }
    }
  }
  return true;
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
    for (let element of Kxy) {
      const u = king.col + element.x;
      const v = king.row + element.y;
      if (u === col && v === row) {
        return false;
      }
    }
  }
  return true;
};

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
      };
    },
  },
  Mutation: {
    chessMove: async (parent, args: locationMove, ctx, info) => {
      try {
        // Request
        const { before, after } = args;
        console.log(before, after);
        // Lưu lại tọa độ di chuyển của đối thủ
        await requestLogs.insertOne({ content: "Black move", before, after });
        // Kiểm tra có quân cờ hay không
        const isChessMan = board.find(
          (el) => el.col === before.col && el.row === before.row
        ) as Cell;
        if (isChessMan.value === "") {
          throw new Error("Không có quân cờ ở vị trí xuất phát");
        }
        changeLocationChess({ before, after });
        //Xử lý nước đi tiếp theo của mình=> gửi nước đi tiếp theo cho server đối thủ => Lưu log cái request gửi đi
        //Trả kết quả
        const locationKing = board.find((el) => el.value === "♔") as Cell;
        const chessWhites = getChessMan(["♖", "♘", "♗"]).concat();
        const chessBlacks = getChessMan(iconChessBlacks).concat();
        if (!locationKing) {
          console.log("You Lose!");
          isWin = 'Black win!';
          return "Black win!";
        }
        if (
          !checkMove_RookIsWin(locationKing.col, locationKing.row, locationKing.value) ||
          !checkMove_KnightIsWin(locationKing.col, locationKing.row) ||
          !checkMove_BishopIsWin(locationKing.col, locationKing.row)
        ) {
          var { newCol, newRow } = kingMove(
            locationKing.col,
            locationKing.row
          ) as newLocation;
          var col = locationKing.col;
          var row = locationKing.row;
        } else {
          var { col, row, newCol, newRow } = chooseChessPieces(
            chessWhites,
            chessBlacks
          ) as { col: number; row: number; newCol: number; newRow: number };
        }
        requestLogs.insertOne({
          content: "White move",
          before: { col, row },
          after: { col: newCol, row: newRow },
        });
        console.log("request: ", col, row, newCol, newRow);
        // Gửi request chessMove ở sever của công
        setTimeout(() => {
          sendRequestToServer({
            before: { col: col, row: row },
            after: { col: newCol, row: newRow },
          }).then(async (response) => {
            console.log(response);
            if (response.errors) {
              // requestLogs.insertOne({
              //   error: response.errors,
              //   board
              // });
              throw response.errors;
            }
            if (response.data.chessMove === "White win!") {
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
        requestLogs.insertOne({ status: 500, error: error.message, board });
        console.log(error);
        throw error;
      }
    },
    start: async () => {
      try {
        const locationKing = board.find((el) => el.value === "♔") as Cell;
        const chessWhites = getChessMan(["♖", "♘", "♗"]).concat();
        const chessBlacks = getChessMan(iconChessBlacks).concat();
        if (!locationKing) {
          console.log("You Lose!");
          return "Black win!";
        }
        if (
          !checkMove_RookIsWin(locationKing.col, locationKing.row, locationKing.value) ||
          !checkMove_KnightIsWin(locationKing.col, locationKing.row) ||
          !checkMove_BishopIsWin(locationKing.col, locationKing.row)
        ) {
          var { newCol, newRow } = kingMove(
            locationKing.col,
            locationKing.row
          ) as newLocation;
          var col = locationKing.col;
          var row = locationKing.row;
          console.log("cần né!");
        } else {
          var { col, row, newCol, newRow } = chooseChessPieces(
            chessWhites,
            chessBlacks
          ) as { col: number; row: number; newCol: number; newRow: number };
        }
        requestLogs.insertOne({
          content: "White move",
          before: { col, row },
          after: { col: newCol, row: newRow },
        });
        console.log("request: ", col, row, newCol, newRow);
        // Gửi request chessMove ở sever của công
          sendRequestToServer({
            before: { col: col, row: row },
            after: { col: newCol, row: newRow },
          }).then(async (response) => {
            console.log(response);
            if (response.errors) {
              throw response.errors;
            }
            if (response.data.chessMove === "White win!") {
              requestLogs.insertOne({ status: response.data.chessMove, board });
            }
            changeLocationChess({
              before: { col, row },
              after: { col: newCol, row: newRow },
            });
          });
        return "OK";
      } catch (error) {
        requestLogs.insertOne({ status: 500, error: error.message, board });
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
      isWin = "";
      initBoard();
      return "OK";
    },
  },
  Subscription: {
    boardSub: {
      subscribe: () => pubsub.asyncIterator([BOARD_CHANEL]),
    },
  },
};

