import { PubSub, withFilter } from 'apollo-server';
import { collectFields } from 'graphql/execution/execute';
import { Db, MongoServerSelectionError } from 'mongodb';
import { errorConsoleLog } from './color-log';
import { requestLogs } from './mongo';
import { sendRequestToServer } from './util';
export const pubsub = new PubSub();
export const BOARD_CHANEL = 'UPDATED_BOARD';
import { assertNonNullType } from 'graphql';
import {runWhite} from './direction'
import { CheckChess } from './checkChess';

export type Cell = {
  col: number
  row: number
  value: String
}

export type ChessLocation = {
  col: number,
  row: number,
}

export let board: Cell[] = (() => {
  let result: Cell[] = []
  for (let col = 0; col < 8; col++) {
    for (let row = 0; row < 8; row++) {
      result.push({
        col,
        row,
        value: ''
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
      try {

        const { before, after } = args as { before: { col: number, row: number }, after: { col: number, row: number } }
        console.log(before, after)
        

        requestLogs.insertOne({ value: 'T move ', before, after })

        if (!before) {
          throw new Error("Require Before")
        }

        if (!after) {
          throw new Error("Require After")
        }

        console.log("Dark move", after, before)

        const valueAtBefore = board[before.col * 8 + before.row].value
        board[before.col * 8 + before.row].value = ''
        board[after.col * 8 + after.row].value = valueAtBefore
        pubsub.publish(BOARD_CHANEL, { boardSub: board });
        const kingD = board.find(el => el.value === '♔') as Cell
        if (!kingD) throw new Error(" king White is die")
        const checkChess = CheckChess(before, after)
        console.log(checkChess)
        if (checkChess === false) {throw new Error("Nuoc di sai")} 
        
        setTimeout(async () => {

          const { before, after, value } = runWhite()

          console.log(before, after)

          await requestLogs.insertOne({ author: 'C move', before, after, value })

          const valueAtBefore = board[before.col * 8 + before.row].value
          board[before.col * 8 + before.row].value = '' // input
          board[after.col * 8 + after.row].value = valueAtBefore  // output

          pubsub.publish(BOARD_CHANEL, { boardSub: board });

          await sendRequestToServer({ before: { col: before.col, row: before.row }, after: { col: after.col, row: after.row } })

            .then((response) => {
              console.log(response.data.chessMove)
              if (response.data.chessMove !== "OK") throw new Error(" Errr")
            })
            .catch((err) => console.log(err))
          console.log('White Move', before, after)

          return 'OK'
          //}
        }, 1000)
        return 'OK'

      } catch (error) {
        console.log(error)
        throw error
      }

    },

    boardInit: async (parent, args, ctx, info) => {
      const { init } = args as { init: { col: number, row: number, value: String }[] }
      board = (() => {
        let result: Cell[] = []
        for (let col = 0; col < 8; col++) {
          for (let row = 0; row < 8; row++) {
            result.push({
              col,
              row,
              value: init.find(val => val.col === col && val.row === row)?.value || ''
            })
          }
        }
        return result
      })
        ()
      pubsub.publish(BOARD_CHANEL, { boardSub: board });

      return board
    },

    start: async () => {

      const { before, after } = runWhite()
      requestLogs.insertOne({ Author: 'C move', before, after })

      const valueAtBefore = board[before.col * 8 + before.row].value
      board[before.col * 8 + before.row].value = ''
      board[after.col * 8 + after.row].value = valueAtBefore

      pubsub.publish(BOARD_CHANEL, { boardSub: board });
      console.log("White move", before, after)

      sendRequestToServer({ before: { col: before.col, row: before.row }, after: { col: after.col, row: after.row } })
      return 'OK'
    },
  },
  Subscription: {
    boardSub: {
      subscribe: () => pubsub.asyncIterator([BOARD_CHANEL])
    }
  }
}