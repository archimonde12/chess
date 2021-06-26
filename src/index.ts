import { initApollo } from "./apollo"

(async () => {
    try{
        await initApollo()
    }catch(e){
        throw e
    }
})()