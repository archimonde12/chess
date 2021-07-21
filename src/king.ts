import { BishopOppo } from './bishop';
import { CastleOppo } from './castle';
import { HorseOppo } from './horse';
import { ChessLocation } from './resolvers';

export function runKing(ally: any, oppo: any) {

    try {
        if (!ally) { throw new Error(" ally ____________") }
        if (!oppo) { throw new Error(" oppo ____________") }
        /*

        */

        let resultKing: any[] = []

        let moves: any[] = []

        const move = [
            { X: - 1, Y: + 1 },
            { X: - 1, Y: - 1 },
            { X: + 1, Y: + 1 },
            { X: + 1, Y: - 1 },
            { X: - 1, Y: 0 },
            { X: + 1, Y: 0 },
            { X: 0, Y: - 1 },
            { X: 0, Y: + 1 }]

        /*
        Nhận kết quả trả về
        */

        for (let index = 0; index < move.length; index++) {
            if (ally.King.col + move[index].X >= 0 && ally.King.col + move[index].X <= 7 &&
                ally.King.row + move[index].Y >= 0 && ally.King.row + move[index].Y <= 7
            ) {
                moves.push({ col: ally.King.col + move[index].X, row: ally.King.row + move[index].Y })
            }
        }

        /*
        Xoá nước đi trùng đồng minh
        */

        for (let index = 0; index < moves.length; index++) {
            if (moves[index].col === ally.Horse.col && moves[index].row === ally.Horse.row && ally.Horse.del === 0) {
                moves.splice(index, 1, '')
            }
            else if (moves[index].col === ally.Bishop.col && moves[index].row === ally.Bishop.row && ally.Bishop.del === 0) {
                moves.splice(index, 1, '')
            }
            else if (moves[index].col === ally.Castle.col && moves[index].row === ally.Castle.row && ally.Castle.del === 0) {
                moves.splice(index, 1, '')
            }
        }

        resultKing = resultKing.filter(Boolean)

        let _resultKing: any[] = []
        _resultKing = [...moves]
        resultKing = [...moves]

        /*
        Xoá nước đi nguy hiểm
        */

        // Xe

        if (oppo.Castle.del === 0) {
            const { oppoCastle } = CastleOppo(ally, oppo) as {
                oppoCastle: [ChessLocation]
            }

            for (let j = 0; j < resultKing.length; j++) {
                for (let index = 0; index < oppoCastle.length; index++) {
                    if (resultKing[j].col === oppoCastle[index].col && resultKing[j].row === oppoCastle[index].row) {
                        resultKing.splice(j, 1, '')
                    }
                }
            }
            resultKing = resultKing.filter(Boolean)
        }

        // Tịnh

        if (oppo.Bishop.del === 0) {
            const { oppoBishop } = BishopOppo(ally, oppo) as {
                oppoBishop: [ChessLocation]
            }

            for (let j = 0; j < resultKing.length; j++) {
                for (let index = 0; index < oppoBishop.length; index++) {
                    if (resultKing[j].col === oppoBishop[index].col && resultKing[j].row === oppoBishop[index].row) {
                        resultKing.splice(j, 1, '')
                    }
                }
            }
            resultKing = resultKing.filter(Boolean)
        }

        // Mã

        if (oppo.Horse.del === 0) {
            const { oppoHorse } = HorseOppo(ally, oppo) as {
                oppoHorse: [ChessLocation]
            }

            for (let j = 0; j < resultKing.length; j++) {
                for (let index = 0; index < oppoHorse.length; index++) {
                    if (resultKing[j].col === oppoHorse[index].col && resultKing[j].row === oppoHorse[index].row) {
                        resultKing.splice(j, 1, '')
                    }
                }
            }
            resultKing = resultKing.filter(Boolean)
        }

        // Vua

        if (oppo.King.del === 0) {
            const { oppoKing } = KingOppo(ally, oppo) as {
                oppoKing: [ChessLocation]
            }

            for (let j = 0; j < resultKing.length; j++) {
                for (let index = 0; index < oppoKing.length; index++) {
                    if (resultKing[j].col === oppoKing[index].col && resultKing[j].row === oppoKing[index].row) {
                        resultKing.splice(j, 1, '')
                    }
                }
            }
            resultKing = resultKing.filter(Boolean)
        }

        /*
        Tiêu diệt quân cờ của đối thủ
        */

        for (let index = 0; index < resultKing.length; index++) {
            if (resultKing[index].col === oppo.King.col && resultKing[index].row === oppo.King.row && oppo.King.del === 0) {
                return { col: resultKing[index].col, row: resultKing[index].row }
            }
            if (resultKing[index].col === oppo.Castle.col && resultKing[index].row === oppo.Castle.row && oppo.Castle.del === 0) {
                return { col: resultKing[index].col, row: resultKing[index].row }
            }
            if (resultKing[index].col === oppo.Horse.col && resultKing[index].row === oppo.Horse.row && oppo.Horse.del === 0) {
                return { col: resultKing[index].col, row: resultKing[index].row }
            }
            if (resultKing[index].col === oppo.Bishop.col && resultKing[index].row === oppo.Bishop.row && oppo.Bishop.del === 0) {
                return { col: resultKing[index].col, row: resultKing[index].row }
            }
        }

        /*
        Trả về kết quả
        Nếu hết nước đi => Đầu hàng
        */

        if (resultKing.length > 0) {
            const _data = resultKing[Math.floor(Math.random() * resultKing.length)]


            if (!_data) {
                console.log(ally, oppo)
                console.log("err", resultKing)
                throw new Error(" Result Caslte not define ")
            }
            return { col: _data.col, row: _data.row }

        } else {
            const _data = _resultKing[Math.floor(Math.random() * _resultKing.length)]
            console.log("Vua bị vây")

            if (!_data) {
                console.log(ally, oppo)
                console.log("err", _resultKing)
                throw new Error(" Result Caslte not define ")
            }

            return { col: _data.col, row: _data.row }

        }

    } catch (error) {
        console.log(" Run King error ", error)

    }
}

export function KingOppo(ally: any, oppo: any) {

    let oppoKing: any[] = []

    const move = [
        { X: - 1, Y: + 1 },
        { X: - 1, Y: - 1 },
        { X: + 1, Y: + 1 },
        { X: + 1, Y: - 1 },
        { X: - 1, Y: 0 },
        { X: + 1, Y: 0 },
        { X: 0, Y: - 1 },
        { X: 0, Y: + 1 }]

    for (let index = 0; index < move.length; index++) {
        if (oppo.King.col + move[index].X >= 0 && oppo.King.col + move[index].X <= 7 &&
            oppo.King.row + move[index].Y >= 0 && oppo.King.row + move[index].Y <= 7
        ) {
            oppoKing.push({ col: oppo.King.col + move[index].X, row: oppo.King.row + move[index].Y })
        }
    }

    oppoKing = oppoKing.filter(Boolean)

    return { oppoKing }
}