import { PubSub, withFilter } from "apollo-server";
import { errorConsoleLog } from "./color-log";
import { requestLogs } from "./mongo";
import { sendRequestToServer } from "./util";
export const pubsub = new PubSub();
export const BOARD_CHANEL = "UPDATED_BOARD";

const Kxy = [
  { x: 0, y: -1 },
  { x: 0, y: 1 },
  { x: -1, y: 0 },
  { x: 1, y: 0 },
  { x: -1, y: -1 },
  { x: 1, y: -1 },
  { x: -1, y: 1 },
  { x: 1, y: 1 },
];
const Hxy = [
  { x: -2, y: -1 },
  { x: -2, y: 1 },
  { x: -1, y: -2 },
  { x: -1, y: 2 },
  { x: 1, y: -2 },
  { x: 1, y: 2 },
  { x: 2, y: -1 },
  { x: 2, y: 1 },
];
const arrRand = [0, 1, 2, 3, 4, 5, 6, 7];
const iconChessBlacks = ['♚', '♜', '♞', '♝'];
const iconChessWhites = ['♔', '♖', '♘', '♗'];
type Cell = {
  col: number;
  row: number;
  value: String;
};
type locationMove = {
  before: { col: number; row: number };
  after: { col: number; row: number };
};
type newLocation = {
  newCol: number;
  newRow: number;
}
let board: Cell[] = (() => {
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

const getChessMan = (chess: Array<String>) : Cell[] => {
  const result: Array<Cell> = [];
  chess.map(element => {
    if(board.find(el => el.value === element) as Cell) {
      result.push(board.find(el => el.value === element) as Cell);
    }
  })
  return result;
};
var isWin = '';
const checkKingMove_RookIsWin = (col: number, row: number) => {
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
const checkKingMove_KnightIsWin = (col: number, row: number) => {
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
const checkKingMove_BishopIsWin = (col: number, row: number) => {
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
const checkKnightMoveIsInvalid = (location: locationMove) => {
  const { before, after } = location;
  const find = board.find((el) => el.col === after.col && el.row === after.row) as Cell;
  if (find.value !== "" && find.value !== "♔") {
    throw new Error("Mã đen di chuyển không hợp lệ!");
  }
  for(let knight of Hxy) {
    if(before.col + knight.x === after.col && before.row + knight.y === after.row) {
      return true;
    }
  }
  throw new Error('Mã đen di chuyển không hợp lệ!');
};
const checkRookMoveIsInvalid = (location: locationMove) => {
  const { before, after } = location;
  const find = board.find(
    (el) => el.col === after.col && el.row === after.row
  ) as Cell;
  var isCheck = true;
  if (find.value !== "" && find.value !== "♔") {
    throw new Error("Xe đen di chuyển không hợp lệ!");
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
    throw new Error("Xe đen di chuyển không hợp lệ!");
  }
  for (let i = a; i <= n; i++) {
    arr.push(i);
  }
  if (before.col === after.col) {
    arr.every((el) => {
      if (
        board.find(
          (ele) =>
            ele.col === before.col &&
            ele.row === el &&
            ele.value !== "" &&
            ele.value !== "♔" &&
            ele.value !== "♜"
        )
      ) {
        throw new Error("Xe đen di chuyển không hợp lệ!");
      }
      return true;
    });
  } else {
    arr.every((el) => {
      if (
        board.find(
          (ele) =>
            ele.row === before.row &&
            ele.col === el &&
            ele.value !== "" &&
            ele.value !== "♔" &&
            ele.value !== "♜"
        )
      ) {
        throw new Error("Xe đen di chuyển không hợp lệ!");
      }
      return true;
    });
  }
  return true;
};
const rookMoveIsInvalid = (location: locationMove) => {
  const { before, after } = location;
  const find = board.find(
    (el) => el.col === after.col && el.row === after.row
  ) as Cell;
  let isCheck = true;
  if (find.value !== "" && find.value !== "♔") {
    isCheck = false;
    return false;
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
    isCheck = false;
    return false;
  }
  for (let i = a; i <= n; i++) {
    arr.push(i);
  }
  if (before.col === after.col) {
    arr.every((el) => {
      if (
        board.find(
          (ele) =>
            ele.col === before.col &&
            ele.row === el &&
            ele.value !== "" &&
            ele.value !== "♔" &&
            ele.value !== "♜"
        )
      ) {
        isCheck = false;
        return false;
      }
      return true;
    });
  } else {
    arr.every((el) => {
      if (
        board.find(
          (ele) =>
            ele.row === before.row &&
            ele.col === el &&
            ele.value !== "" &&
            ele.value !== "♔" &&
            ele.value !== "♜"
        )
      ) {
        isCheck = false;
        return false;
      }
      return true;
    });
  }
  return true;
};
const checkBishopMoveIsInvalid = (location: locationMove) => {
  const { before, after } = location;
  const find = board.find(
    (el) => el.col === after.col && el.row === after.row
  ) as Cell;
  if (find.value !== "" && find.value !== "♔") {
    throw new Error("Tượng đen di chuyển không hợp lệ!");
  }
  var range: number;
  range =
    before.col > after.col ? before.col - after.col : after.col - before.col;
  if (after.col > before.col && after.row > before.row) {
    for (let i = 1; i <= range; i++) {
      if (
        board.find(
          (el) =>
            el.col === before.col + i &&
            el.row === before.row + i &&
            el.value !== "" &&
            el.value !== "♔"
        )
      ) {
        throw new Error("Tượng đen di chuyển không hợp lệ!");
      }
    }
  }
  else if (after.col < before.col && after.row < before.row) {
    for (let i = 1; i <= range; i++) {
      if (
        board.find(
          (el) =>
            el.col === before.col - i &&
            el.row === before.row - i &&
            el.value !== "" &&
            el.value !== "♔"
        )
      ) {
        throw new Error("Tượng đen di chuyển không hợp lệ!");
      }
    }
  }
  else if (after.col > before.col && after.row < before.row) {
    for (let i = 1; i <= range; i++) {
      if (
        board.find(
          (el) =>
            el.col === before.col + i &&
            el.row === before.row - i &&
            el.value !== "" &&
            el.value !== "♔"
        )
      ) {
        throw new Error("Tượng đen di chuyển không hợp lệ!");
      }
    }
  }
  else if (after.col < before.col && after.row > before.row) {
    for (let i = 1; i <= range; i++) {
      if (
        board.find(
          (el) =>
            el.col === before.col - i &&
            el.row === before.row + i &&
            el.value !== "" &&
            el.value !== "♔"
        )
      ) {
        throw new Error("Tượng đen di chuyển không hợp lệ!");
      }
    }
  } else {
    throw new Error("Tượng đen di chuyển không hợp lệ!");
  }
  return true;
};
const checkKingMoveIsInvalid = (location: locationMove) => {

};
const checkKingWin = (col: number, row: number) => {
  for (let knight of Kxy) {
    let u = col + knight.x;
    let v = row + knight.y;
    const find = board.find((el) => el.col === u && el.row === v) as Cell;
    if (u < 8 && u >= 0 && v < 8 && v >= 0 && 
      checkKingMove_RookIsWin(u, v) &&
      checkKingMove_KnightIsWin(u, v) &&
      checkKingMove_BishopIsWin(u, v)) {
      if (find.value != "") {
        return {
          newCol: u,
          newRow: v,
        };
      }
    }
  }
  return false;
};
const kingMove = (col: number, row: number) => {
  let arrRands = arrRand.concat();
  let isCheck = false;
  if (checkKingWin(col, row)) {
    const { newCol, newRow } = checkKingWin(col, row) as newLocation;
    return { newCol, newRow };
  }
  while (!isCheck || arrRands.length > 0) {
    const index = Math.floor(Math.random() * arrRands.length);
    const rand = arrRands[index];
    const newCol: number = col + Kxy[rand].x;
    const newRow: number = row + Kxy[rand].y;
    arrRands.splice(index, 1);
    if (
      newCol >= 0 &&
      newCol < 8 &&
      newRow >= 0 &&
      newRow < 8 &&
      checkKingMove_RookIsWin(newCol, newRow) &&
      checkKingMove_KnightIsWin(newCol, newRow) &&
      checkKingMove_BishopIsWin(newCol, newRow)
    ) {
      isCheck = true;
      return {
        newCol,
        newRow,
      };
    }
  }
  console.log("Hết đường đi!");
  isWin = 'Black win!';
  return {
    chessMove: 'OK',
    messager: 'Black win!'
  };
};
const rookMove = (col: number, row: number) => {
  var rand = Math.floor(Math.random() * 15) - 7;
  var local = Math.floor(Math.random() * 2);
  let newCol = col;
  let newRow = row;
  local === 1 ? (newCol = rand + col) : (newRow = rand + row);
  if (
    newCol >= 0 &&
    newCol < 8 &&
    newRow >= 0 &&
    newRow < 8 &&
    rookMoveIsInvalid({
      before: { col, row },
      after: { col: newCol, row: newRow },
    })
  ) {
    return { newCol, newRow };
  }
  return rookMove(col, row);
};
const changeLocationChess = (value: locationMove) => {
  const valueAtBefore = board[value.before.col * 8 + value.before.row].value;
  board[value.before.col * 8 + value.before.row].value = "";
  board[value.after.col * 8 + value.after.row].value = valueAtBefore;
  // pubsub.publish(BOARD_CHANEL, { boardSub: board });
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
        switch (isChessMan.value) {
          // Kiểm tra nước đi có phù hợp không
          case "♜":
            checkRookMoveIsInvalid({ before, after });
            break;
          case "♞":
            checkKnightMoveIsInvalid({ before, after });
            break;
          case "♝":
            checkBishopMoveIsInvalid({ before, after });
            break;
          case "♚":
            checkKingMoveIsInvalid({ before, after });
            break;
          default:
            throw new Error("Không có quân cờ ở vị trí xuất phát");
        }
        changeLocationChess({ before, after });
        
        //Xử lý nước đi tiếp theo của mình=> gửi nước đi tiếp theo cho server đối thủ => Lưu log cái request gửi đi
        //Trả kết quả
        const locationKing = board.find((el) => el.value === "♔") as Cell;
        if (!locationKing) {
          console.log("You Lose!");
          isWin = 'Black win!'
          return {
            chessMove: 'OK',
            messager: 'Black win!'
          };
        } 
        
        var { newCol, newRow } = kingMove(
          locationKing.col,
          locationKing.row) as {newCol: number; newRow: number;};
        // else {
        //   chessWhites.push(locationKing);
        // }
        // const locationRook = board.find((el) => el.value === "♖") as Cell;
        // if (locationRook) {
        //   chessWhites.push(locationRook);
        // }
        // const rand = chessWhites[Math.floor(Math.random() * chessWhites.length)];
        // switch (rand.value) {
        //   case '♔':
        //     var { newCol, newRow } = kingMove(
        //       rand.col,
        //       rand.row) as {newCol: number; newRow: number;};
        //     break;
        //   case '♖':
        //     var { newCol, newRow } = rookMove(
        //       rand.col,
        //       rand.row) as {newCol: number; newRow: number;};
        //     break;
        // }
        setTimeout(async () => {
          await requestLogs.insertOne({
            content: "Tuân move",
            before: { col: locationKing.col, row: locationKing.row },
            after: { col: newCol, row: newRow },
          });
          console.log('request: ', locationKing.col, locationKing.row, newCol, newRow )
          // Gửi request chessMove ở sever của công
          sendRequestToServer({
            before: { col: locationKing.col, row: locationKing.row },
            after: { col: newCol, row: newRow },
          }).then(async (response) => {
            console.log(response)
            if(response.errors){
              requestLogs.insertOne({
                error: response[0].errors.message,
                board
              });
              throw response.errors;
            }
            if(response.data.chessMove === 'White win!'){
              isWin = response.data.chessMove;
              requestLogs.insertOne({ status: response.data.chessMove, board });
            }
            changeLocationChess({
              before: { col: locationKing.col, row: locationKing.row },
              after: { col: newCol, row: newRow },
            });
          });
        }, 500);
        return "OK";
      } catch (error) {
        requestLogs.insertOne({ status: 500, error: error.message, board});
        console.log(error.message);
        throw error;
      }
    },
    start: async () => {
      // try {
      //   const { col, row } = board.find((el) => el.value === "♔") as Cell;

      //   const { newCol, newRow } = kingMove(col, row) as {
      //     newCol: number;
      //     newRow: number;
      //   };
      //   // Gửi request
      //   await requestLogs.insertOne({
      //     content: "Tuân move",
      //     before: { col: col, row: row },
      //     after: { col: newCol, row: newRow },
      //   });
      //   sendRequestToServer({
      //     before: { col: col, row: row },
      //     after: { col: newCol, row: newRow },
      //   }).then(async(response) => {
      //     if(response.errors){
      //       requestLogs.insertOne({
      //         Error: response[0].errors,
      //         board
      //       });
      //       throw response.errors;
      //     }
      //     if(response.data.chessMove === 'OK'){
      //       changeLocationChess({
      //         before: { col: col, row: row },
      //         after: { col: newCol, row: newRow },
      //       });
      //     }
      //   });
      //   return "OK";
      // } catch (error) {
      //   console.log(error);
      //   requestLogs.insertOne(error);
      //   throw error;
      // }
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
