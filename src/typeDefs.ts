import { gql } from "apollo-server"

export const typeDefs = gql`

    type Square{
        col: Int
        row: Int
        value: String
    }
    
    input SquareInput{
        col:Int
        row:Int
    }

    input SquareInitInput{
        col:Int
        row:Int
        value:String
    }

    type Query{
        boardGet: [Square]
    }

    type Mutation{
        chessMove(before:SquareInput!,after:SquareInput!):String
        boardInit(init:[SquareInitInput]):[Square]
        start:String
    }

    type Subscription{
        boardSub:[Square]
    }
`
