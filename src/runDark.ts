import { runbishop } from './bishop';
import { runCastle } from './castle';
import { runHorse } from './horse';
import { runKing } from './king';
import { board } from './resolvers'
import { Cell, ChessLocation } from './resolvers'
import { runQueen } from './queen';
export function runDark(white: any, dark: any) {
    if (!white) { throw new Error(" oppo White is underfine ") }
    if (!dark) { throw new Error(" ally Dark is underfine ") }

    /*
    - Chạy quân địch và kiểm tra quân nào của mình có thể bị ăn
    */

    // white
    const kingW = board.find(el => el.value === '♔') as Cell
    const castleW = board.find(el => el.value === '♖') as Cell
    const bishopW = board.find(el => el.value === '♗') as Cell
    const horseW = board.find(el => el.value === '♘') as Cell
    const queenW = board.find(el => el.value === '♕') as Cell
    // dark
    const kingD = board.find(el => el.value === '♚') as Cell
    const bishopD = board.find(el => el.value === '♝') as Cell
    const horseD = board.find(el => el.value === '♞') as Cell
    const castleD = board.find(el => el.value === '♜') as Cell
    const queenD = board.find(el => el.value === '♛') as Cell

    const result: Cell[] = []

    if (kingD) {
        const { col, row } = runKing(dark, white) as ChessLocation
        result.push({ col: col, row: row, value: '♚' })
    }

    if (bishopD) {
        const { col, row } = runbishop(dark, white) as ChessLocation
        result.push({ col: col, row: row, value: '♝' })
    }

    if (horseD) {
        const { col, row } = runHorse(dark, white) as ChessLocation
        result.push({ col: col, row: row, value: '♞' })
    }

    if (castleD) {
        const { col, row } = runCastle(dark, white) as ChessLocation
        result.push({ col: col, row: row, value: '♜' })
    }
    if (queenD) {
        const { col, row } = runQueen(white, dark) as ChessLocation
        result.push({ col: col, row: row, value: '♕' })

    }

    /*
    Tìm quân cờ đang gặp nguy hiểm
    */

    // Ưu tiên bảo vệ vua

    if (white.King.col === dark.Castle.col && dark.Castle.del == 0) {
        console.log(".Castle")
        return "King"
    }
    if (white.King.row === dark.Castle.row && dark.Castle.del == 0) {
        console.log("Castle .")
        return "King"
    }
    if (white.King.col === dark.Queen.col && dark.Queen.del == 0) {
        console.log(".Queen")
        return "King"
    }
    if (white.King.row === dark.Queen.row && dark.Queen.del == 0) {
        console.log("Queen .")
        return "King"
    }

    // Bảo vệ các quân còn lại

    for (let index = 0; index < result.length; index++) {

        if (result[index].col === white.King.col && result[index].row === white.King.row && kingW) {
            return "King"
        }
        if (result[index].col === white.Queen.col && result[index].row === white.Queen.row && queenW) {
            return "Queen"
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