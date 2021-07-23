import { ChessLocation } from "./resolvers"
import { BishopOppo } from './bishop';
import { CastleOppo } from './castle';
import { KingOppo, runKing } from "./king";
import { QueenOppo } from './queen';

export function runHorse(ally: any, oppo: any) {

    try {

        if (!ally) { throw new Error(" ally not received ") }

        if (!oppo) { throw new Error(" oppo not received ") }

        let resultHorse: any[] = []
        let moves: any[] = []

        const move = [{ X: - 2, Y: - 1 },
        { X: - 1, Y: - 2 },
        { X: + 1, Y: - 2 },
        { X: + 2, Y: - 1 },
        { X: + 2, Y: + 1 },
        { X: - 1, Y: + 2 },
        { X: + 1, Y: + 2 },
        { X: - 2, Y: + 1 }]

        for (let index = 0; index < move.length; index++) {
            if (ally.Horse.col + move[index].X >= 0 && ally.Horse.col + move[index].X <= 7 &&
                ally.Horse.row + move[index].Y >= 0 && ally.Horse.row + move[index].Y <= 7
            ) {
                moves.push({ col: ally.Horse.col + move[index].X, row: ally.Horse.row + move[index].Y })
            }
        }

        console.log("nuoc di cua ma", moves)

        /*

        Xoá nước trùng đồng minh

        */

        for (let index = 0; index < moves.length; index++) {
            if (moves[index].col === ally.King.col && moves[index].row === ally.King.row && ally.King.del === 0) {
                moves.splice(index, 1, '')
            }
            else if (moves[index].col === ally.Bishop.col && moves[index].row === ally.Bishop.row && ally.Bishop.del === 0) {
                moves.splice(index, 1, '')
            }
            else if (moves[index].col === ally.Castle.col && moves[index].row === ally.Castle.row && ally.Castle.del === 0) {
                moves.splice(index, 1, '')
            }
            else if (moves[index].col === ally.Queen.col && moves[index].row === ally.Queen.row && ally.Queen.del === 0) {
                moves.splice(index, 1, '')
            }
        }

        moves = moves.filter(Boolean)

        let _resultHorse: any[] = []
        _resultHorse = [...moves]

        resultHorse = [...moves]

        // Bợp vua nếu có thể

        for (let index = 0; index < resultHorse.length; index++) {
            if (resultHorse[index].col === oppo.King.col && resultHorse[index].row === oppo.King.row && oppo.King.del === 0) {
                return { col: resultHorse[index].col, row: resultHorse[index].row }
            }
            if (resultHorse[index].col === oppo.Queen.col && resultHorse[index].row === oppo.Queen.row && oppo.Queen.del === 0) {
                return { col: resultHorse[index].col, row: resultHorse[index].row }
            }
            if (resultHorse[index].col === oppo.Castle.col && resultHorse[index].row === oppo.Castle.row && oppo.Castle.del === 0) {
                break
            }
            if (resultHorse[index].col === oppo.Horse.col && resultHorse[index].row === oppo.Horse.row && oppo.Horse.del === 0) {
                break
            }
            if (resultHorse[index].col === oppo.Bishop.col && resultHorse[index].row === oppo.Bishop.row && oppo.Bishop.del === 0) {
                break
            }
        }

        /*

        Xoá nước đi nguy hiểm

        */

        // Xe

        if (oppo.Castle.del === 0) {
            const { oppoCastle } = CastleOppo(oppo) as {
                oppoCastle: [ChessLocation]
            }
            for (let j = 0; j < resultHorse.length; j++) {
                for (let index = 0; index < oppoCastle.length; index++) {
                    if (resultHorse[j].row === oppoCastle[index].row && resultHorse[j].col === oppoCastle[index].col) {
                        console.log("Deleted Horse Vs Castle", resultHorse[j])
                        resultHorse.splice(j, 1, '')
                    }
                }
            }
            resultHorse = resultHorse.filter(Boolean)
        }

        // Tịnh

        if (oppo.Bishop.del === 0) {
            const { oppoBishop } = BishopOppo(oppo) as {
                oppoBishop: [ChessLocation]
            }

            for (let j = 0; j < resultHorse.length; j++) {
                for (let index = 0; index < oppoBishop.length; index++) {
                    if (resultHorse[j].row === oppoBishop[index].row && resultHorse[j].col === oppoBishop[index].col) {
                        console.log("Deleted Horse Vs Bishop", resultHorse[j])
                        resultHorse.splice(j, 1, '')
                    }
                }
            }
            resultHorse = resultHorse.filter(Boolean)
        }

        // Mã

        if (oppo.Horse.del === 0) {
            const { oppoHorse } = HorseOppo(oppo) as {
                oppoHorse: [ChessLocation]
            }

            for (let j = 0; j < resultHorse.length; j++) {
                for (let index = 0; index < oppoHorse.length; index++) {
                    if (resultHorse[j].row === oppoHorse[index].row && resultHorse[j].col === oppoHorse[index].col) {
                        console.log("Deleted Horse Vs Horse", resultHorse[j])
                        resultHorse.splice(j, 1, '')
                    }
                }
            }
            resultHorse = resultHorse.filter(Boolean)
        }

        // Vua

        if (oppo.King.del === 0) {
            const { oppoKing } = KingOppo(oppo) as {
                oppoKing: [ChessLocation]
            }

            for (let j = 0; j < resultHorse.length; j++) {
                for (let index = 0; index < oppoKing.length; index++) {
                    if (resultHorse[j].row === oppoKing[index].row && resultHorse[j].col === oppoKing[index].col) {
                        console.log("Deleted Horse Vs King", resultHorse[j])
                        resultHorse.splice(j, 1, '')
                    }
                }
            }
            resultHorse = resultHorse.filter(Boolean)
        }

        // Hậu

        if (oppo.Queen.del === 0) {
            const { oppoQueen } = QueenOppo(oppo) as {
                oppoQueen: [ChessLocation]
            }

            for (let j = 0; j < resultHorse.length; j++) {
                for (let index = 0; index < oppoQueen.length; index++) {
                    if (resultHorse[j].col === oppoQueen[index].col && resultHorse[j].row === oppoQueen[index].row) {
                        console.log("Deleted Horse Vs Queen", resultHorse[j])
                        resultHorse.splice(j, 1, '')
                    }
                }
            }
            resultHorse = resultHorse.filter(Boolean)
        }

        /*

        Tiêu diệt quân cờ của đối thủ

        */

        // Bắt đối thủ

        for (let index = 0; index < resultHorse.length; index++) {
            if (resultHorse[index].col === oppo.King.col && resultHorse[index].row === oppo.King.row && oppo.King.del === 0) {
                return { col: resultHorse[index].col, row: resultHorse[index].row }
            }
            if (resultHorse[index].col === oppo.Queen.col && resultHorse[index].row === oppo.Queen.row && oppo.Queen.del === 0) {
                return { col: resultHorse[index].col, row: resultHorse[index].row }
            }
            if (resultHorse[index].col === oppo.Castle.col && resultHorse[index].row === oppo.Castle.row && oppo.Castle.del === 0) {
                return { col: resultHorse[index].col, row: resultHorse[index].row }
            }
            if (resultHorse[index].col === oppo.Horse.col && resultHorse[index].row === oppo.Horse.row && oppo.Horse.del === 0) {
                return { col: resultHorse[index].col, row: resultHorse[index].row }
            }
            if (resultHorse[index].col === oppo.Bishop.col && resultHorse[index].row === oppo.Bishop.row && oppo.Bishop.del === 0) {
                return { col: resultHorse[index].col, row: resultHorse[index].row }
            }
        }

        if (resultHorse.length > 0) {
            const _data = resultHorse[Math.floor(Math.random() * resultHorse.length)]

            if (!_data) {
                console.log("err", resultHorse)
                throw new Error(" Result Horse not define ")
            }
            return { col: _data.col, row: _data.row }

        } else {
            console.log("Horse bị kẹt")
            return runKing(ally, oppo)

        }

    } catch (error) {
        console.log(error)

    }

}

export function HorseOppo( chess: any) {

    let oppoHorse: ChessLocation[] = []

    const move = [{ X: - 2, Y: - 1 },
    { X: - 1, Y: - 2 },
    { X: + 1, Y: - 2 },
    { X: + 2, Y: - 1 },
    { X: + 2, Y: + 1 },
    { X: - 1, Y: + 2 },
    { X: - 1, Y: + 2 },
    { X: - 2, Y: + 1 }]

    for (let index = 0; index < move.length; index++) {
        if (chess.Horse.col + move[index].X >= 0 && chess.Horse.col + move[index].X <= 7 &&
            chess.Horse.row + move[index].Y >= 0 && chess.Horse.row + move[index].Y <= 7
        ) {
            oppoHorse.push({ col: chess.Horse.col + move[index].X, row: chess.Horse.row + move[index].Y })
        }
    }

    return { oppoHorse }

}