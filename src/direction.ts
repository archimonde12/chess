import { board } from './resolvers'
import { Cell, ChessLocation } from './resolvers'
import { runbishop } from './bishop';
import { runCastle } from './castle';
import { runHorse } from './horse';
import { runKing } from './king';
import { runDark } from './runDark';

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

export function runWhite() {

    const result: Cell[] = []

    /*

    Kiểm tra nếu đồng minh đi thì vua có bị chiếu không => Chạy vua
    Kiểm tra 3 con Hunter có đang gặp nguy hiểm không => Chạy con sắp bị ăn
    4 con đông minh an toàn => Random nước đi

    */

    const kingD = board.find(el => el.value === '♚') as Cell
    const bishopD = board.find(el => el.value === '♝') as Cell
    const horseD = board.find(el => el.value === '♞') as Cell
    const castleD = board.find(el => el.value === '♜') as Cell
    const kingW = board.find(el => el.value === '♔') as Cell
    const castleW = board.find(el => el.value === '♖') as Cell
    const bishopW = board.find(el => el.value === '♗') as Cell
    const horseW = board.find(el => el.value === '♘') as Cell

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
        dark.Horse.del = 1
    }

    if (castleD) {
        dark.Castle.row = castleD.row
        dark.Castle.col = castleD.col
        dark.Castle.del = 0
    } else {
        dark.Castle.del = 1
    }



    if (kingW) {
        white.King.row = kingW.row
        white.King.col = kingW.col
        white.King.del = 0
    } else {
        white.King.del = 1
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
        white.Horse.del = 1
    }

    if (castleW) {
        white.Castle.row = castleW.row
        white.Castle.col = castleW.col
        white.Castle.del = 0
    } else {
        white.Castle.del = 1
    }

    const _runDark = runDark(white, dark)

    let ally = white
    let oppo = dark

    console.log('Quân cờ đang gặp nguy hiểm', _runDark)

    if (_runDark === 'King' && kingW) {
        const { col, row } = runKing(ally, oppo) as ChessLocation
        result.push({ col: col, row: row, value: '♔' })
    }
    else if (_runDark === 'Castle' && castleW) {
        const { col, row } = runCastle(ally, oppo) as ChessLocation
        result.push({ col: col, row: row, value: '♖' })
    }
    else if (_runDark === 'Horse' && horseW) {
        const { col, row } = runHorse(ally, oppo) as ChessLocation
        result.push({ col: col, row: row, value: '♘' })
    }
    else if (_runDark === 'Bishop' && bishopW) {
        const { col, row } = runbishop(ally, oppo) as ChessLocation
        result.push({ col: col, row: row, value: '♗' })
    } else if (_runDark === 'safe') {
        console.log('An toàn => Random nước đi 1 trong 4')

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
    }

    console.log("white", white)
    console.log("dark", dark)
    console.log("ket qua", result)

    // Tìm quân cờ có thể ăn đối thủ => Ăn

    for (let index = 0; index < result.length; index++) {

        if (result[index].col == oppo.King.col && result[index].row == oppo.King.row) {
            return _result(result[index].col, result[index].row, result[index].value)
        }
        else if (result[index].col == oppo.Castle.col && result[index].row == oppo.Castle.row) {
            return _result(result[index].col, result[index].row, result[index].value)
        }
        else if (result[index].col == oppo.Horse.col && result[index].row == oppo.Horse.row) {
            return _result(result[index].col, result[index].row, result[index].value)
        }
        else if (result[index].col == oppo.Bishop.col && result[index].row == oppo.Bishop.row) {
            return _result(result[index].col, result[index].row, result[index].value)
        }

    }
    // Không có quân cờ nào ăn được đối thủ => Random
    const after = result[Math.floor(Math.random() * result.length)]

    return _result(after.col, after.row, after.value)

}

function _result(col: number, row: number, value: String) {

    const data = { col: col, row: row }
    const before = board.find(el => el.value === value) as Cell

    console.log(before, data, value)

    return {
        before: {
            col: before.col,
            row: before.row,
        },
        after: {
            col: data.col,
            row: data.row,
        },
        value: value
    }

}