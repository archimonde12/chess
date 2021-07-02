import axios from "axios";
import { CONFIG_OPPONENT_URI } from "./config";
import { resolvers } from "./resolvers";

export const sendRequestToServer = async (value: object) => {
  const { before, after } = value as {
    before: { col: number; row: number };
    after: { col: number; row: number };
  }
  let res = await axios(CONFIG_OPPONENT_URI, {
    method: "POST",
    headers: { "content-type": "application/json" },
    data: JSON.stringify({
      query: `
        mutation{
          chessMove(before:{col:${before.col},row:${before.row}},after:{col:${after.col},row:${after.row}})
        }
      `,
    }),
  });
  const { data } = res;
  return data;
};

export const initBoard = () => {
  resolvers.Mutation.boardInit(
    {},
    {
      init: [
        { col: 4, row: 7, value: "♔" },
        { col: 0, row: 0, value: "♜" },
        { col: 1, row: 0, value: "♞" },
        { col: 2, row: 0, value: "♝" },
      ],
    },
    {},
    {}
  );
};
