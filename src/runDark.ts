import { HorseOppo } from './horse';
import { CastleOppo } from './castle'
import { BishopOppo } from './bishop';
import { runbishop } from './bishop';
import { runCastle } from './castle';
import { runHorse } from './horse';
import { runKing } from './king';

type Cell = {
    col: number
    row: number
    value: String
}

type ChessLocation = {
    col: number,
    row: number,
}

export function runDark(white: any, dark: any) {

    let ally = dark
    let oppo = white

    const result: Cell[] = []

    if (dark.King.del === 0) {

        const { col, row } = runKing(ally, oppo) as ChessLocation
        result.push({ col: col, row: row, value: '♚' })
    }

    if (dark.Bishop.del === 0) {

        const { col, row } = runbishop(ally, oppo) as ChessLocation
        result.push({ col: col, row: row, value: '♝' })
    }

    if (dark.Horse.del === 0) {

        const { col, row } = runHorse(ally, oppo) as ChessLocation
        result.push({ col: col, row: row, value: '♞' })
    }
    if (dark.Castle.del === 0) {

        const { col, row } = runCastle(ally, oppo) as ChessLocation
        result.push({ col: col, row: row, value: '♜' })
    }

    const after = result[Math.floor(Math.random() * result.length)]

    return {

        col: after.col,
        row: after.row,
    }

}