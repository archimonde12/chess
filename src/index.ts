import { initApollo } from "./apollo"
import { connectMongo } from "./mongo"
import { initBoard } from "./util"

(async () => {
    try{
        await initApollo()
        await connectMongo()
        initBoard()
        
    }catch(e){
        throw e
    }
})()



