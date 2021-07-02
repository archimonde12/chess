import { initApollo } from "./apollo";
import { connectMongo } from "./mongo";
import { initBoard } from "./util";

(async () => {
  try {
    await initApollo();
    initBoard();
    await connectMongo();
  } catch (e) {
    throw e;
  }
})();
