import axios from "axios";
import { CONFIG_OPPONENT_URI } from "./config";
import { resolvers } from "./resolvers";
import { Db, MongoServerSelectionError } from 'mongodb';
import { requestLogs } from "./mongo";

export async function sendRequestToServer(value) {
  try {

    const { before, after } = value as {
      before: { col: number, row: number }, after: { col: number, row: number }
    }

    let res = await axios(CONFIG_OPPONENT_URI, {
      method: "POST",
      headers: { "content-type": "application/json" },
      data: JSON.stringify({
        query: `
          mutation{
            chessMove(before:{col: ${before.col},row: ${before.row}},after:{col:${after.col},row: ${after.row}})
          }
        `,
      }),
    });
    const { data } = res;
    if (data.errors) {
      console.log(data.errors[0].message);
      await requestLogs.insertOne({ err: data.errors[0].message })
    }
    console.log(data)
    return data;
  }
  catch (e) {
    throw e
  }
};


export const initBoard = () => {
  resolvers.Mutation.boardInit(
    {},
    {
      init:
      [
        // White 
        { col: 7, row: 7, value: "♖" },
        { col: 6, row: 7, value: "♘" },
        { col: 5, row: 7, value: "♗" },
        { col: 4, row: 7, value: "♔" },
        { col: 3, row: 7, value: "♕" },
        // Dark
        { col: 0, row: 0, value: "♜" },
        { col: 1, row: 0, value: "♞" },
        { col: 2, row: 0, value: "♝" },
        { col: 3, row: 0, value: "♛" },
        { col: 4, row: 0, value: "♚" },
        
      ]
    },
    {},
    {})
}

