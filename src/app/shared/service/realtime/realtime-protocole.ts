export const UNKNOW_SENDER="unknow";
export const UNKNOW_RECEIVER="unknow";

export enum RealTimeInitMessageType
{
 SEND_MESSAGE,   
 NEW_CONNECTION="connect",
 LOGGIN="loggin",
 LOGOUT="logout",
 DISCONNECT="disconnect"
}

export enum RealTimeInitErrorType
{
    SUCCESS,
    USER_ALREADY_EXIST,
    INVALID_USER_ID,
    INVALID_USER_TOKEN,
    UNKNOW_ERROR
}

export enum RealTimeChatMessageType 
{
    SEND_MESSAGE="send_message",
    GET_DISCUSSIONS="get_discussions",
    GET_MESSAGE_OF_DISCUSION="get_message_discussion",
    MARK_MESSAGE_AS_READ="mark_message_as_read"
}

export enum RealTimeChatError
{
    MESSAGE_NOT_EXIST,   
}

export interface RealTimeMessage{
    senderID:string,
    receiverID:string,
    data?:any,
    type:RealTimeMessageType,
    error?:RealTimeErrorType
}


export type RealTimeMessageType = RealTimeInitMessageType | RealTimeChatMessageType;
export type RealTimeErrorType = RealTimeInitErrorType | RealTimeChatError