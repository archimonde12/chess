import { runbishop } from './bishop';
import { runCastle } from './castle';
import { runHorse } from './horse';
import { runKing } from './king';
import { board } from './resolvers'
import { Cell, ChessLocation } from './resolvers'

export function runDark(white: any, dark: any) {
    if (!white) { throw new Error(" oppo White is underfine ") }
    if (!dark) { throw new Error(" ally Dark is underfine ") }

    /*
    - Chạy quân địch và kiểm tra quân nào của mình có thể bị ăn
    */

    const kingW = board.find(el => el.value === '♔') as Cell
    const castleW = board.find(el => el.value === '♖') as Cell
    const bishopW = board.find(el => el.value === '♗') as Cell
    const horseW = board.find(el => el.value === '♘') as Cell

    const result: Cell[] = []

    if (dark.King.del === 0) {
        const { col, row } = runKing(dark, white) as ChessLocation
        result.push({ col: col, row: row, value: '♚' })
    }

    if (dark.Bishop.del === 0) {
        const { col, row } = runbishop(dark, white) as ChessLocation
        result.push({ col: col, row: row, value: '♝' })
    }

    if (dark.Horse.del === 0) {
        const { col, row } = runHorse(dark, white) as ChessLocation
        result.push({ col: col, row: row, value: '♞' })
    }

    if (dark.Castle.del === 0) {
        const { col, row } = runCastle(dark, white) as ChessLocation
        result.push({ col: col, row: row, value: '♜' })
    }

    /*
    Tìm quân cờ bị ăn
    */

    for (let index = 0; index < result.length; index++) {

        if (result[index].col === white.King.col && result[index].row === white.King.row && kingW) {
            return "King"
        }
        if (result[index].col === white.Castle.col && result[index].row === white.Castle.row && castleW) {
            return "Castle"
        }
        if (result[index].col === white.Horse.col && result[index].row === white.Horse.row && horseW) {
            return "Horse"
        }
        if (result[index].col === white.Bishop.col && result[index].row === white.Bishop.row && bishopW) {
            return "Bishop"
        }
    }
    return "safe"
}