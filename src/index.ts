import { initApollo } from "./apollo"
import { initBoard } from "./util"

(async () => {
    try {
        await initApollo()
        initBoard()
    } catch (e) {
        throw e
    }
})()