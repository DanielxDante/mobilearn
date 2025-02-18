export default interface Message {
    message: string;
    incoming: boolean; // if incoming==false, then msg is outgoing
    date: string;
}