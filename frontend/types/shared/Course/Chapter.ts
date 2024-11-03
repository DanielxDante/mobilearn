import Lecture from "@/types/shared/Course/Lecture";

export default interface Chapter {
    id: number;
    title: string;
    lectures: Lecture[]; // Array of lectures in the chapter
    completionRate: number; // Optional, to track progress within the chapter
}