import { HorseOppo } from './horse';
import { KingOppo } from './king';
import { CastleOppo } from './castle'

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

        if (!ally) { throw new Error(" Ally not received ") }

        if (!oppo) { throw new Error(" Oppo not received ") }

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
            if (R1 === ally.King.row && C1 === ally.King.col) {
                break
            }

            if (R1 !== ally.Bishop.row && C1 !== ally.Bishop.col) {

                resultBishop.push({ row: R1, col: C1 })

            }

            if (R1 === oppo.King.row && C1 === oppo.King.col && oppo.King.del == 0) { return { row: R1, col: C1 } }

            if (R1 === oppo.Castle.row && C1 === oppo.Castle.col && oppo.Castle.del == 0) { return { row: R1, col: C1 } }

            if (R1 === oppo.Bishop.row && C1 === oppo.Bishop.col && oppo.Bishop.del == 0) { return { row: R1, col: C1 } }

            if (R1 === oppo.Horse.row && C1 === oppo.Horse.col && oppo.Horse.del == 0) { return { row: R1, col: C1 } }

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
            if (R5 === ally.King.row && C5 === ally.King.col) {
                break
            }
            if (R5 !== ally.Bishop.row && C5 !== ally.Bishop.col) {

                resultBishop.push({ row: R5, col: C5 })

            }

            if (R5 === oppo.King.row && C5 === oppo.King.col && oppo.King.del == 0) { return { row: R5, col: C5 } }

            if (R5 === oppo.Castle.row && C5 === oppo.Castle.col && oppo.Castle.del == 0) { return { row: R5, col: C5 } }

            if (R5 === oppo.Bishop.row && C5 === oppo.Bishop.col && oppo.Bishop.del == 0) { return { row: R5, col: C5 } }

            if (R5 === oppo.Horse.row && C5 === oppo.Horse.col && oppo.Horse.del == 0) { return { row: R5, col: C5 } }

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
            if (R2 === ally.King.row && C2 === ally.King.col) {
                break
            }
            if (R2 !== ally.Bishop.row && C2 !== ally.Bishop.col) {

                resultBishop.push({ row: R2, col: C2 })

            }

            if (R2 === ally.King.row && C2 === ally.King.col && oppo.King.del == 0) { return { row: R2, col: C2 } }

            if (R2 === oppo.Castle.row && C2 === oppo.Castle.col && oppo.Castle.del == 0) { return { row: R2, col: C2 } }

            if (R2 === oppo.Bishop.row && C2 === oppo.Bishop.col && oppo.Bishop.del == 0) { return { row: R2, col: C2 } }

            if (R2 === oppo.Horse.row && C2 === oppo.Horse.col && oppo.Horse.del == 0) { return { row: R2, col: C2 } }

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
            if (R6 === ally.King.row && C6 === ally.King.col) {
                break
            }
            if (R6 !== ally.Bishop.row && C6 !== ally.Bishop.col) {

                resultBishop.push({ row: R6, col: C6 })

            }

            if (R6 === ally.King.row && C6 === ally.King.col && oppo.King.del == 0) { return { row: R6, col: C6 } }

            if (R6 === oppo.Castle.row && C6 === oppo.Castle.col && oppo.Castle.del == 0) { return { row: R6, col: C6 } }

            if (R6 === oppo.Bishop.row && C6 === oppo.Bishop.col && oppo.Bishop.del == 0) { return { row: R6, col: C6 } }

            if (R6 === oppo.Horse.row && C6 === oppo.Horse.col && oppo.Horse.del == 0) { return { row: R6, col: C6 } }

            R6++
            C6--

        }

        const _resultBishop: ChessLocation[] = []
        _resultBishop.concat(resultBishop)
        /* 
        Xoá nước đi có thể bị ăn
        */

        // Xe

        if (oppo.Castle.del === 0) {
            const { oppoCastle } = CastleOppo(ally, oppo) as {
                oppoCastle: [ChessLocation]

            }

            for (let j = 0; j < resultBishop.length; j++) {
                for (let index = 0; index < oppoCastle.length; index++) {
                    if (resultBishop[j].row == oppoCastle[index].row && resultBishop[j].col == oppoCastle[index].col) {
                        resultBishop.splice(j, 1, '')
                    }
                }
            }
            resultBishop = resultBishop.filter(Boolean)
        }



        // Tịnh đối thủ

        if (oppo.Horse.del === 0) {
            const { oppoBishop } = BishopOppo(ally, oppo) as {
                oppoBishop: [ChessLocation]

            }

            for (let j = 0; j < resultBishop.length; j++) {
                for (let index = 0; index < oppoBishop.length; index++) {
                    if (resultBishop[j].row == oppoBishop[index].row && resultBishop[j].col == oppoBishop[index].col) {
                        resultBishop.splice(j, 1, '')
                    }
                }
            }
            resultBishop = resultBishop.filter(Boolean)
        }

        // Vua

        if (oppo.King.del === 0) {
            const { oppoKing } = KingOppo(ally, oppo) as {
                oppoKing: [ChessLocation]
            }

            for (let j = 0; j < resultBishop.length; j++) {
                for (let index = 0; index < oppoKing.length; index++) {
                    if (resultBishop[j].row === oppoKing[index].row && resultBishop[j].col === oppoKing[index].col) {
                        resultBishop.splice(j, 1, '')
                    }
                }
            }
            resultBishop = resultBishop.filter(Boolean)
        }

        // Mã


        if (oppo.Horse.del === 0) {
            const { oppoHorse } = HorseOppo(ally, oppo) as {
                oppoHorse: [ChessLocation]
            }

            for (let j = 0; j < resultBishop.length; j++) {
                for (let index = 0; index < oppoHorse.length; index++) {
                    if (resultBishop[j].row === oppoHorse[index].row && resultBishop[j].col === oppoHorse[index].col) {
                        resultBishop.splice(j, 1, '')
                    }
                }
            }
            resultBishop = resultBishop.filter(Boolean)
        }

        if (resultBishop.length > 0) {
            const result = resultBishop[Math.floor((Math.random()) * resultBishop.length)]

            if (!result) {
                console.log(ally, oppo)
                console.log(resultBishop)
                throw new Error(" bishop result not received ")
            }

            return { col: result.col, row: result.row }

        } else {
            const result = _resultBishop[Math.floor((Math.random()) * _resultBishop.length)]

            if (!result) {
                console.log(ally, oppo)
                console.log(_resultBishop)
                throw new Error(" bishop _result not received ")
            }

            return { col: result.col, row: result.row }

        }

    } catch (error) {

        console.log(error)

    }

}

export function BishopOppo(ally: any, oppo: any) {

    try {

        if (!ally) { throw new Error(" Ally not received ") }

        if (!oppo) { throw new Error(" Oppo not received ") }

        let oppoBishop: any[] = []

        let R1 = oppo.Bishop.row
        let C1 = oppo.Bishop.col

        while (R1 <= 7 && C1 <= 7) {

            if (R1 === oppo.Horse.row && C1 === oppo.Horse.col && oppo.Horse.del === 0) {
                break
            }
            if (R1 === oppo.Castle.row && C1 === oppo.Castle.col && oppo.Castle.del === 0) {
                break
            }
            if (R1 === oppo.King.row && C1 === oppo.King.col) {
                break
            }
            if (R1 !== oppo.Bishop.row && C1 !== oppo.Bishop.col) {

                oppoBishop.push({ row: R1, col: C1 })

            }

            R1++
            C1++
        }

        let R5 = oppo.Bishop.row
        let C5 = oppo.Bishop.col

        while (R5 >= 0 && C5 <= 7) {

            if (R5 === oppo.Horse.row && C5 === oppo.Horse.col && oppo.Horse.del === 0) {
                break
            }
            if (R5 === oppo.Castle.row && C5 === oppo.Castle.col && oppo.Castle.del === 0) {
                break
            }
            if (R5 === oppo.King.row && C5 === oppo.King.col) {
                break
            }
            if (R5 !== oppo.Bishop.row && C5 !== oppo.Bishop.col) {

                oppoBishop.push({ row: R5, col: C5 })

            }

            R5--
            C5++

        }

        let R2 = oppo.Bishop.row
        let C2 = oppo.Bishop.col

        while (R2 >= 0 && C2 >= 0) {

            if (R2 === oppo.Horse.row && C2 === oppo.Horse.col && oppo.Horse.del === 0) {
                break
            }
            if (R2 === oppo.Castle.row && C2 === oppo.Castle.col && oppo.Castle.del === 0) {
                break
            }
            if (R2 === oppo.King.row && C2 === oppo.King.col) {
                break
            }
            if (R2 !== oppo.Bishop.row && C2 !== oppo.Bishop.col) {

                oppoBishop.push({ row: R2, col: C2 })

            }

            R2--
            C2--

        }

        let R6 = oppo.Bishop.row
        let C6 = oppo.Bishop.col

        while (R6 <= 7 && C6 >= 0) {

            if (R6 === oppo.Horse.row && C6 === oppo.Horse.col && oppo.Horse.del === 0) {
                break
            }
            if (R6 === oppo.Castle.row && C6 === oppo.Castle.col && oppo.Castle.del === 0) {
                break
            }
            if (R6 === oppo.King.row && C6 === oppo.King.col) {
                break
            }
            if (R6 !== oppo.Bishop.row && C6 !== oppo.Bishop.col) {

                oppoBishop.push({ row: R6, col: C6 })

            }

            R6++
            C6--

        }

        return { oppoBishop }

    } catch (error) {

        console.log(error)

    }

}