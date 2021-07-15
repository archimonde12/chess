import { HorseOppo } from './horse';
import { CastleOppo } from './castle'
import { BishopOppo } from './bishop';
import { runbishop } from './bishop';
import { runCastle } from './castle';
import { runHorse } from './horse';
import { runKing } from './king';
import { board } from './resolvers'
import {Cell, ChessLocation} from './resolvers'

export function runDark(white: any, dark: any) {
    if (!white) {throw new Error (" oppo White is underfine ")}
    if (!dark) {throw new Error (" ally Dark is underfine ")}

    /*

    - Chạy quân địch và kiểm tra quân nào của mình có thể bị ăn

    */

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

    /*

    Tìm quân cờ bị ăn

    */

    for (let index = 0; index < result.length; index++) {

        if (result[index].col === oppo.King.col && result[index].row === oppo.King.row && oppo.King.del === 0) {
            return "King"

        }
        else if (result[index].col === oppo.Castle.col && result[index].row === oppo.Castle.row && oppo.King.del === 0) {
            return "Castle"

        }
        else if (result[index].col === oppo.Horse.col && result[index].row === oppo.Horse.row && oppo.King.del === 0) {
            return "Horse"

        }
        else if (result[index].col === oppo.Bishop.col && result[index].row === oppo.Bishop.row && oppo.King.del === 0) {
            return "Bishop"

        }
        
    }
    return "safe"

}