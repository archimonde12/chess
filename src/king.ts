export function runKing(ally: any, oppo: any) {

    /*

    Vua di chuyển khỏi bàn cờ ok

    Vua di chuyển bình thường. Không có lỗi ok

    Vua không di chuyển vào đồng đội ok

    */

    let resultKing: any[] = []

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
        if (ally.King.col + move[index].X >= 0 && ally.King.col + move[index].X <= 7 &&
            ally.King.row + move[index].Y >= 0 && ally.King.row + move[index].Y <= 7
        ) {
            resultKing.push({ col: ally.King.col + move[index].X, row: ally.King.row + move[index].Y })
        }
    }

    resultKing = resultKing.filter(Boolean)

    const _data = resultKing[Math.floor(Math.random() * resultKing.length)]
    if (_data.col !== ally.Bishop.col && _data.row !== ally.Bishop.row && ally.Bishop.del === 0
        || _data.col !== ally.Castle.col && _data.row !== ally.Castle.row && ally.Castle.del === 0) {
        console.log(_data)
        return { col: _data.col, row: _data.row }

    } else {
        return runKing(ally, oppo)
    }
}

export function KingOppo(ally: any, oppo: any) {

    let resultKing: any[] = []

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
            resultKing.push({ col: oppo.King.col + move[index].X, row: oppo.King.row + move[index].Y })
        }
    }

    resultKing = resultKing.filter(Boolean)

    const _data = resultKing[Math.floor((Math.random()) * resultKing.length)]
    if (_data.col !== oppo.Bishop.col && _data.row !== oppo.Bishop.row && oppo.Bishop.del === 0
        || _data.col !== oppo.Castle.col && _data.row !== oppo.Castle.row && oppo.Castle.del === 0) {
        console.log(_data)
        return { col: _data.col, row: _data.row }

    } else {
        return runKing(ally, oppo)
    }
}