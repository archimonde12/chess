import { CONFIG_OPPONENT_URI } from "./config";
import { resolvers } from "./resolvers";

const sendRequestToServer = async () => {
    let res = await fetch(CONFIG_OPPONENT_URI, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
            query: `
        query{
          testRequest
        }
      `,
        }),
    });
    const { data } = await res.json();
    console.log(data);
    return data;
};

export const initBoard = () => {
    resolvers.Mutation.boardInit(
        {},
        {
            init:
                [
                    { col: 4, row: 7, value: "♔" },
                    { col: 0, row: 0, value: "♜" },
                    { col: 1, row: 0, value: "♞" },
                    { col: 2, row: 0, value: "♝" }
                ]
        },
        {},
        {})
}