import Lesson from "@/types/shared/Course/Lesson";

// export default interface Chapter {
//     id: number;
//     title: string;
//     lessons: Lesson[]; // Array of lectures in the chapter
//     completionRate: number; // Optional, to track progress within the chapter
// }

export default interface Chapter {
  chapter_id: string;
  chapter_title: string;
  order: number;
  lessons: Lesson[];
  completionRate: number; // Optional, to track progress within the chapter
}
