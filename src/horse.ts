export function runHorse(ally: any, oppo: any) {

    try {

        let resultHorse: any[] = []

        const move = [
            { X: - 2, Y: - 1 },
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

        

        resultHorse = resultHorse.filter(Boolean)

        const _data = resultHorse[Math.floor((Math.random()) * resultHorse.length)]
        if (_data.col !== ally.Bishop.col && _data.row !== ally.Bishop.row && ally.Bishop.del === 0
            || _data.col !== ally.Castle.col && _data.row !== ally.Castle.row && ally.Castle.del === 0) {
            console.log(_data)
            return { col: _data.col, row: _data.row }

        } else {
            return runHorse(ally, oppo)
        }

    } catch (error) {
        console.log(error)
    }
}

export function HorseOppo(ally: any, oppo: any) {

    try {

        console.log("aaaaaaaa")

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
            if (oppo.Horse.col + move[index].X >= 0 && oppo.Horse.col + move[index].X <= 7 &&
                oppo.Horse.row + move[index].Y >= 0 && oppo.Horse.row + move[index].Y <= 7
            ) {
                resultHorse.push({ col: oppo.Horse.col + move[index].X, row: oppo.Horse.row + move[index].Y })
            }
        }

        resultHorse = resultHorse.filter(Boolean)

        const _data = resultHorse[Math.floor((Math.random()) * resultHorse.length)]
        if (_data.col !== oppo.Bishop.col && _data.row !== oppo.Bishop.row && oppo.Bishop.del === 0
            || _data.col !== oppo.Castle.col && _data.row !== oppo.Castle.row && oppo.Castle.del === 0) {
            console.log(_data)
            return { col: _data.col, row: _data.row }

        } else {
            return runHorse(ally, oppo)
        }
    } catch (error) {
        console.log(error)
    }
}