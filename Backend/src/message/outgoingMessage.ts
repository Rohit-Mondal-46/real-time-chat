export enum OutgoingSupportedMessage{
    AddChat = "ADD_CHAT",
    UpdateChat = "UPDATE_CHAT",
}

type MessagePayload = {
    roomId: string,
    message: string,
    name: string,
    upvote: number,
    chatId: string
}

export type OutGoingMessage = {
    type: OutgoingSupportedMessage.AddChat,
    payload: MessagePayload,
} | {
    type: OutgoingSupportedMessage.UpdateChat,
    payload: Partial<MessagePayload>,
}