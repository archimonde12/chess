import { board, Cell, ChessLocation } from './resolvers';
import { BishopOppo } from './bishop';
import { CastleOppo } from './castle';
import { HorseOppo } from './horse';
import { KingOppo } from './king';
import { QueenOppo } from './queen';


var dark = {
    Castle: { col: 0, row: 0, del: 0, value: '♜' },
    Horse: { col: 1, row: 0, del: 0, value: '♞' },
    Bishop: { col: 2, row: 0, del: 0, value: '♝' },
    Queen: { col: 3, row: 0, del: 0, value: '♛' },
    King: { col: 4, row: 7, del: 0, value: '♚' }
}

export function CheckChess(before: ChessLocation, after: ChessLocation) {

    let direction: Cell[] = []
    let chess = {}

    const kingD = board.find(el => el.value === '♚') as Cell
    if (kingD) {
        direction.push({ row: kingD.row, col: kingD.col, value: 'King' });
        dark.King.row = kingD.row
        dark.King.col = kingD.col
        dark.King.del = 0
    } else {
        dark.King.del = 1
    }

    const castleD = board.find(el => el.value === '♜') as Cell
    if (castleD) {
        direction.push({ row: castleD.row, col: castleD.col, value: 'Castle' })
        dark.Castle.row = castleD.row
        dark.Castle.col = castleD.col
        dark.Castle.del = 0
    } else {
        dark.Castle.del = 1
    }

    const bishopD = board.find(el => el.value === '♝') as Cell
    if (bishopD) {
        direction.push({ row: bishopD.row, col: bishopD.col, value: 'Bishop' })
        dark.Bishop.row = bishopD.row
        dark.Bishop.col = bishopD.col
        dark.Bishop.del = 0
    } else {
        dark.Bishop.del = 1
    }

    const horseD = board.find(el => el.value === '♞') as Cell
    if (horseD) {
        direction.push({ row: horseD.row, col: horseD.col, value: 'Horse' })
        dark.Horse.row = horseD.row
        dark.Horse.col = horseD.col
        dark.Horse.del = 0
    } else {
        dark.Horse.del = 1
    }

    const queenD = board.find(el => el.value === '♛') as Cell
    if (queenD) {
        direction.push({ row: queenD.row, col: queenD.col, value: 'Queen' })
        dark.Queen.row = queenD.row
        dark.Queen.col = queenD.col
        dark.Queen.del = 0
    } else {
        dark.Queen.del = 1
    }

    for (let index = 0; index < direction.length; index++) {
        if (after.row === direction[index].row && after.col === direction[index].col) {
            console.log("Dark run", direction[index].value)
            chess = direction[index].value
        }
    }

    switch (chess) {
        case 'Castle': {
            const { oppoCastle } = CastleOppo(dark) as {
                oppoCastle: [ChessLocation]
            }
            for (let index = 0; index < oppoCastle.length; index++) {
                if (castleD.col === oppoCastle[index].col && castleD.row === oppoCastle[index].row) {
                    return true
                }
            }
            break;
        };
        case 'Horse': {
            const { oppoHorse } = HorseOppo(dark) as {
                oppoHorse: [ChessLocation]
            }
            for (let index = 0; index < oppoHorse.length; index++) {
                if (horseD.col === oppoHorse[index].col && horseD.row === oppoHorse[index].row) {
                    return true
                }
            }
            break;
        };
        case 'Bishop': {
            const { oppoBishop } = BishopOppo(dark) as {
                oppoBishop: [ChessLocation]
            }
            for (let index = 0; index < oppoBishop.length; index++) {
                if (bishopD.col === oppoBishop[index].col && bishopD.row === oppoBishop[index].row) {
                    return true
                }
            }
            break;
        };
        case 'King': {
            const { oppoKing } = KingOppo(dark) as {
                oppoKing: [ChessLocation]
            }
            for (let index = 0; index < oppoKing.length; index++) {
                if (kingD.col === oppoKing[index].col && kingD.row === oppoKing[index].row) {
                    return true
                }
            }
            break;
        };
        case 'Queen': {
            const { oppoQueen } = QueenOppo(dark) as {
                oppoQueen : [ChessLocation]
            }
            for (let index = 0; index < oppoQueen.length; index++) {
                if (queenD.col === oppoQueen[index].col && queenD.row === oppoQueen[index].row) {
                    return true
                }
            }
            break;
        }
        
        default: {
            console.log("chess di sai",chess)
            return false
        }
    }
}