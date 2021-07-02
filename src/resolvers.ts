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
  const cook = board.find((el) => el.value == "♜") as {
    col: number;
    row: number;
  };
  if (cook) {
    if (col == cook.col || row == cook.row) {
      return false;
    }
  }
  return true;
};
const checkKingMove_HoureIsWin = (col: number, row: number) => {
  const houre = board.find((el) => el.value == "♞") as {
    col: number;
    row: number;
  };
  if (houre) {
    Hxy.forEach((element) => {
      const u = houre.col + element.x;
      const v = houre.row + element.y;
      if (u == col && v == row) {
        return false;
      }
    });
  }
  return true;
};
const checkKingMove_BishopIsWin = (col: number, row: number) => {
  const bishop = board.find((el) => el.value == "♝") as {
    col: number;
    row: number;
  };
  if (bishop) {
    for (let i = -7; i < 8; i++) {
      if (col + i == bishop.col && row + i == bishop.row) {
        return false;
      } else if (col + i == bishop.col && row - i == bishop.row) {
        return false;
      }
    }
  }
  return true;
};
const checkKingWin = (col: number, row: number) => {
  for (let i = 0; i < Kxy.length; i++) {
    let u = col + Kxy[i].x;
    let v = row + Kxy[i].y;
    const find = board.find((el) => el.col === u && el.row === v) as {
      col: number;
      row: number;
      value: string;
    };
    if (find.value != "") {
      return {
        newCol: u,
        newRow: v,
      };
    }
  }
  return false;
};
const kingMove = (col: number, row: number) => {
  let arrRands = arrRand.concat();
  let isCheck = false;
  while (!isCheck || arrRands.length < 1) {
    const index = Math.floor(Math.random() * arrRands.length);
    const rand = arrRands[index];
    const newCol: number = col + Kxy[rand].x;
    const newRow: number = row + Kxy[rand].y;
    arrRands.splice(index, 1);
    if (newCol >= 0 && newCol < 8 && newRow >= 0 && newRow < 8 &&
      checkKingMove_CookIsWin(newCol, newRow) &&
      checkKingMove_HoureIsWin(newCol, newRow) &&
      checkKingMove_BishopIsWin(newCol, newRow)
    ) {
      isCheck = true;
      console.log(newCol, newRow);
      return {
        newCol,
        newRow,
      };
    }
  }
  throw new Error("Hết đường đi!");
};
export const resolvers = {
  Query: {
    boardGet: () => {
      return board;
    },
  },
  Mutation: {
    chessMove: async (parent, args, ctx, info) => {
      const { before, after } = args as {
        before: { col: number; row: number };
        after: { col: number; row: number };
      };
      await requestLogs.insertOne({ content: "công move", before, after });
      const isChessMan = board.find(
        (el) => el.col === before.col && el.row === before.row
      ) as {
        col: number;
        row: number;
        value: string;
      };
      switch (isChessMan.value) {
        case "♜":
          break;
        case "♞":
          break;
        case "♝":
          break;
        default:
          console.log("Vị trí suất phát không hợp lệ!");
          throw new Error("Vị trí suất phát không hợp lệ!");
      }
      console.log(isChessMan);
      const valueAtBefore = board[before.col * 8 + before.row].value;
      board[before.col * 8 + before.row].value = "";
      board[after.col * 8 + after.row].value = valueAtBefore;
      pubsub.publish(BOARD_CHANEL, { boardSub: board });

      //Lưu request đến vào database
      //Kiểm tra xem có quân cờ không
      //Kiểm tra nước đi có phù hợp không
      //Xử lý nước đi tiếp theo của mình=> gửi nước đi tiếp theo cho server đối thủ => Lưu log cái request gửi đi
      //Trả kết quả
      // await requestLogs.insertOne({content: 'công move'});
      // console.log("cong move")
      const { col, row } = board.find((el) => el.value == "♔") as {
        col: number;
        row: number;
        value: string;
      };
      const { newCol, newRow } = kingMove(col, row) as {
        newCol: number;
        newRow: number;
      };
      // setTimeout(async () =>{
      //   //Gọi lệnh chessMove ở server của Công
      //   await requestLogs.insertOne({ content: "Tuân move" , before, after });
      //   sendRequestToServer({
      //     before: { col: col, row: row },
      //     after: { col: newCol, row: newRow },
      //   }).then(response => {
      //     console.log(response)
      //   }).catch(err => {
      //     console.log(err)
      //   })
      // },1000)
      return "OK";
    },
    start: () => {
      // try {
      //   const { col, row } = board.find((el) => el.value == "♔") as {
      //     col: number;
      //     row: number;
      //     value: string;
      //   };
      //   const { newCol, newRow } = kingMove(col, row) as {
      //     newCol: number;
      //     newRow: number;
      //   };
      //   sendRequestToServer({
      //     before: { col: col, row: row },
      //     after: { col: newCol, row: newRow },
      //   }).then(async (response) => {
      //     if (response.data.chessMove == 'OK') {
      //       const valueAtBefore = board[col * 8 + row].value;
      //       board[col * 8 + row].value = "";
      //       board[newCol * 8 + newRow].value = valueAtBefore;
      //       pubsub.publish(BOARD_CHANEL, { boardSub: board });
      //       await requestLogs.insertOne({ content: "Tuân move" , before:{ col: col, row: row}, after: { col: newCol, row: newRow } });
      //     }
      //     console.log(response);
      //   })
      //   return "OK";
      // } catch (error) {
      //   console.log(error);
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
  },
  Subscription: {
    boardSub: {
      subscribe: () => pubsub.asyncIterator([BOARD_CHANEL]),
    },
  },
};
