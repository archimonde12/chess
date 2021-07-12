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
const checkMove_RookIsWin = (col: number, row: number) => {
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
const checkMove_KnightIsWin = (col: number, row: number) => {
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
const checkMove_BishopIsWin = (col: number, row: number) => {
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
const checkMove_KingIsWin = (col: number, row: number) => {
  const king = board.find((el) => el.value === "♚") as Cell;
  let isCheck = true;
  if (king) {
    Hxy.forEach((element) => {
      const u = king.col + element.x;
      const v = king.row + element.y;
      if (u == col && v == row) {
        isCheck = false;
        return false;
      }
    });
  }
  return isCheck;
};
const checkKnightMoveIsInvalid = (location: locationMove) => {
  const { before, after } = location;
  const find = board.find((el) => el.col === after.col && el.row === after.row) as Cell;
  if (find.value !== "" && find.value !== "♚" && find.value !== "♜" && find.value !== "♞" && find.value !== "♝") {
    return false;
  }
  return true;
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
const rookMoveIsInvalid = (location: locationMove): boolean=> {
  const { before, after } = location;
  const find = board.find(
    (el) => el.col === after.col && el.row === after.row
  ) as Cell;
  if (find.value !== "" && find.value !== "♚" && find.value !== "♜" && find.value !== "♞" && find.value !== "♝") {
    console.log('vào 1')
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
    console.log('vào 2')
    return false;
  }
  for (let i = a; i <= n; i++) {
    arr.push(i);
  }
  if (before.col === after.col) {
    for(let el of arr) {
      if (
        board.find(
          (ele) =>
            ele.col === before.col &&
            ele.row === el &&
            ele.value !== "" &&
            ele.value !== "♚" &&
            ele.value !== "♜" &&
            ele.value !== "♞" &&
            ele.value !== "♝" &&
            ele.value !== "♖"
        )
      ) {
        console.log('vào 3')
        return false;
      }
    };
  } else {
    for(let el of arr) {
      if (
        board.find(
          (ele) =>
            ele.row === before.row &&
            ele.col === el &&
            ele.value !== "" &&
            ele.value !== "♚" &&
            ele.value !== "♜" &&
            ele.value !== "♞" &&
            ele.value !== "♝" &&
            ele.value !== "♖"
        )
      ) {
        console.log('4')
        return false;
      }
    };
  }
  return true;
};
const checkBishopMoveIsInvalid = (location: locationMove) : boolean => {
  const { before, after } = location;
  const find = board.find(
    (el) => el.col === after.col && el.row === after.row
  ) as Cell;
  if (find.value !== "" && find.value !== "♚" && find.value !== "♜" && find.value !== "♞" && find.value !== "♝") {
    return false;
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
            el.value !== "♚" &&
            el.value !== "♜" &&
            el.value !== "♞" &&
            el.value !== "♝"
        )
      ) {
        return false;
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
            el.value !== "♚" &&
            el.value !== "♜" &&
            el.value !== "♞" &&
            el.value !== "♝"
        )
      ) {
        return false;
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
            el.value !== "♚" &&
            el.value !== "♜" &&
            el.value !== "♞" &&
            el.value !== "♝"
        )
      ) {
        return false;
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
const checkKingMoveIsInvalid = (location: locationMove) : boolean => {
  const { before, after } = location;
  const find = board.find((el) => el.col === after.col && el.row === after.row) as Cell;
  if (find.value !== "" && find.value !== "♚" && find.value !== "♜" && find.value !== "♞" && find.value !== "♝") {
    return false;
  }
  for(let king of Kxy) {
    if(before.col + king.x === after.col && before.row + king.y === after.row) {
      return true;
    }
  }
  return false;
};
const checkKingWin = (col: number, row: number) => {
  for (let knight of Kxy) {
    let u = col + knight.x;
    let v = row + knight.y;
    const find = board.find((el) => el.col === u && el.row === v) as Cell;
    if (u < 8 && u >= 0 && v < 8 && v >= 0 && 
      checkMove_RookIsWin(u, v) &&
      checkMove_KnightIsWin(u, v) &&
      checkMove_BishopIsWin(u, v)) {
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
      checkMove_RookIsWin(newCol, newRow) &&
      checkMove_KnightIsWin(newCol, newRow) &&
      checkMove_BishopIsWin(newCol, newRow) &&
      checkMove_KingIsWin(newCol, newRow)
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
  return 'Black win!';
};
const rookMove = (col: number, row: number) => {
  var rand = Math.floor(Math.random() * 15) - 7;
  var local = Math.floor(Math.random() * 2);
  let newCol = col;
  let newRow = row;
  local === 1 ? (newCol = rand + col) : (newRow = rand + row);
  console.log('xxxx: ', newCol, newRow)
  if (newCol >= 0 && newCol < 8 && newRow >= 0 && newRow < 8) {
    if(
    checkMove_RookIsWin(newCol, newRow) &&
    checkMove_KnightIsWin(newCol, newRow) &&
    checkMove_BishopIsWin(newCol, newRow) &&
    checkMove_KingIsWin(newCol, newRow) &&
    rookMoveIsInvalid({before: { col, row }, after: { col: newCol, row: newRow }})){
      return { newCol, newRow };
    }
  }
  return rookMove(col, row);
};
const knightMove = (col: number, row: number) => {
  var arrRands = arrRand.concat();
  var isCheck = false;
  while (!isCheck && arrRands.length > 0) {
    const index = Math.floor(Math.random() * arrRands.length);
    const rand = arrRands[index];
    console.log('rand knight:', rand);
    arrRands.splice(index, 1);
    let newCol = col + Hxy[rand].x;
    var newRow = row + Hxy[rand].y;
    if (
      newCol >= 0 &&
      newCol < 8 &&
      newRow >= 0 &&
      newRow < 8 &&
      checkKnightMoveIsInvalid({before: { col, row }, after: { col: newCol, row: newRow },}) &&
      checkMove_RookIsWin(newCol, newRow) &&
      checkMove_KnightIsWin(newCol, newRow) &&
      checkMove_BishopIsWin(newCol, newRow) &&
      checkMove_KingIsWin(newCol, newRow)
    ) {
      isCheck = true;
      return { newCol, newRow };
    }
  }
  console.log('Mã hết đường đi!')
  return 'Hết đường đi'!
};
const bishopMove = (col: number, row: number) => {
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
    checkBishopMoveIsInvalid({before: { col, row }, after: { col: newCol, row: newRow },}) &&
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
        if(isChessMan.value === '') {
          throw new Error("Không có quân cờ ở vị trí xuất phát");
        }
        // switch (isChessMan.value) {
        //   // Kiểm tra nước đi có phù hợp không
        //   case "♜":
        //     // checkRookMoveIsInvalid({ before, after });
        //     break;
        //   case "♞":
        //     if (!checkKnightMoveIsInvalid({ before, after })) {
        //       throw new Error("Mã đen di chuyển không hợp lệ!");
        //     };
        //     break;
        //   case "♝":
        //     if(!checkBishopMoveIsInvalid({ before, after })) {
        //       throw new Error("Tượng đen di chuyển không hợp lệ!")
        //     };
        //     break;
        //   case "♚":
        //     if(!checkKingMoveIsInvalid({ before, after })) {
        //       throw new Error("King đen di chuyển không hợp lệ!")
        //     };
        //     break;
        //   default:
        //     throw new Error("Không có quân cờ ở vị trí xuất phát");
        // }
        changeLocationChess({ before, after });
        
        //Xử lý nước đi tiếp theo của mình=> gửi nước đi tiếp theo cho server đối thủ => Lưu log cái request gửi đi
        //Trả kết quả
        const locationKing = board.find((el) => el.value === "♔") as Cell;
        const chessWhites = getChessMan(['♖', '♘', '♗']).concat(); 
        const rand = chessWhites[Math.floor(Math.random() * chessWhites.length)];
        console.log(rand)
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
          var col = rand.col;
          var row = rand.row;
          switch (rand.value) {
            case "♖":
              var { newCol, newRow } = rookMove(rand.col, rand.row) as newLocation;
              break;
            case "♘":
              var { newCol, newRow } = knightMove(rand.col, rand.row) as newLocation;
              break;
            case "♗":
              var { newCol, newRow } = bishopMove(rand.col, rand.row) as newLocation;
              break;
            default:
              throw new Error("Không có quân cờ ở vị trí xuất phát");
          }
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
        const rand = chessWhites[Math.floor(Math.random() * chessWhites.length)];
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
          var col = rand.col;
          var row = rand.row;
          switch (rand.value) {
            case "♖":
              var { newCol, newRow } = rookMove(rand.col, rand.row) as newLocation;
              break;
            case "♘":
              var { newCol, newRow } = knightMove(rand.col, rand.row) as newLocation;
              break;
            case "♗":
              var { newCol, newRow } = bishopMove(rand.col, rand.row) as newLocation;
              break;
            default:
              throw new Error("Không có quân cờ ở vị trí xuất phát");
          }
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
