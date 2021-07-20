import { BishopOppo } from './bishop';
import { HorseOppo } from './horse';
import { KingOppo } from "./king";
import { ChessLocation } from './resolvers'
import { board } from './resolvers';

export function runCastle(ally: any, oppo: any) {

    try {

        if (!ally) { throw new Error(" Ally not received ") }
        if (!oppo) { throw new Error(" Oppo not received ") }

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
            if (R1 !== ally.Castle.row) {

                resultCastle.push({ col: ally.Castle.col, row: R1 })
            }

            if (ally.Castle.col === oppo.King.col && R1 === oppo.King.row) { return { col: ally.Castle.col, row: R1 } }

            if (ally.Castle.col === oppo.Castle.col && R1 === oppo.Castle.row && oppo.Castle.del === 0) { return { col: ally.Castle.col, row: R1 } }

            if (ally.Castle.col === oppo.Horse.col && R1 === oppo.Horse.row && oppo.Horse.del === 0) { return { col: ally.Castle.col, row: R1 } }

            if (ally.Castle.col === oppo.Bishop.col && R1 === oppo.Bishop.row && oppo.Bishop.del === 0) { return { col: ally.Castle.col, row: R1 } }

            R1++
        }

        let R5 = ally.Castle.row

        while (R5 >= 0) {

            if (ally.Horse.row + 1 === R5 && ally.Horse.col === ally.Castle.col && ally.Horse.del === 0) {
                break
            }
            if (ally.Bishop.row + 1 === R5 && ally.Bishop.col === ally.Castle.col && ally.Bishop.del === 0) {
                break
            }
            if (ally.King.row + 1 === R5 && ally.King.col === ally.Castle.col && ally.King.del === 0) {
                break
            }
            if (R5 !== ally.Castle.row) {

                resultCastle.push({ col: ally.Castle.col, row: R5 })

            }
            if (R5 === oppo.King.row && ally.Castle.col === oppo.King.col) { return { col: ally.Castle.col, row: R5 } }

            if (ally.Castle.col === oppo.Castle.col && R5 === oppo.Castle.row && oppo.Castle.del === 0) { return { col: ally.Castle.col, row: R5 } }

            if (ally.Castle.col === oppo.Horse.col && R5 === oppo.Horse.row && oppo.Horse.del === 0) { return { col: ally.Castle.col, row: R5 } }

            if (ally.Castle.col === oppo.Bishop.col && R5 === oppo.Bishop.row && oppo.Bishop.del == 0) { return { col: ally.Castle.col, row: R5 } }

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
            if (C2 !== ally.Castle.col) {

                resultCastle.push({ col: C2, row: ally.Castle.row })

            }
            if (ally.Castle.row === oppo.King.row && C2 === oppo.King.col) { return { col: C2, row: ally.Castle.row } }

            if (ally.Castle.row === oppo.Castle.row && C2 === oppo.Castle.col && oppo.Castle.del === 0) { return { col: C2, row: ally.Castle.row } }

            if (ally.Castle.row === oppo.Horse.row && C2 === oppo.Horse.col && oppo.Horse.del === 0) { return { col: C2, row: ally.Castle.row } }

            if (ally.Castle.row === oppo.Bishop.row && C2 === oppo.Bishop.col && oppo.Bishop.del === 0) { return { col: C2, row: ally.Castle.row } }

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
            if (C6 !== ally.Castle.col) {

                resultCastle.push({ col: C6, row: ally.Castle.row })

            }

            if (ally.Castle.row === oppo.King.row && C6 === oppo.King.col) { return { col: C6, row: ally.Castle.row } }

            if (ally.Castle.row === oppo.Castle.row && C6 === oppo.Castle.col && oppo.Castle.del === 0) { return { col: C6, row: ally.Castle.row } }

            if (ally.Castle.row === oppo.Horse.row && C6 === oppo.Horse.col && oppo.Horse.del === 0) { return { col: C6, row: ally.Castle.row } }

            if (ally.Castle.row === oppo.Bishop.row && C6 === oppo.Bishop.col && oppo.Bishop.del === 0) { return { col: C6, row: ally.Castle.row } }

            C6--
        }
        console.log("xe", resultCastle)

        let _resultCastle: ChessLocation[] = []
        _resultCastle = [...resultCastle]

        /*
         Xoá các nước đi nguy hiểm
        */

        // Xe

        if (oppo.Castle.del === 0) {
            const { oppoCastle } = CastleOppo(ally, oppo) as {
                oppoCastle: [ChessLocation]
            }

            for (let j = 0; j < resultCastle.length; j++) {
                for (let index = 0; index < oppoCastle.length; index++) {
                    if (resultCastle[j].row === oppoCastle[index].row && resultCastle[j].col === oppoCastle[index].col) {
                        resultCastle.splice(j, 1, '')
                    }
                }
            }
            resultCastle = resultCastle.filter(Boolean)
        }

        // Tịnh

        if (oppo.Bishop.del === 0) {
            const { oppoBishop } = BishopOppo(ally, oppo) as {
                oppoBishop: [ChessLocation]

            }

            for (let j = 0; j < resultCastle.length; j++) {
                for (let index = 0; index < oppoBishop.length; index++) {
                    if (resultCastle[j].row === oppoBishop[index].row && resultCastle[j].col === oppoBishop[index].col) {
                        resultCastle.splice(j, 1, '')
                    }
                }
            }
            resultCastle = resultCastle.filter(Boolean)

        }

        // Mã

        if (oppo.Horse.del === 0) {
            const { oppoHorse } = HorseOppo(ally, oppo) as {
                oppoHorse: [ChessLocation]
            }

            for (let j = 0; j < resultCastle.length; j++) {
                for (let index = 0; index < oppoHorse.length; index++) {
                    if (resultCastle[j].row === oppoHorse[index].row && resultCastle[j].col === oppoHorse[index].col) {
                        resultCastle.splice(j, 1, '')
                    }
                }
            }
            resultCastle = resultCastle.filter(Boolean)

        }

        // Vua

        if (oppo.King.del === 0) {
            const { oppoKing } = KingOppo(ally, oppo) as {
                oppoKing: [ChessLocation]
            }

            for (let j = 0; j < resultCastle.length; j++) {
                for (let index = 0; index < oppoKing.length; index++) {
                    if (resultCastle[j].row === oppoKing[index].row && resultCastle[j].col === oppoKing[index].col) {
                        resultCastle.splice(j, 1, '')
                    }
                }
            }
            resultCastle = resultCastle.filter(Boolean)

        }

        //console.log("result", result)
        if (resultCastle.length > 0) {
            const result = resultCastle[Math.floor((Math.random()) * resultCastle.length)]
            if (!result) {
                console.log(ally, oppo)
                console.log(resultCastle)
                throw new Error(" result castle not received ")
            }
            return { col: result.col, row: result.row }

        } else {
            const result = _resultCastle[Math.floor((Math.random()) * _resultCastle.length)]
            if (!result) {
                console.log(ally, oppo)
                console.log(_resultCastle)
                throw new Error(" _result castle not received ")
            }
            return { col: result.col, row: result.row }
        }

    } catch (error) {

        console.log(" Run Castle: ", error)

    }
}


export function CastleOppo(ally: any, oppo: any) {

    try {
        if (!oppo) { throw new Error(" Oppo not received ") }

        let oppoCastle: ChessLocation[] = []

        let R1 = oppo.Castle.row

        while (R1 <= 7) {

            if (R1 === oppo.Bishop.row && oppo.Castle.col === oppo.Bishop.col && oppo.Bishop.del === 0) {
                break
            }
            if (R1 === oppo.Horse.row && oppo.Castle.col === oppo.Horse.col && oppo.Horse.del === 0) {
                break
            }
            if (R1 === oppo.King.row && oppo.Castle.col === oppo.King.col) {
                break
            }
            if (R1 !== oppo.Castle.row) {

                oppoCastle.push({ col: oppo.Castle.col, row: R1 })
            }

            R1++
        }

        let R5 = oppo.Castle.row

        while (R5 >= 0) {

            if (oppo.Horse.row + 1 === R5 && oppo.Horse.col === oppo.Castle.col && oppo.Horse.del === 0) {
                break
            }
            if (oppo.Bishop.row + 1 === R5 && oppo.Bishop.col === oppo.Castle.col && oppo.Bishop.del === 0) {
                break
            }
            if (oppo.King.row + 1 === R5 && oppo.King.col === oppo.Castle.col) {
                break
            }
            if (R5 !== oppo.Castle.row) {

                oppoCastle.push({ col: oppo.Castle.col, row: R5 })

            }

            R5--

        }

        let C2 = oppo.Castle.col

        while (C2 <= 7) {

            if (oppo.Castle.row === oppo.Horse.row && C2 === oppo.Horse.col && oppo.Horse.del === 0) {
                break
            }
            if (oppo.Castle.row === oppo.Bishop.row && C2 === oppo.Bishop.col && oppo.Bishop.del === 0) {
                break
            }
            if (oppo.Castle.row === oppo.King.row && C2 === oppo.King.col) {
                break
            }
            if (C2 !== oppo.Castle.col) {

                oppoCastle.push({ col: C2, row: oppo.Castle.row })

            }


            C2++
        }

        let C6 = oppo.Castle.col

        while (C6 >= 0) {
            if (oppo.Horse.row === oppo.Castle.row && C6 === oppo.Horse.col && oppo.Horse.del === 0) {
                break
            }
            if (oppo.Bishop.row === oppo.Castle.row && C6 === oppo.Bishop.col && oppo.Bishop.del === 0) {
                break
            }
            if (oppo.King.row === oppo.Castle.row && C6 === oppo.King.col) {
                break
            }
            if (C6 !== oppo.Castle.col) {

                oppoCastle.push({ col: C6, row: oppo.Castle.row })

            }

            C6--
        }

        const result = oppoCastle[Math.floor((Math.random()) * oppoCastle.length)]

        if (!result) {
            console.log(result)
            throw new Error(" result row not received ")
        }

        return { oppoCastle }

    } catch (error) {

        console.log("Run Castle: ", error)

    }
}