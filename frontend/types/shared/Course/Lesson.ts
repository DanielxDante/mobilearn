// export default interface Lesson {
//     id: number;
//     title: string;
//     contentUrl: string;
//     description: string;
//     completionStatus: boolean;
// }

export default interface Lesson {
  lesson_id: string;
  lesson_name: string;
  lesson_type: string;
  order: number;
  content?: string;
  video_key?: string;
  homework_key?: string;
}
