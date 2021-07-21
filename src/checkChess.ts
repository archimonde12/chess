import { board, Cell, ChessLocation } from './resolvers';
import { BishopOppo } from './bishop';
import { CastleOppo } from './castle';
import { HorseOppo } from './horse';
import { KingOppo } from './king';

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

export function CheckChess(before: ChessLocation, after: ChessLocation) {

    let direction: Cell[] = []
    let chess = {}

    const kingD = board.find(el => el.value === '♚') as Cell
    if (kingD) {
        direction.push({ row: kingD.row, col: kingD.col, value: '♚' });
        dark.King.row = kingD.row
        dark.King.col = kingD.col
        dark.King.del = 0
    } else {
        dark.King.del = 1
    }

    const castleD = board.find(el => el.value === '♜') as Cell
    if (castleD) {
        direction.push({ row: castleD.row, col: castleD.col, value: '♜' })
        dark.Castle.row = castleD.row
        dark.Castle.col = castleD.col
        dark.Castle.del = 0
    } else {
        dark.Castle.del = 1
    }

    const bishopD = board.find(el => el.value === '♝') as Cell
    if (bishopD) {
        direction.push({ row: bishopD.row, col: bishopD.col, value: '♝' })
        dark.Bishop.row = bishopD.row
        dark.Bishop.col = bishopD.col
        dark.Bishop.del = 0
    } else {
        dark.Bishop.del = 1
    }

    const horseD = board.find(el => el.value === '♞') as Cell
    if (horseD) {
        direction.push({ row: horseD.row, col: horseD.col, value: '♞' })
        dark.Horse.row = horseD.row
        dark.Horse.col = horseD.col
        dark.Horse.del = 0
    } else {
        dark.Horse.del = 1
    }

    for (let index = 0; index < direction.length; index++) {
        if (after.row === direction[index].row && after.col === direction[index].col) {
            console.log("Dark run", direction[index].value)
            chess = direction[index].value
        }
    }

    switch (chess) {
        case '♜': {
            const { oppoCastle } = CastleOppo(dark, white) as {
                oppoCastle: [ChessLocation]
            }
            for (let index = 0; index < oppoCastle.length; index++) {
                if (castleD.col === oppoCastle[index].col && castleD.row === oppoCastle[index].row) {
                    return 'Pass'
                }
            }
            break;
        }
        case '♞': {
            const { oppoHorse } = HorseOppo(dark, white) as {
                oppoHorse: [ChessLocation]
            }
            for (let index = 0; index < oppoHorse.length; index++) {
                if (horseD.col === oppoHorse[index].col && horseD.row === oppoHorse[index].row) {
                    return 'Pass'
                }
            }
        }
        case '♝': {
            const { oppoBishop } = BishopOppo(dark, white) as {
                oppoBishop: [ChessLocation]
            }
            for (let index = 0; index < oppoBishop.length; index++) {
                if (bishopD.col === oppoBishop[index].col && bishopD.row === oppoBishop[index].row) {
                    return 'Pass'
                }
            }
            break;
        }
        case '♚': {
            const { oppoKing } = KingOppo(dark, white) as {
                oppoKing: [ChessLocation]
            }
            for (let index = 0; index < oppoKing.length; index++) {
                if (horseD.col === oppoKing[index].col && horseD.row === oppoKing[index].row) {
                    return 'Pass'
                }
            }
            break;
        }
        default: {
            return "False"
        }
    }
}