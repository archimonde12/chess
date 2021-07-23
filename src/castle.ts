import { BishopOppo } from './bishop';
import { HorseOppo } from './horse';
import { KingOppo, runKing } from './king';
import { QueenOppo } from './queen';
import { ChessLocation } from './resolvers';

export function runCastle(ally: any, oppo: any) {

    try {

        if (!ally) { throw new Error(' ally not received ') }
        if (!oppo) { throw new Error(' oppo not received ') }

        let resultCastle: any[] = []

        let R1 = ally.Castle.row

        while (R1 <= 7) {

            if (R1 === ally.Bishop.row && ally.Castle.col === ally.Bishop.col && ally.Bishop.del === 0) {
                break
            }
            if (R1 === ally.Horse.row && ally.Castle.col === ally.Horse.col && ally.Horse.del === 0) {
                break
            }
            if (R1 === ally.King.row && ally.Castle.col === ally.King.col && ally.King.del === 0) {
                break
            }
            if (R1 === ally.Queen.row && ally.Castle.col === ally.Queen.col && ally.Queen.del === 0) {
                break
            }
            if (R1 !== ally.Castle.row) {
                resultCastle.push({ col: ally.Castle.col, row: R1 })
            }
            R1++
        }

        let R5 = ally.Castle.row

        while (R5 >= 0) {

            if (ally.Horse.row === R5 && ally.Horse.col === ally.Castle.col && ally.Horse.del === 0) {
                break
            }
            if (ally.Bishop.row === R5 && ally.Bishop.col === ally.Castle.col && ally.Bishop.del === 0) {
                break
            }
            if (ally.King.row === R5 && ally.King.col === ally.Castle.col && ally.King.del === 0) {
                break
            }
            if (ally.Queen.row === R5 && ally.Queen.col === ally.Castle.col && ally.Queen.del === 0) {
                break
            }
            if (R5 !== ally.Castle.row) {
                resultCastle.push({ col: ally.Castle.col, row: R5 })
            }

            R5--
        }

        let C2 = ally.Castle.col

        while (C2 <= 7) {

            if (ally.Castle.row === ally.Horse.row && C2 === ally.Horse.col && ally.Horse.del === 0) {
                break
            }
            if (ally.Castle.row === ally.Bishop.row && C2 === ally.Bishop.col && ally.Bishop.del === 0) {
                break
            }
            if (ally.Castle.row === ally.King.row && C2 === ally.King.col && ally.King.del === 0) {
                break
            }
            if (ally.Castle.row === ally.Queen.row && C2 === ally.Queen.col && ally.Queen.del === 0) {
                break
            }
            if (C2 !== ally.Castle.col) {
                resultCastle.push({ col: C2, row: ally.Castle.row })
            }

            C2++
        }

        let C6 = ally.Castle.col

        while (C6 >= 0) {

            if (ally.Horse.row === ally.Castle.row && C6 === ally.Horse.col && ally.Horse.del === 0) {
                break
            }
            if (ally.Bishop.row === ally.Castle.row && C6 === ally.Bishop.col && ally.Bishop.del === 0) {
                break
            }
            if (ally.King.row === ally.Castle.row && C6 === ally.King.col && ally.King.del === 0) {
                break
            }
            if (ally.Queen.row === ally.Castle.row && C6 === ally.Queen.col && ally.Queen.del === 0) {
                break
            }

            if (C6 !== ally.Castle.col) {
                resultCastle.push({ col: C6, row: ally.Castle.row })
            }

            C6--
        }

        if (resultCastle.length === 0) { throw new Error(" Logic Castle sai") }



        // Bợp vua nếu có thể

        for (let index = 0; index < resultCastle.length; index++) {
            if (resultCastle[index].col === oppo.King.col && resultCastle[index].row === oppo.King.row && oppo.King.del === 0) {
                return { col: resultCastle[index].col, row: resultCastle[index].row }
            }
            if (resultCastle[index].col === oppo.Queen.col && resultCastle[index].row === oppo.Queen.row && oppo.Queen.del === 0) {
                return { col: resultCastle[index].col, row: resultCastle[index].row }
            }
            if (resultCastle[index].col === oppo.Castle.col && resultCastle[index].row === oppo.Castle.row && oppo.Castle.del === 0) {
                break
            }
            if (resultCastle[index].col === oppo.Horse.col && resultCastle[index].row === oppo.Horse.row && oppo.Horse.del === 0) {
                break
            }
            if (resultCastle[index].col === oppo.Bishop.col && resultCastle[index].row === oppo.Bishop.row && oppo.Bishop.del === 0) {
                break
            }
        }

        console.log(resultCastle)

        let _resultCastle: any[] = []
        _resultCastle = [...resultCastle]

        /*
        Xoá các nước đi nguy hiểm
        */

        // Xe

        if (oppo.Castle.del === 0) {
            const { oppoCastle } = CastleOppo(oppo) as {
                oppoCastle: [ChessLocation]
            }

            for (let j = 0; j < resultCastle.length; j++) {
                for (let index = 0; index < oppoCastle.length; index++) {
                    if (resultCastle[j].row === oppoCastle[index].row && resultCastle[j].col === oppoCastle[index].col) {
                        console.log("Delted Castle vs Castel", resultCastle[j])
                        resultCastle.splice(j, 1, '')
                    }
                }
            }
            resultCastle = resultCastle.filter(Boolean)
        }

        // Tịnh

        if (oppo.Bishop.del === 0) {
            const { oppoBishop } = BishopOppo(oppo) as {
                oppoBishop: [ChessLocation]
            }

            for (let j = 0; j < resultCastle.length; j++) {
                for (let index = 0; index < oppoBishop.length; index++) {
                    if (resultCastle[j].col === oppoBishop[index].col && resultCastle[j].row === oppoBishop[index].row) {
                        console.log("Delted Castle vs Bishop", resultCastle[j])
                        resultCastle.splice(j, 1, '')
                    }
                }
            }
            resultCastle = resultCastle.filter(Boolean)
        }

        // Mã

        if (oppo.Horse.del === 0) {
            const { oppoHorse } = HorseOppo(oppo) as {
                oppoHorse: [ChessLocation]
            }
            for (let j = 0; j < resultCastle.length; j++) {
                for (let index = 0; index < oppoHorse.length; index++) {
                    if (resultCastle[j].col === oppoHorse[index].col && resultCastle[j].row === oppoHorse[index].row) {
                        console.log("Delted Castle vs Horse", resultCastle[j])
                        resultCastle.splice(j, 1, '')
                    }
                }
            }
            resultCastle = resultCastle.filter(Boolean)
        }

        // Vua

        if (oppo.King.del === 0) {
            const { oppoKing } = KingOppo(oppo) as {
                oppoKing: [ChessLocation]
            }

            for (let j = 0; j < resultCastle.length; j++) {
                for (let index = 0; index < oppoKing.length; index++) {
                    if (resultCastle[j].col === oppoKing[index].col && resultCastle[j].row === oppoKing[index].row) {
                        console.log("Delted Castle vs King", resultCastle[j])
                        resultCastle.splice(j, 1, '')
                    }
                }
            }
            resultCastle = resultCastle.filter(Boolean)
        }

        // Hậu

        if (oppo.Queen.del === 0) {
            const { oppoQueen } = QueenOppo(oppo) as {
                oppoQueen: [ChessLocation]
            }

            for (let j = 0; j < resultCastle.length; j++) {
                for (let index = 0; index < oppoQueen.length; index++) {
                    if (resultCastle[j].col === oppoQueen[index].col && resultCastle[j].row === oppoQueen[index].row) {
                        console.log("Delted Castle vs Queen", resultCastle[j])
                        resultCastle.splice(j, 1, '')
                    }
                }
            }
            resultCastle = resultCastle.filter(Boolean)
        }

        // Bắt đối thủ

        for (let index = 0; index < resultCastle.length; index++) {
            if (resultCastle[index].col === oppo.King.col && resultCastle[index].row === oppo.King.row && oppo.King.del === 0) {
                return { col: resultCastle[index].col, row: resultCastle[index].row }
            }
            if (resultCastle[index].col === oppo.Queen.col && resultCastle[index].row === oppo.Queen.row && oppo.Queen.del === 0) {
                return { col: resultCastle[index].col, row: resultCastle[index].row }
            }
            if (resultCastle[index].col === oppo.Castle.col && resultCastle[index].row === oppo.Castle.row && oppo.Castle.del === 0) {
                return { col: resultCastle[index].col, row: resultCastle[index].row }
            }
            if (resultCastle[index].col === oppo.Horse.col && resultCastle[index].row === oppo.Horse.row && oppo.Horse.del === 0) {
                return { col: resultCastle[index].col, row: resultCastle[index].row }
            }
            if (resultCastle[index].col === oppo.Bishop.col && resultCastle[index].row === oppo.Bishop.row && oppo.Bishop.del === 0) {
                return { col: resultCastle[index].col, row: resultCastle[index].row }
            }
        }

        if (resultCastle.length > 0) {
            const result = resultCastle[Math.floor((Math.random()) * resultCastle.length)]
            if (!result) {
                console.log(resultCastle)
                throw new Error(' result castle not received ')
            }
            return { col: result.col, row: result.row }
        } else {
            console.log("Castle bị kẹt")
            return runKing(ally, oppo)
        }

    } catch (error) {

        console.log(' Run Castle: ', error)

    }
}


export function CastleOppo(chess: any) {

    try {
        if (!chess) { throw new Error(' chess not received ') }

        let oppoCastle: ChessLocation[] = []

        let R1 = chess.Castle.row

        while (R1 <= 7) {

            if (R1 === chess.Bishop.row && chess.Castle.col === chess.Bishop.col && chess.Bishop.del === 0) {
                break
            }
            if (R1 === chess.Horse.row && chess.Castle.col === chess.Horse.col && chess.Horse.del === 0) {
                break
            }
            if (R1 === chess.King.row && chess.Castle.col === chess.King.col && chess.King.del === 0) {
                break
            }
            if (R1 === chess.Queen.row && chess.Castle.col === chess.Queen.col && chess.Queen.del === 0) {
                break
            }
            if (R1 !== chess.Castle.row) {
                oppoCastle.push({ col: chess.Castle.col, row: R1 })
            }
            R1++
        }

        let R5 = chess.Castle.row

        while (R5 >= 0) {

            if (chess.Horse.row === R5 && chess.Horse.col === chess.Castle.col && chess.Horse.del === 0) {
                break
            }
            if (chess.Bishop.row === R5 && chess.Bishop.col === chess.Castle.col && chess.Bishop.del === 0) {
                break
            }
            if (chess.King.row === R5 && chess.King.col === chess.Castle.col && chess.King.del === 0) {
                break
            }
            if (chess.Queen.row === R5 && chess.Queen.col === chess.Castle.col && chess.Queen.del === 0) {
                break
            }
            if (R5 !== chess.Castle.row) {
                oppoCastle.push({ col: chess.Castle.col, row: R5 })
            }

            R5--
        }

        let C2 = chess.Castle.col

        while (C2 <= 7) {

            if (chess.Castle.row === chess.Horse.row && C2 === chess.Horse.col && chess.Horse.del === 0) {
                break
            }
            if (chess.Castle.row === chess.Bishop.row && C2 === chess.Bishop.col && chess.Bishop.del === 0) {
                break
            }
            if (chess.Castle.row === chess.King.row && C2 === chess.King.col && chess.King.del === 0) {
                break
            }
            if (chess.Castle.row === chess.Queen.row && C2 === chess.Queen.col && chess.Queen.del === 0) {
                break
            }
            if (C2 !== chess.Castle.col) {
                oppoCastle.push({ col: C2, row: chess.Castle.row })
            }

            C2++
        }

        let C6 = chess.Castle.col

        while (C6 >= 0) {

            if (chess.Horse.row === chess.Castle.row && C6 === chess.Horse.col && chess.Horse.del === 0) {
                break
            }
            if (chess.Bishop.row === chess.Castle.row && C6 === chess.Bishop.col && chess.Bishop.del === 0) {
                break
            }
            if (chess.King.row === chess.Castle.row && C6 === chess.King.col && chess.King.del === 0) {
                break
            }
            if (chess.Queen.row === chess.Castle.row && C6 === chess.Queen.col && chess.Queen.del === 0) {
                break
            }

            if (C6 !== chess.Castle.col) {
                oppoCastle.push({ col: C6, row: chess.Castle.row })
            }

            C6--
        }


        return { oppoCastle }
    } catch (error) {
        console.log('Run Castle: ', error)

    }
}