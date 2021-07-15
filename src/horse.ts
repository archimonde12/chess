import { ChessLocation } from "./resolvers"
import { BishopOppo } from './bishop';
import { CastleOppo } from './castle';

export function runHorse(ally: any, oppo: any) {

    try {
        
        /*

    Xe di chuyển khỏi bàn cờ ok 

    Xe di chuyển bình thường. Không có lỗi

    Xe không di chuyển vào đồng đội

    */

        let resultHorse: any[] = []

        const move = [{ X: - 2, Y: - 1 },
        { X: - 1, Y: - 2 },
        { X: + 1, Y: - 2 },
        { X: + 2, Y: - 1 },
        { X: + 2, Y: + 1 },
        { X: - 1, Y: + 2 },
        { X: - 1, Y: + 2 },
        { X: - 2, Y: + 1 }]

        for (let index = 0; index < move.length; index++) {
            if (ally.Horse.col + move[index].X === oppo.King.col && ally.Horse.row + move[index].Y === oppo.King.row) {
                return {
                    col: ally.Horse.col + move[index].X, row: ally.Horse.row + move[index].Y
                }
            }
        }
        
        for (let index = 0; index < move.length; index++) {
            if (ally.Horse.col + move[index].X >= 0 && ally.Horse.col + move[index].X <= 7 &&
                ally.Horse.row + move[index].Y >= 0 && ally.Horse.row + move[index].Y <= 7
            ) {
                resultHorse.push({ col: ally.Horse.col + move[index].X, row: ally.Horse.row + move[index].Y })
            }
        }

        /*
   
       Xoá nước đi trùng đồng minh
   
       */

        for (let index = 0; index < resultHorse.length; index++) {
            if (resultHorse[index].col === ally.King.col && resultHorse[index].row === ally.King.row && ally.King.del === 0
                || resultHorse[index].col === ally.Bishop.col && resultHorse[index].row === ally.Bishop.row && ally.Bishop.del === 0
                || resultHorse[index].col === ally.Castle.col && resultHorse[index].row === ally.Castle.row && ally.Castle.del === 0) {
                resultHorse.splice(index, 1, '')
            }

        }

        resultHorse = resultHorse.filter(Boolean)

        /*
    
        Xoá nước đi nguy hiểm
    
        */

        // Xe

        if (oppo.Castle.del === 0) {
            const { oppoCastle } = CastleOppo(ally, oppo) as {
                oppoCastle: [ChessLocation]

            }

            for (let j = 0; j < resultHorse.length; j++) {
                for (let index = 0; index < oppoCastle.length; index++) {
                    if (resultHorse[j].row === oppoCastle[index].row && resultHorse[j].col === oppoCastle[index].col) {
                      
                        resultHorse.splice(j, 1, '')
                    }
                }
            }

            resultHorse = resultHorse.filter(Boolean)

        }

        // Tịnh

        if (oppo.Bishop.del === 0) {
            const { oppoBishop } = BishopOppo(ally, oppo) as {
                oppoBishop: [ChessLocation]

            }

            for (let j = 0; j < resultHorse.length; j++) {
                for (let index = 0; index < oppoBishop.length; index++) {
                    if (resultHorse[j].row === oppoBishop[index].row && resultHorse[j].col === oppoBishop[index].col) {
                        
                        resultHorse.splice(j, 1, '')
                    }
                }
            }
        }

        // Mã

        if (oppo.Horse.del === 0) {
            const { oppoHorse } = HorseOppo(ally, oppo) as {
                oppoHorse: [ChessLocation]
            }

            for (let j = 0; j < resultHorse.length; j++) {
                for (let index = 0; index < oppoHorse.length; index++) {
                    if (resultHorse[j].row === oppoHorse[index].row && resultHorse[j].col === oppoHorse[index].col) {
                        console.log(resultHorse[j])
                        resultHorse.splice(j, 1, '')
                    }
                }
            }
        }

        resultHorse = resultHorse.filter(Boolean)

        /*
        Tiêu diệt quân cờ của đối thủ

        */

        for (let index = 0; index < resultHorse.length; index++) {
            if (resultHorse[index].col === oppo.King.col && resultHorse[index].row === oppo.King.row && oppo.King.del === 0  ) {
                return { col : resultHorse[index].col , row:resultHorse[index].row  } 
            }
            if (resultHorse[index].col === oppo.Castle.col && resultHorse[index].row === oppo.Castle.row && oppo.Castle.del === 0  ) {
                return { col : resultHorse[index].col , row:resultHorse[index].row  } 
            }
            if (resultHorse[index].col === oppo.Horse.col && resultHorse[index].row === oppo.Horse.row && oppo.Horse.del === 0  ) {
                return { col : resultHorse[index].col , row:resultHorse[index].row  } 
            }
            if (resultHorse[index].col === oppo.Bishop.col && resultHorse[index].row === oppo.Bishop.row && oppo.Bishop.del === 0  ) {
                return { col : resultHorse[index].col , row:resultHorse[index].row  } 
            }
            
        }

        
        const _data = resultHorse[Math.floor(Math.random() * resultHorse.length)]

        if (!_data) {
            console.log("err", resultHorse)
            throw new Error(" Result Caslte not define ")
        }

        return { col: _data.col, row: _data.row }

    } catch (error) {
        console.log(error)

    }

}

export function HorseOppo(ally: any, oppo: any) {


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
        if (oppo.Horse.col + move[index].X >= 0 && oppo.Horse.col + move[index].X <= 7 &&
            oppo.Horse.row + move[index].Y >= 0 && oppo.Horse.row + move[index].Y <= 7
        ) {
            oppoHorse.push({ col: oppo.Horse.col + move[index].X, row: oppo.Horse.row + move[index].Y })
        }
    }


    oppoHorse = oppoHorse.filter(Boolean)


    return { oppoHorse }


}