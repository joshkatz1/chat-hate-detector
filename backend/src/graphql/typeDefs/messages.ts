import gql from "graphql-tag";

const typeDefs = gql`

type Message{
    id: String
    sender : User
    body: String
    createdAt: Date
}
type Query{
    messages(conversationId: String): [Message]
}
type Mutation{
    sendMessage(
    id: String
    senderId : String
    body: String
    conversationId: String
    ): Boolean
} 

type Subscription{
    messageSent(conversationId:String): Message
}

`
export default typeDefs