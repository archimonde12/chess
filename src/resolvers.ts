import { PubSub, withFilter } from 'apollo-server';
import { collectFields } from 'graphql/execution/execute';
import { Db, MongoServerSelectionError } from 'mongodb';
import { errorConsoleLog } from './color-log';
import { requestLogs } from './mongo';
import { sendRequestToServer } from './util';
export const pubsub = new PubSub();
export const BOARD_CHANEL = 'UPDATED_BOARD';

import { runbishop } from './bishop';
import { runCastle } from './castle';
import { runHorse } from './horse';
import { runKing } from './king';
import { assertNonNullType } from 'graphql';
import { runDark } from './runDark';

export type Cell = {
  col: number
  row: number
  value: String
}

export type ChessLocation = {
  col: number,
  row: number,
}

var white = {
  Castle: { col: 0, row: 0, del: 0, value: '♖' },
  Horse: { col: 1, row: 0, del: 0, value: '♘' },
  Bishop: { col: 2, row: 0, del: 0, value: '♗' },
  King: { col: 3, row: 0, del: 0, value: '♔' },
}

var dark = {
  Castle: { col: 7, row: 7, del: 0, value: '♜' },
  Horse: { col: 6, row: 7, del: 0, value: '♞' },
  Bishop: { col: 5, row: 7, del: 0, value: '♝' },
  King: { col: 4, row: 7, del: 0, value: '♚' },
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

function runWhite() {

  const result: Cell[] = []

  /* 

  Quét bàn cờ và cập nhật vị trí toạ độ của các quân cờ

  */

  const kingD = board.find(el => el.value === '♚') as Cell
  const bishopD = board.find(el => el.value === '♝') as Cell
  const horseD = board.find(el => el.value === '♞') as Cell
  const castleD = board.find(el => el.value === '♜') as Cell

  if (kingD) {
    dark.King.row = kingD.row
    dark.King.col = kingD.col
    dark.King.del = 0
  } else {
    dark.King.del = 1
  }

  if (bishopD) {
    dark.Bishop.row = bishopD.row
    dark.Bishop.col = bishopD.col
    dark.Bishop.del = 0
  } else {
    dark.Bishop.del = 1
  }

  if (horseD) {
    dark.Horse.row = horseD.row
    dark.Horse.col = horseD.col
    dark.Horse.del = 0
  } else {
    dark.Bishop.del = 1
  }

  if (castleD) {
    dark.Castle.row = castleD.row
    dark.Castle.col = castleD.col
    dark.Castle.del = 0
  } else {
    dark.Bishop.del = 1
  }

  const kingW = board.find(el => el.value === '♔') as Cell
  const castleW = board.find(el => el.value === '♖') as Cell
  const bishopW = board.find(el => el.value === '♗') as Cell
  const horseW = board.find(el => el.value === '♘') as Cell

  if (kingW) {
    white.King.row = kingW.row
    white.King.col = kingW.col
    white.King.del = 0
  } else {
    white.Bishop.del = 1
  }

  if (bishopW) {
    white.Bishop.row = bishopW.row
    white.Bishop.col = bishopW.col
    white.Bishop.del = 0
  } else {
    white.Bishop.del = 1
  }

  if (horseW) {
    white.Horse.row = horseW.row
    white.Horse.col = horseW.col
    white.Horse.del = 0
  } else {
    white.Bishop.del = 1
  }

  if (castleW) {
    white.Castle.row = castleW.row
    white.Castle.col = castleW.col
    white.Castle.del = 0
  } else {
    white.Bishop.del = 1
  }

  let ally = white
  let oppo = dark

  

  if (kingW) {
    const { col, row } = runKing(ally, oppo) as ChessLocation
    result.push({ col: col, row: row, value: '♔' })
  }
  if (bishopW) {
    const { col, row } = runbishop(ally, oppo) as ChessLocation
    result.push({ col: col, row: row, value: '♗' })
  }
  if (horseW) {
    const { col, row } = runHorse(ally, oppo) as ChessLocation
    result.push({ col: col, row: row, value: '♘' })
  }
  if (castleW) {
      const { col, row } = runCastle(ally, oppo) as ChessLocation
     result.push({ col: col, row: row, value: '♖' })
  }

  const after = result[Math.floor(Math.random() * result.length)]

  const before = board.find(el => el.value === after.value) as Cell

  return {
    before: {
      col: before.col,
      row: before.row,
    },
    after: {
      col: after.col,
      row: after.row,
    },
    value: after.value
  }

}

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
          throw new Error(" Before {}")
        }

        if (!after) {
          throw new Error(" after {}")
        }

        console.log("Dark move", after, before)

        const valueAtBefore = board[before.col * 8 + before.row].value
        board[before.col * 8 + before.row].value = ''
        board[after.col * 8 + after.row].value = valueAtBefore

        pubsub.publish(BOARD_CHANEL, { boardSub: board });

        pubsub.publish(BOARD_CHANEL, { boardSub: board });

        setTimeout(async () => {

          const { before, after, value } = runWhite()

          console.log(before, after)

          await requestLogs.insertOne({ value: 'Cong move', before, after, })

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

      const { before, after } = await runWhite()
      requestLogs.insertOne({ value: 'Cong move', before, after })

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