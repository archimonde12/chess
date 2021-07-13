import { PubSub, withFilter } from "apollo-server";
import { checkMove_BishopIsWin } from "./chess/checkMove_BishopIsWin";
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
export type Cell = {
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

const checkMove_KingIsWin = (col: number, row: number) => {
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
const checkKnightMoveIsInvalid = (location: locationMove) : boolean=> {
  const { after } = location;
  const allys = getChessMan(iconChessWhites).concat();
  for(let ally of allys){
    if(ally.col === after.col && ally.row === after.row) {
      return false;
    }
  }
  return true;
};
const checkRookMoveIsInvalid = (location: locationMove) => {
  const { before, after } = location;
  const allys = getChessMan(iconChessWhites).concat();
  for(let ally of allys){
    if(ally.col === after.col && ally.row === after.row) {
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
  const allys = getChessMan(iconChessWhites).concat();
  for(let ally of allys){
    if(ally.col === after.col && ally.row === after.row) {
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
    for(let el of arr) {
      if (
        board.find(
          (ele) =>
            ele.col === before.col &&
            ele.row === el &&
            ele.value !== ""
        )
      ) {
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
            ele.value !== ""
        )
      ) {
        return false;
      }
    };
  }
  return true;
};
const checkBishopMoveIsInvalid = (location: locationMove) : boolean => {
  const { before, after } = location;
  const allys = getChessMan(iconChessWhites).concat();
  for(let ally of allys){
    if(ally.col === after.col && ally.row === after.row) {
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
  }
  else if (after.col < before.col && after.row < before.row) {
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
  }
  else if (after.col > before.col && after.row < before.row) {
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
  }
  else if (after.col < before.col && after.row > before.row) {
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
const checkKingMoveIsInvalid = (location: locationMove) : boolean => {
  const { after } = location;
  const allys = getChessMan(iconChessWhites).concat();
  for(let ally of allys){
    if(ally.col === after.col && ally.row === after.row) {
      return false;
    }
  }
  return true;
};
const checkKingWin = (ChessBlacks: Array<Cell>) => {
  const king = board.find((el) => el.value === "♔") as Cell;
  for (let locationKing of Kxy) {
    for(let ChessBlack of ChessBlacks) {
      let u = king.col + locationKing.x;
      let v = king.row + locationKing.y;
      if (u === ChessBlack.col && v === ChessBlack.row) {
        return {
          col: king.col,
          row: king.row,
          newCol: ChessBlack.col,
          newRow: ChessBlack.row
        }
      }
    }
  }
  return false;
};
const checkRookWin = (ChessBlacks: Array<Cell>) => {
  const rook = board.find((el) => el.value === "♖") as Cell;
  if(rook) {
    for(let chessBlack of ChessBlacks) {
      if (chessBlack.col === rook.col || chessBlack.row === rook.row) {
        if(rookMoveIsInvalid({before: { col: rook.col, row: rook.row}, after: { col: chessBlack.col, row: chessBlack.row}})){
          return { 
            col: rook.col,
            row: rook.row,
            newCol: chessBlack.col,
            newRow: chessBlack.row
          }
        }
      }
    }
  }
  return false;
};
const checkKnightWin = (ChessBlacks: Array<Cell>) => {
  const knight = board.find((el) => el.value === "♘") as Cell;
  if (knight) {
    for(let locationKnight of Hxy) {
      for (let chessBlack of ChessBlacks) {
        var u = knight.col + locationKnight.x;
        var v = knight.row + locationKnight.y;
        if (u === chessBlack.col && v === chessBlack.row) {
          return {
            col: knight.col,
            row: knight.row,
            newCol: chessBlack.col,
            newRow: chessBlack.row
          }
        }
      }
    }
  }
  return false;
};
const checkBishopWin = (ChessBlacks: Array<Cell>) => {
  const bishop = board.find((el) => el.value === "♗") as Cell;
  if (bishop) {
    for (let i = -7; i < 8; i++) {
      for(let chessBlack of ChessBlacks){
        if (bishop.col + i === chessBlack.col && bishop.row + i === chessBlack.row) {
          if(checkBishopMoveIsInvalid({before: { col: bishop.col, row: bishop.row}, after: { col: chessBlack.col, row: chessBlack.row}})){
            return {
              col: bishop.col,
              row: bishop.row,
              newCol: chessBlack.col,
              newRow: chessBlack.row
            }
          }
        } else if (bishop.col + i === chessBlack.col && bishop.row - i === chessBlack.row) {
          if(checkBishopMoveIsInvalid({before: { col: bishop.col, row: bishop.row}, after: { col: chessBlack.col, row: chessBlack.row}})){
            return {
              col: bishop.col,
              row: bishop.row,
              newCol: chessBlack.col,
              newRow: chessBlack.row
            }
          }
        }
      }
    }
  }
  return false;
};
const kingMove = (col: number, row: number) => {
  let arrRands = arrRand.concat();
  let isCheck = false;
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
      checkMove_KingIsWin(newCol, newRow) &&
      checkKingMoveIsInvalid({before: { col, row }, after: { col: newCol, row: newRow },})
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
  return 'Do not way'
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
