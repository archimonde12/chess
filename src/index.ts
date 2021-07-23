import { initApollo } from "./apollo";
import { connectMongo, requestLogs } from "./mongo";
import { initBoard } from "./util";

(async () => {
  try {
    await initApollo();
    initBoard();
    await connectMongo();
    const delRes = await requestLogs.deleteMany({})
    console.log(`${delRes.deletedCount} was deleted`)
  } catch (e) {
    throw e;
  }
})();
