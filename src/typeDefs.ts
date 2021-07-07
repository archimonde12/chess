import { gql } from "apollo-server";

export const typeDefs = gql`
  type Square {
    col: Int
    row: Int
    value: String
  }

  type GetBoardResponse{
    board:[Square]
    status:Int
    isWin:String
  }

  input SquareInput {
    col: Int
    row: Int
  }

  input SquareInitInput {
    col: Int
    row: Int
    value: String
  }

  type Query {
    boardGet: [Square]
    getBoard: [GetBoardResponse]
  }

  type Mutation {
    start: String
    chessMove(before: SquareInput!, after: SquareInput!): String
    boardInit(init: [SquareInitInput]): [Square]
  }

  type Subscription {
    boardSub: [Square]
  }
`;
