export default interface Message {
    message_id?: number;
    chat_participant_id: number;
    content: string;
    timestamp: string;
}