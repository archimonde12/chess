import { HorseOppo } from './horse';
import { KingOppo, runKing } from './king';
import { CastleOppo } from './castle'
import { QueenOppo } from './queen';

type ChessLocation = {
    col: number,
    row: number,
}

/*

Lỗi tịnh nhảy qua đầu => Ok
Lỗi tịnh không di chuyển => Ok
Tịnh né con xe đối thủ => Ok
Tịnh né con tịnh đối thủ => Ok

*/

export function runbishop(ally: any, oppo: any) {

    try {

        if (!ally) { throw new Error(" ally not received ") }

        if (!oppo) { throw new Error(" oppo not received ") }

        let resultBishop: any[] = []

        let R1 = ally.Bishop.row
        let C1 = ally.Bishop.col

        while (R1 <= 7 && C1 <= 7) {

            if (R1 === ally.Horse.row && C1 === ally.Horse.col && ally.Horse.del === 0) {
                break
            }
            if (R1 === ally.Castle.row && C1 === ally.Castle.col && ally.Castle.del === 0) {
                break
            }
            if (R1 === ally.Queen.row && C1 === ally.Queen.col && ally.Queen.del === 0) {
                break
            }
            if (R1 === ally.King.row && C1 === ally.King.col) {
                break
            }
            if (R1 !== ally.Bishop.row && C1 !== ally.Bishop.col) {
                resultBishop.push({ row: R1, col: C1 })
            }

            R1++
            C1++
        }

        let R5 = ally.Bishop.row
        let C5 = ally.Bishop.col

        while (R5 >= 0 && C5 <= 7) {

            if (R5 === ally.Horse.row && C5 === ally.Horse.col && ally.Horse.del === 0) {
                break
            }
            if (R5 === ally.Castle.row && C5 === ally.Castle.col && ally.Castle.del === 0) {
                break
            }
            if (R5 === ally.Queen.row && C5 === ally.Queen.col && ally.Queen.del === 0) {
                break
            }
            if (R5 === ally.King.row && C5 === ally.King.col) {
                break
            }
            if (R5 !== ally.Bishop.row && C5 !== ally.Bishop.col) {
                resultBishop.push({ col: C5, row: R5 })
            }

            R5--
            C5++

        }

        let R2 = ally.Bishop.row
        let C2 = ally.Bishop.col

        while (R2 >= 0 && C2 >= 0) {

            if (R2 === ally.Horse.row && C2 === ally.Horse.col && ally.Horse.del === 0) {
                break
            }
            if (R2 === ally.Castle.row && C2 === ally.Castle.col && ally.Castle.del === 0) {
                break
            }
            if (R2 === ally.Queen.row && C2 === ally.Queen.col && ally.Queen.del === 0) {
                break
            }
            if (R2 === ally.King.row && C2 === ally.King.col) {
                break
            }
            if (R2 !== ally.Bishop.row && C2 !== ally.Bishop.col) {
                resultBishop.push({ col: C2, row: R2 })
            }

            R2--
            C2--

        }

        let R6 = ally.Bishop.row
        let C6 = ally.Bishop.col

        while (R6 <= 7 && C6 >= 0) {

            if (R6 === ally.Horse.row && C6 === ally.Horse.col && ally.Horse.del === 0) {
                break
            }
            if (R6 === ally.Castle.row && C6 === ally.Castle.col && ally.Castle.del === 0) {
                break
            }
            if (R6 === ally.Queen.row && C6 === ally.Queen.col && ally.Queen.del === 0) {
                break
            }
            if (R6 === ally.King.row && C6 === ally.King.col) {
                break
            }
            if (R6 !== ally.Bishop.row && C6 !== ally.Bishop.col) {

                resultBishop.push({ col: C6, row: R6 })

            }

            R6++
            C6--

        }

        if (resultBishop.length === 0) {
            console.log('Lỗi logic')
            return runKing(ally, oppo)
        }

        // Bợp hậu nếu có thể

        for (let index = 0; index < resultBishop.length; index++) {
            if (resultBishop[index].col === oppo.King.col && resultBishop[index].row === oppo.King.row && oppo.King.del === 0) {
                return { col: resultBishop[index].col, row: resultBishop[index].row }
            }
            if (resultBishop[index].col === oppo.Queen.col && resultBishop[index].row === oppo.Queen.row && oppo.Queen.del === 0) {
                return { col: resultBishop[index].col, row: resultBishop[index].row }
            }
            if (resultBishop[index].col === oppo.Castle.col && resultBishop[index].row === oppo.Castle.row && oppo.Castle.del === 0) {
                break
            }
            if (resultBishop[index].col === oppo.Horse.col && resultBishop[index].row === oppo.Horse.row && oppo.Horse.del === 0) {
                break
            }
            if (resultBishop[index].col === oppo.Bishop.col && resultBishop[index].row === oppo.Bishop.row && oppo.Bishop.del === 0) {
                break
            }
        }


        let _resultBishop: any[] = []
        _resultBishop = [...resultBishop]


        /* 
        Xoá nước đi có thể bị ăn
        */

        // Xe

        if (oppo.Castle.del === 0) {
            const { oppoCastle } = CastleOppo(oppo) as {
                oppoCastle: [ChessLocation]

            }

            for (let j = 0; j < resultBishop.length; j++) {
                for (let index = 0; index < oppoCastle.length; index++) {
                    if (resultBishop[j].col == oppoCastle[index].col && resultBishop[j].row == oppoCastle[index].row) {
                        console.log("Deleted Bishop vs Castle", resultBishop[j])
                        resultBishop.splice(j, 1, '')
                    }
                }
            }
            resultBishop = resultBishop.filter(Boolean)
        }

        // Tịnh đối thủ

        if (oppo.Horse.del === 0) {
            const { oppoBishop } = BishopOppo(oppo) as {
                oppoBishop: [ChessLocation]

            }

            for (let j = 0; j < resultBishop.length; j++) {
                for (let index = 0; index < oppoBishop.length; index++) {
                    if (resultBishop[j].col == oppoBishop[index].col && resultBishop[j].row == oppoBishop[index].row) {
                        console.log("Deleted Bishop vs Bishop", resultBishop[j])
                        resultBishop.splice(j, 1, '')
                    }
                }
            }
            resultBishop = resultBishop.filter(Boolean)

        }

        // Vua

        if (oppo.King.del === 0) {
            const { oppoKing } = KingOppo(oppo) as {
                oppoKing: [ChessLocation]
            }

            for (let j = 0; j < resultBishop.length; j++) {
                for (let index = 0; index < oppoKing.length; index++) {
                    if (resultBishop[j].col === oppoKing[index].col && resultBishop[j].row === oppoKing[index].row) {
                        console.log("Deleted Bishop vs King", resultBishop[j])
                        resultBishop.splice(j, 1, '')
                    }
                }
            }
            resultBishop = resultBishop.filter(Boolean)

        }

        // Mã

        if (oppo.Horse.del === 0) {
            const { oppoHorse } = HorseOppo(oppo) as {
                oppoHorse: [ChessLocation]
            }

            for (let j = 0; j < resultBishop.length; j++) {
                for (let index = 0; index < oppoHorse.length; index++) {
                    if (resultBishop[j].col === oppoHorse[index].col && resultBishop[j].row === oppoHorse[index].row) {
                        console.log("Deleted Bishop vs Horse", resultBishop[j])
                        resultBishop.splice(j, 1, '')
                    }
                }
            }
            resultBishop = resultBishop.filter(Boolean)
        }

        // Hậu

        if (oppo.Queen.del === 0) {
            const { oppoQueen } = QueenOppo(oppo) as {
                oppoQueen: [ChessLocation]
            }

            for (let j = 0; j < resultBishop.length; j++) {
                for (let index = 0; index < oppoQueen.length; index++) {
                    if (resultBishop[j].col === oppoQueen[index].col && resultBishop[j].row === oppoQueen[index].row) {
                        console.log("Deleted Bishop vs Queen", resultBishop[j])
                        resultBishop.splice(j, 1, '')
                    }
                }
            }
            resultBishop = resultBishop.filter(Boolean)
        }

        // Bắt đối thủ

        for (let index = 0; index < resultBishop.length; index++) {
            if (resultBishop[index].col === oppo.King.col && resultBishop[index].row === oppo.King.row && oppo.King.del === 0) {
                return { col: resultBishop[index].col, row: resultBishop[index].row }
            }
            if (resultBishop[index].col === oppo.Queen.col && resultBishop[index].row === oppo.Queen.row && oppo.Queen.del === 0) {
                return { col: resultBishop[index].col, row: resultBishop[index].row }
            }
            if (resultBishop[index].col === oppo.Castle.col && resultBishop[index].row === oppo.Castle.row && oppo.Castle.del === 0) {
                return { col: resultBishop[index].col, row: resultBishop[index].row }
            }
            if (resultBishop[index].col === oppo.Horse.col && resultBishop[index].row === oppo.Horse.row && oppo.Horse.del === 0) {
                return { col: resultBishop[index].col, row: resultBishop[index].row }
            }
            if (resultBishop[index].col === oppo.Bishop.col && resultBishop[index].row === oppo.Bishop.row && oppo.Bishop.del === 0) {
                return { col: resultBishop[index].col, row: resultBishop[index].row }
            }   
        }

        if (resultBishop.length > 0) {
            const result = resultBishop[Math.floor((Math.random()) * resultBishop.length)]

            if (!result) {
                console.log(resultBishop)
                throw new Error(" result not received ")
            }

            return { col: result.col, row: result.row }

        } else {
            console.log("Bishop bị kẹt")

            return runKing(ally, oppo)
        }

    } catch (error) {

        console.log(error)

    }
}

export function BishopOppo( chess: any) {

    try {


        if (!chess) { throw new Error(" chess not received ") }

        let oppoBishop: any[] = []

        let R1 = chess.Bishop.row
        let C1 = chess.Bishop.col

        while (R1 <= 7 && C1 <= 7) {

            if (R1 === chess.Horse.row && C1 === chess.Horse.col && chess.Horse.del === 0) {
                break
            }
            if (R1 === chess.Castle.row && C1 === chess.Castle.col && chess.Castle.del === 0) {
                break
            }
            if (R1 === chess.Queen.row && C1 === chess.Queen.col && chess.Queen.del === 0) {
                break
            }
            if (R1 === chess.King.row && C1 === chess.King.col) {
                break
            }
            if (R1 !== chess.Bishop.row && C1 !== chess.Bishop.col) {
                oppoBishop.push({ row: R1, col: C1 })
            }

            R1++
            C1++
        }

        let R5 = chess.Bishop.row
        let C5 = chess.Bishop.col

        while (R5 >= 0 && C5 <= 7) {

            if (R5 === chess.Horse.row && C5 === chess.Horse.col && chess.Horse.del === 0) {
                break
            }
            if (R5 === chess.Castle.row && C5 === chess.Castle.col && chess.Castle.del === 0) {
                break
            }
            if (R5 === chess.Queen.row && C5 === chess.Queen.col && chess.Queen.del === 0) {
                break
            }
            if (R5 === chess.King.row && C5 === chess.King.col) {
                break
            }
            if (R5 !== chess.Bishop.row && C5 !== chess.Bishop.col) {
                oppoBishop.push({ col: C5, row: R5 })
            }

            R5--
            C5++

        }

        let R2 = chess.Bishop.row
        let C2 = chess.Bishop.col

        while (R2 >= 0 && C2 >= 0) {

            if (R2 === chess.Horse.row && C2 === chess.Horse.col && chess.Horse.del === 0) {
                break
            }
            if (R2 === chess.Castle.row && C2 === chess.Castle.col && chess.Castle.del === 0) {
                break
            }
            if (R2 === chess.Queen.row && C2 === chess.Queen.col && chess.Queen.del === 0) {
                break
            }
            if (R2 === chess.King.row && C2 === chess.King.col) {
                break
            }
            if (R2 !== chess.Bishop.row && C2 !== chess.Bishop.col) {
                oppoBishop.push({ col: C2, row: R2 })
            }

            R2--
            C2--

        }

        let R6 = chess.Bishop.row
        let C6 = chess.Bishop.col

        while (R6 <= 7 && C6 >= 0) {

            if (R6 === chess.Horse.row && C6 === chess.Horse.col && chess.Horse.del === 0) {
                break
            }
            if (R6 === chess.Castle.row && C6 === chess.Castle.col && chess.Castle.del === 0) {
                break
            }
            if (R6 === chess.Queen.row && C6 === chess.Queen.col && chess.Queen.del === 0) {
                break
            }
            if (R6 === chess.King.row && C6 === chess.King.col) {
                break
            }
            if (R6 !== chess.Bishop.row && C6 !== chess.Bishop.col) {

                oppoBishop.push({ col: C6, row: R6 })

            }

            R6++
            C6--

        }


        return { oppoBishop }

    } catch (error) {

        console.log(error)

    }

}