import { PubSub, withFilter } from "apollo-server";
export const pubsub = new PubSub();
export const BOARD_CHANEL = "UPDATED_BOARD";

type Cell = {
    col: number
    row: number
    value: String
}

let board: Cell[] = (() => {
    let result: Cell[] = []
    for (let col = 0; col < 8; col++) {
        for (let row = 0; row < 8; row++) {
            result.push({
                col,
                row,
                value: ""
            })
        }
    }
    return result
})()

export const resolvers = {
    Query: {
        boardGet: () => {
            return board
        }
    },
    Mutation: {
        chessMove: (parent, args, ctx, info) => {
            const { before, after } = args as { before: { col: number, row: number }, after: { col: number, row: number } }
            const valueAtBefore = board[(before.col - 1) * 8 + before.row ].value
            board[before.col * 8 + before.row ].value = ""
            board[after.col * 8 + after.row ].value = valueAtBefore
            pubsub.publish(BOARD_CHANEL, { boardSub: board });
            return "OK"
        },
        boardInit: (parent, args, ctx, info) => {
            const { init } = args as { init: { col: number, row: number, value: String }[] }
            board = (() => {
                let result: Cell[] = []
                for (let col = 0; col < 8; col++) {
                    for (let row = 0; row < 8; row++) {
                        result.push({
                            col,
                            row,
                            value: init.find(val => val.col === col && val.row === row)?.value || ""
                        })
                    }
                }
                return result
            })()
            pubsub.publish(BOARD_CHANEL, { boardSub: board });
            return board
        }
    },
    Subscription: {
        boardSub: {
            subscribe: () => pubsub.asyncIterator([BOARD_CHANEL])
        }
    }
}



