import Chapter from "@/types/shared/Course/Chapter";

export default interface Course {
    id: number;
    title: string;
    school: string;
    description: string;
    rating: string;
    completionRate: number;
    image: any;
    enrolledCount: number;
    program: string;
    enabled: true | false;
    chapters: Chapter[];
}
