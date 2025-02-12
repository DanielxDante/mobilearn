export default interface Chat {
    chat_id: number;
    chat_name: string;
    chat_picture_url: string;
    is_group: boolean;
    latest_message_content: string | null;
    latest_message_sender: string | null;
    latest_message_timestamp: string | null;
    unread_count: number;
}
