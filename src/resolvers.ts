import { PubSub, withFilter } from "apollo-server";
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
type Cell = {
  col: number;
  row: number;
  value: String;
};
type locationMove = {
  before: { col: number, row: number}, 
  after: { col: number, row: number}
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
const checkKingMove_CookIsWin = (col: number, row: number) => {
  const cook = board.find((el) => el.value === "♜") as Cell;
  let isCheck = true;
  if (cook) {
    if (col === cook.col || row === cook.row) {
      console.log('Vào mồm xe')
      isCheck = false;
      return false;
    }
  }
  return isCheck;
};
const checkKingMove_HoureIsWin = (col: number, row: number) => {
  const houre = board.find((el) => el.value === "♞") as Cell;
  let isCheck = true;
  if (houre) {
    Hxy.forEach((element) => {
      const u = houre.col + element.x;
      const v = houre.row + element.y;
      if (u == col && v == row) {
        console.log('Vào mồm mã')
        isCheck = false
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
      if (col + i == bishop.col && row + i == bishop.row) {
        console.log('Vào mồm tượng')
        isCheck = false;
        return false;
      } else if (col + i == bishop.col && row - i == bishop.row) {
        console.log('Vào mồm tượng')
        isCheck = false;
        return false;
      }
    }
  }
  return isCheck;
};
const checkHoureMoveIsInvalid = (location: object) => {
  const { before, after } = location as locationMove
  return true;
}

const checkCookMoveIsInvalid = (location: object) => {
  const { before, after } = location as locationMove
  return true;
}
const checkBishopMoveIsInvalid = (location: object) => {
  const { before, after } = location as locationMove
  return true;
}
const checkKingWin = (col: number, row: number) => {
  for (let i = 0; i < Kxy.length; i++) {
    let u = col + Kxy[i].x;
    let v = row + Kxy[i].y;
    const find = board.find((el) => el.col === u && el.row === v) as Cell
    if(u < 8 && u >= 0 && v < 8 && v >= 0) {
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
    const { newCol, newRow } = checkKingWin(col, row) as {
      newCol: number;
      newRow: number;
    };
    return { newCol, newRow };
  }
  while (!isCheck || arrRands.length < 1) {
    const index = Math.floor(Math.random() * arrRands.length);
    const rand = arrRands[index];
    const newCol: number = col + Kxy[rand].x;
    const newRow: number = row + Kxy[rand].y;
    arrRands.splice(index, 1);
    if (newCol >= 0 && newCol < 8 && newRow >= 0 && newRow < 8 && checkKingMove_CookIsWin(newCol, newRow) && checkKingMove_HoureIsWin(newCol, newRow) && checkKingMove_BishopIsWin(newCol, newRow)) {
      isCheck = true;
      return {
        newCol,
        newRow,
      };
    }
  }
  throw new Error("Hết đường đi!");
};
const moveChess = (value: locationMove) => {
  const valueAtBefore = board[value.before.col * 8 + value.before.row].value;
  board[value.before.col * 8 + value.before.row].value = "";
  board[value.after.col * 8 + value.after.row].value = valueAtBefore;
  pubsub.publish(BOARD_CHANEL, { boardSub: board });
}
export const resolvers = {
  Query: {
    boardGet: () => {
      return board;
    },
  },
  Mutation: {
    chessMove: async (parent, args, ctx, info) => {
      try {
        const { before, after } = args as locationMove;
        console.log(before, after);
        await requestLogs.insertOne({ content: "công move", before, after });
        const isChessMan = board.find(
          (el) => el.col === before.col && el.row === before.row
        ) as Cell;
        switch (isChessMan.value) {
          case "♜":
            checkCookMoveIsInvalid({ before, after });
            break;
          case "♞":
            checkHoureMoveIsInvalid({ before, after });
            break;
          case "♝":
            checkBishopMoveIsInvalid({ before, after });
            break;
          default:
            console.log("Không có quân cờ ở vị trí xuất phát");
            throw new Error("Không có quân cờ ở vị trí xuất phát");
        }
        moveChess({before, after })
        //Lưu request đến vào database
        //Kiểm tra xem có quân cờ không
        //Kiểm tra nước đi có phù hợp không
        //Xử lý nước đi tiếp theo của mình=> gửi nước đi tiếp theo cho server đối thủ => Lưu log cái request gửi đi
        //Trả kết quả
        // await requestLogs.insertOne({content: 'công move'});
        // console.log("cong move")
        const { col, row } = board.find((el) => el.value === "♔") as Cell;
        const { newCol, newRow } = kingMove(col, row) as {
          newCol: number;
          newRow: number;
        };
        // const isCheckClearChess = board.every(el => {
        //   if(el.value !== '' && el.col === col && el.row === row) {
        //     return false;
        //   }
        //   return true;
        // });
        // if (isCheckClearChess) {
        //   console.log('King chiến thắng')
        //   return 'King chiến thắng';
        // }
        setTimeout(async () =>{
          await requestLogs.insertOne({ content: "Tuân move" , before:  { col: col, row: row}, after: { col: newCol, row: newRow } });
          moveChess({before: {col: col, row: row}, after: {col: newCol, row: newRow}})
          // Gửi request chessMove ở sever của công
          sendRequestToServer({
            before: { col: col, row: row },
            after: { col: newCol, row: newRow },
          }).then(response => {
            console.log(response)
          }).catch(err => {
            console.log(err)
            throw err;
          })
        },1000)
        return "OK";
      } catch (error) {
        console.log(error)
        throw error;
      }
      
    },
    start: async () => {
      try {
        const { col, row } = board.find((el) => el.value === "♔") as Cell;
        
        const { newCol, newRow } = kingMove(col, row) as {
          newCol: number;
          newRow: number;
        };
        const valueAtBefore = board[col * 8 + row].value;
        board[col * 8 + row].value = "";
        board[newCol * 8 + newRow].value = valueAtBefore;
        pubsub.publish(BOARD_CHANEL, { boardSub: board });
        await requestLogs.insertOne({
          content: "Tuân move",
          before: { col: col, row: row },
          after: { col: newCol, row: newRow },
        });
        // Gửi request
        sendRequestToServer({
          before: { col: col, row: row },
          after: { col: newCol, row: newRow },
        });
        return "OK";
      } catch (error) {
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
  },
  Subscription: {
    boardSub: {
      subscribe: () => pubsub.asyncIterator([BOARD_CHANEL]),
    },
  },
};
