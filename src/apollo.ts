import { ApolloServer } from "apollo-server"
import { resolvers } from "./resolvers"
import { typeDefs } from "./typeDefs"


export const initApollo = async () => {
    try {
        const server = new ApolloServer({
            typeDefs,
            resolvers,
            context: (req) => ({
              ...req,
            }),
          });
          const { url } = await server.listen({ port: 5544 })
          console.log(`🚀 Apollo server ready at ${url}`);
    }
    catch (e) {
        throw e
    }
}

