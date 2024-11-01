import Topic from '@/types/shared/Course/Topic';

export default interface Lecture {
    id: number;
    title: string;
    topics: Topic[]; // Array of topics or videos within the lecture
    completionRate: number; // True if completed, false otherwise
}