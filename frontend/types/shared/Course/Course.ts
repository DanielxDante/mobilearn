import Chapter from "@/types/shared/Course/Chapter";
import Instructor from "./Instructor";

// export default interface Course {
//     id: number;
//     title: string;
//     school: string;
//     description: string;
//     rating: string;
//     paid: boolean;
//     completionRate: number;
//     image: any;
//     enrolledCount: number;
//     program: string;
//     enabled: true | false;
//     chapters: Chapter[];
// }

export default interface Course {
  course_id: number; // Matches "course_id"
  community_id: number; // Matches "community_id"
  course_image: string; // Matches "course_image"
  course_name: string; // Matches "course_name"
  community_name: string; // Matches "community_name"
  description: string; // Matches "description"
  instructors: Instructor[]; // Matches "instructors"
  chapters: Chapter[]; // Matches "chapters"
  rating: string;
  enrollment_count: number; // Matches "enrollment_count"
}
