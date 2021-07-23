import { BishopOppo } from './bishop';
import { HorseOppo } from './horse';
import { KingOppo, runKing } from './king';
import { CastleOppo } from './castle';
import { ChessLocation } from './resolvers';

export function runQueen(ally: any, oppo: any) {

    try {

        if (!ally) { throw new Error(' ally not received ') }
        if (!oppo) { throw new Error('  oppo not received ') }

        let resultQueen: any[] = []

        let R1 = ally.Queen.row

        while (R1 <= 7) {

            if (R1 === ally.Bishop.row && ally.Queen.col === ally.Bishop.col && ally.Bishop.del === 0) {
                break
            }
            if (R1 === ally.Horse.row && ally.Queen.col === ally.Horse.col && ally.Horse.del === 0) {
                break
            }
            if (R1 === ally.King.row && ally.Queen.col === ally.King.col && ally.King.del === 0) {
                break
            }
            if (R1 === ally.Castle.row && ally.Queen.col === ally.Castle.col && ally.Castle.del === 0) {
                break
            }
            if (R1 !== ally.Queen.row) {
                resultQueen.push({ col: ally.Queen.col, row: R1 })
            }
            R1++
        }

        let R2 = ally.Queen.row

        while (R2 >= 0) {

            if (ally.Horse.row === R2 && ally.Horse.col === ally.Queen.col && ally.Horse.del === 0) {
                break
            }
            if (ally.Bishop.row === R2 && ally.Bishop.col === ally.Queen.col && ally.Bishop.del === 0) {
                break
            }
            if (ally.King.row === R2 && ally.King.col === ally.Queen.col && ally.King.del === 0) {
                break
            }
            if (ally.Castle.row === R2 && ally.Castle.col === ally.Queen.col && ally.Castle.del === 0) {
                break
            }
            if (R2 !== ally.Queen.row) {
                resultQueen.push({ col: ally.Queen.col, row: R2 })
            }

            R2--
        }

        let C1 = ally.Queen.col

        while (C1 <= 7) {

            if (ally.Queen.row === ally.Horse.row && C1 === ally.Horse.col && ally.Horse.del === 0) {
                break
            }
            if (ally.Queen.row === ally.Bishop.row && C1 === ally.Bishop.col && ally.Bishop.del === 0) {
                break
            }
            if (ally.Queen.row === ally.King.row && C1 === ally.King.col && ally.King.del === 0) {
                break
            }
            if (ally.Queen.row === ally.Castle.row && C1 === ally.Castle.col && ally.Castle.del === 0) {
                break
            }
            if (C1 !== ally.Queen.col) {
                resultQueen.push({ col: C1, row: ally.Queen.row })
            }

            C1++
        }

        let C2 = ally.Queen.col

        while (C2 >= 0) {

            if (ally.Horse.row === ally.Queen.row && C2 === ally.Horse.col && ally.Horse.del === 0) {
                break
            }
            if (ally.Bishop.row === ally.Queen.row && C2 === ally.Bishop.col && ally.Bishop.del === 0) {
                break
            }
            if (ally.King.row === ally.Queen.row && C2 === ally.King.col && ally.King.del === 0) {
                break
            }
            if (C2 !== ally.Queen.col) {
                resultQueen.push({ col: C2, row: ally.Queen.row })
            }

            C2--
        }

        let R3 = ally.Queen.row
        let C3 = ally.Queen.col

        while (R3 <= 7 && C3 <= 7) {

            if (R3 === ally.Horse.row && C3 === ally.Horse.col && ally.Horse.del === 0) {
                break
            }
            if (R3 === ally.Castle.row && C3 === ally.Castle.col && ally.Castle.del === 0) {
                break
            }
            if (R3 === ally.Bishop.row && C3 === ally.Bishop.col && ally.Bishop.del === 0) {
                break
            }
            if (R3 === ally.King.row && C3 === ally.King.col) {
                break
            }
            if (R3 !== ally.Queen.row && C3 !== ally.Queen.col) {
                resultQueen.push({ row: R3, col: C3 })
            }

            R3++
            C3++
        }

        let R4 = ally.Queen.row
        let C4 = ally.Queen.col

        while (R4 >= 0 && C4 <= 7) {

            if (R4 === ally.Horse.row && C4 === ally.Horse.col && ally.Horse.del === 0) {
                break
            }
            if (R4 === ally.Castle.row && C4 === ally.Castle.col && ally.Castle.del === 0) {
                break
            }
            if (R4 === ally.Bishop.row && C4 === ally.Bishop.col && ally.Bishop.del === 0) {
                break
            }
            if (R4 === ally.King.row && C4 === ally.King.col) {
                break
            }
            if (R4 !== ally.Queen.row && C4 !== ally.Queen.col) {
                resultQueen.push({ col: C4, row: R4 })
            }

            R4--
            C4++

        }

        let R5 = ally.Queen.row
        let C5 = ally.Queen.col

        while (R5 >= 0 && C5 >= 0) {

            if (R5 === ally.Horse.row && C5 === ally.Horse.col && ally.Horse.del === 0) {
                break
            }
            if (R5 === ally.Castle.row && C5 === ally.Castle.col && ally.Castle.del === 0) {
                break
            }
            if (R5 === ally.Bishop.row && C5 === ally.Bishop.col && ally.Bishop.del === 0) {
                break
            }
            if (R5 === ally.King.row && C5 === ally.King.col) {
                break
            }
            if (R5 !== ally.Queen.row && C5 !== ally.Queen.col) {
                resultQueen.push({ col: C5, row: R5 })
            }

            R5--
            C5--

        }

        let R6 = ally.Queen.row
        let C6 = ally.Queen.col

        while (R6 <= 7 && C6 >= 0) {

            if (R6 === ally.Horse.row && C6 === ally.Horse.col && ally.Horse.del === 0) {
                break
            }
            if (R6 === ally.Castle.row && C6 === ally.Castle.col && ally.Castle.del === 0) {
                break
            }
            if (R6 === ally.Bishop.row && C6 === ally.Bishop.col && ally.Bishop.del === 0) {
                break
            }
            if (R6 === ally.King.row && C6 === ally.King.col) {
                break
            }
            if (R6 !== ally.Queen.row && C6 !== ally.Queen.col) {

                resultQueen.push({ col: C6, row: R6 })

            }
            R6++
            C6--
        }

        // Bợp vua nếu có thể

        for (let index = 0; index < resultQueen.length; index++) {
            if (resultQueen[index].col === oppo.King.col && resultQueen[index].row === oppo.King.row && oppo.King.del === 0) {
                return { col: resultQueen[index].col, row: resultQueen[index].row }
            }
            if (resultQueen[index].col === oppo.Queen.col && resultQueen[index].row === oppo.Queen.row && oppo.Queen.del === 0) {
                break
            }
            if (resultQueen[index].col === oppo.Castle.col && resultQueen[index].row === oppo.Castle.row && oppo.Castle.del === 0) {
                break
            }
            if (resultQueen[index].col === oppo.Horse.col && resultQueen[index].row === oppo.Horse.row && oppo.Horse.del === 0) {
                break
            }
            if (resultQueen[index].col === oppo.Bishop.col && resultQueen[index].row === oppo.Bishop.row && oppo.Bishop.del === 0) {
                break
            }
        }

        console.log(resultQueen)

        let _resultQueen: any[] = []
        _resultQueen = [...resultQueen]

        /*
        Xoá các nước đi nguy hiểm
        */

        // Xe

        if (oppo.Castle.del === 0) {
            const { oppoCastle } = CastleOppo(oppo) as {
                oppoCastle: [ChessLocation]
            }

            for (let j = 0; j < resultQueen.length; j++) {
                for (let index = 0; index < oppoCastle.length; index++) {
                    if (resultQueen[j].row === oppoCastle[index].row && resultQueen[j].col === oppoCastle[index].col) {
                        resultQueen.splice(j, 1, '')
                    }
                }
            }
            resultQueen = resultQueen.filter(Boolean)
        }

        // Tịnh

        if (oppo.Bishop.del === 0) {
            const { oppoBishop } = BishopOppo(oppo) as {
                oppoBishop: [ChessLocation]
            }

            for (let j = 0; j < resultQueen.length; j++) {
                for (let index = 0; index < oppoBishop.length; index++) {
                    if (resultQueen[j].col === oppoBishop[index].col && resultQueen[j].row === oppoBishop[index].row) {
                        resultQueen.splice(j, 1, '')
                    }
                }
            }
            resultQueen = resultQueen.filter(Boolean)
        }

        // Mã

        if (oppo.Horse.del === 0) {
            const { oppoHorse } = HorseOppo(oppo) as {
                oppoHorse: [ChessLocation]
            }
            for (let j = 0; j < resultQueen.length; j++) {
                for (let index = 0; index < oppoHorse.length; index++) {
                    if (resultQueen[j].col === oppoHorse[index].col && resultQueen[j].row === oppoHorse[index].row) {
                        resultQueen.splice(j, 1, '')
                    }
                }
            }
            resultQueen = resultQueen.filter(Boolean)
        }

        // Vua

        if (oppo.King.del === 0) {
            const { oppoKing } = KingOppo(oppo) as {
                oppoKing: [ChessLocation]
            }

            for (let j = 0; j < resultQueen.length; j++) {
                for (let index = 0; index < oppoKing.length; index++) {
                    if (resultQueen[j].col === oppoKing[index].col && resultQueen[j].row === oppoKing[index].row) {
                        resultQueen.splice(j, 1, '')
                    }
                }
            }
            resultQueen = resultQueen.filter(Boolean)
        }

        // Hậu

        if (oppo.Queen.del === 0) {
            const { oppoQueen } = QueenOppo(oppo) as {
                oppoQueen: [ChessLocation]
            }

            for (let j = 0; j < resultQueen.length; j++) {
                for (let index = 0; index < oppoQueen.length; index++) {
                    if (resultQueen[j].col === oppoQueen[index].col && resultQueen[j].row === oppoQueen[index].row) {
                        resultQueen.splice(j, 1, '')
                    }
                }
            }
            resultQueen = resultQueen.filter(Boolean)
        }

        // Xơi đối thủ

        for (let index = 0; index < resultQueen.length; index++) {
            if (resultQueen[index].col === oppo.King.col && resultQueen[index].row === oppo.King.row && oppo.King.del === 0) {
                return { col: resultQueen[index].col, row: resultQueen[index].row }
            }
            if (resultQueen[index].col === oppo.Queen.col && resultQueen[index].row === oppo.Queen.row && oppo.Queen.del === 0) {
                return { col: resultQueen[index].col, row: resultQueen[index].row }
            }
            if (resultQueen[index].col === oppo.Castle.col && resultQueen[index].row === oppo.Castle.row && oppo.Castle.del === 0) {
                return { col: resultQueen[index].col, row: resultQueen[index].row }
            }
            if (resultQueen[index].col === oppo.Horse.col && resultQueen[index].row === oppo.Horse.row && oppo.Horse.del === 0) {
                return { col: resultQueen[index].col, row: resultQueen[index].row }
            }
            if (resultQueen[index].col === oppo.Bishop.col && resultQueen[index].row === oppo.Bishop.row && oppo.Bishop.del === 0) {
                return { col: resultQueen[index].col, row: resultQueen[index].row }
            }
        }

        if (resultQueen.length > 0) {
            const result = resultQueen[Math.floor((Math.random()) * resultQueen.length)]
            if (!result) {
                console.log(resultQueen)
                throw new Error(' result castle not received ')
            }
            return { col: result.col, row: result.row }
        } else {
            console.log("Queen bị kẹt")
            return runKing(ally, oppo)
        }

    } catch (error) {

        console.log(' Run Castle: ', error)

    }
}


export function QueenOppo(chess: any) {

    try {

        if (!chess) { throw new Error('  chess not received ') }

        let oppoQueen: ChessLocation[] = []

        let R1 = chess.Queen.row

        while (R1 <= 7) {

            if (R1 === chess.Bishop.row && chess.Queen.col === chess.Bishop.col && chess.Bishop.del === 0) {
                break
            }
            if (R1 === chess.Horse.row && chess.Queen.col === chess.Horse.col && chess.Horse.del === 0) {
                break
            }
            if (R1 === chess.King.row && chess.Queen.col === chess.King.col && chess.King.del === 0) {
                break
            }
            if (R1 === chess.Castle.row && chess.Queen.col === chess.Castle.col && chess.Castle.del === 0) {
                break
            }
            if (R1 !== chess.Queen.row) {
                oppoQueen.push({ col: chess.Queen.col, row: R1 })
            }
            R1++
        }

        let R2 = chess.Queen.row

        while (R2 >= 0) {

            if (chess.Horse.row === R2 && chess.Horse.col === chess.Queen.col && chess.Horse.del === 0) {
                break
            }
            if (chess.Bishop.row === R2 && chess.Bishop.col === chess.Queen.col && chess.Bishop.del === 0) {
                break
            }
            if (chess.King.row === R2 && chess.King.col === chess.Queen.col && chess.King.del === 0) {
                break
            }
            if (chess.Castle.row === R2 && chess.Castle.col === chess.Queen.col && chess.Castle.del === 0) {
                break
            }
            if (R2 !== chess.Queen.row) {
                oppoQueen.push({ col: chess.Queen.col, row: R2 })
            }

            R2--
        }

        let C1 = chess.Queen.col

        while (C1 <= 7) {

            if (chess.Queen.row === chess.Horse.row && C1 === chess.Horse.col && chess.Horse.del === 0) {
                break
            }
            if (chess.Queen.row === chess.Bishop.row && C1 === chess.Bishop.col && chess.Bishop.del === 0) {
                break
            }
            if (chess.Queen.row === chess.King.row && C1 === chess.King.col && chess.King.del === 0) {
                break
            }
            if (chess.Queen.row === chess.Castle.row && C1 === chess.Castle.col && chess.Castle.del === 0) {
                break
            }
            if (C1 !== chess.Queen.col) {
                oppoQueen.push({ col: C1, row: chess.Queen.row })
            }

            C1++
        }

        let C2 = chess.Queen.col

        while (C2 >= 0) {

            if (chess.Horse.row === chess.Queen.row && C2 === chess.Horse.col && chess.Horse.del === 0) {
                break
            }
            if (chess.Bishop.row === chess.Queen.row && C2 === chess.Bishop.col && chess.Bishop.del === 0) {
                break
            }
            if (chess.King.row === chess.Queen.row && C2 === chess.King.col && chess.King.del === 0) {
                break
            }
            if (C2 !== chess.Queen.col) {
                oppoQueen.push({ col: C2, row: chess.Queen.row })
            }

            C2--
        }

        let R3 = chess.Queen.row
        let C3 = chess.Queen.col

        while (R3 <= 7 && C3 <= 7) {

            if (R3 === chess.Horse.row && C3 === chess.Horse.col && chess.Horse.del === 0) {
                break
            }
            if (R3 === chess.Castle.row && C3 === chess.Castle.col && chess.Castle.del === 0) {
                break
            }
            if (R3 === chess.Bishop.row && C3 === chess.Bishop.col && chess.Bishop.del === 0) {
                break
            }
            if (R3 === chess.King.row && C3 === chess.King.col) {
                break
            }
            if (R3 !== chess.Queen.row && C3 !== chess.Queen.col) {
                oppoQueen.push({ row: R3, col: C3 })
            }

            R3++
            C3++
        }

        let R4 = chess.Queen.row
        let C4 = chess.Queen.col

        while (R4 >= 0 && C4 <= 7) {

            if (R4 === chess.Horse.row && C4 === chess.Horse.col && chess.Horse.del === 0) {
                break
            }
            if (R4 === chess.Castle.row && C4 === chess.Castle.col && chess.Castle.del === 0) {
                break
            }
            if (R4 === chess.Bishop.row && C4 === chess.Bishop.col && chess.Bishop.del === 0) {
                break
            }
            if (R4 === chess.King.row && C4 === chess.King.col) {
                break
            }
            if (R4 !== chess.Queen.row && C4 !== chess.Queen.col) {
                oppoQueen.push({ col: C4, row: R4 })
            }

            R4--
            C4++

        }

        let R5 = chess.Queen.row
        let C5 = chess.Queen.col

        while (R5 >= 0 && C5 >= 0) {

            if (R5 === chess.Horse.row && C5 === chess.Horse.col && chess.Horse.del === 0) {
                break
            }
            if (R5 === chess.Castle.row && C5 === chess.Castle.col && chess.Castle.del === 0) {
                break
            }
            if (R5 === chess.Bishop.row && C5 === chess.Bishop.col && chess.Bishop.del === 0) {
                break
            }
            if (R5 === chess.King.row && C5 === chess.King.col) {
                break
            }
            if (R5 !== chess.Queen.row && C5 !== chess.Queen.col) {
                oppoQueen.push({ col: C5, row: R5 })
            }

            R5--
            C5--

        }

        let R6 = chess.Queen.row
        let C6 = chess.Queen.col

        while (R6 <= 7 && C6 >= 0) {

            if (R6 === chess.Horse.row && C6 === chess.Horse.col && chess.Horse.del === 0) {
                break
            }
            if (R6 === chess.Castle.row && C6 === chess.Castle.col && chess.Castle.del === 0) {
                break
            }
            if (R6 === chess.Bishop.row && C6 === chess.Bishop.col && chess.Bishop.del === 0) {
                break
            }
            if (R6 === chess.King.row && C6 === chess.King.col) {
                break
            }
            if (R6 !== chess.Queen.row && C6 !== chess.Queen.col) {

                oppoQueen.push({ col: C6, row: R6 })

            }
            R6++
            C6--
        }

        return { oppoQueen }
    } catch (error) {
        console.log('Run Queen: ', error)

    }
}