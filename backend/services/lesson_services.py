from sqlalchemy import or_, not_, func

from models.user import User
from models.lesson import Lesson
from models.course import Course
from models.homework_submission import HomeworkSubmission
from services.course_services import CourseService
from services.notification_services import NotificationService

class LessonServiceError(Exception):
    pass

class LessonService: 
    @staticmethod
    def complete_lesson(session, user_email, lesson_id):
        """ Add a lesson completion record by a user """
        user = User.get_user_by_email(session, user_email)
        if not user:
            raise LessonServiceError("User not found")
        
        lesson = Lesson.get_lesson_by_id(session, lesson_id)
        if not lesson:
            raise LessonServiceError("Lesson not found")
        
        if lesson in user.lesson_completions:
            print("Lesson already completed")
            return
        
        user.lesson_completions.append(lesson)
        session.flush()

        # check if completing this lesson results in completing a course
        newly_completed_course_ids = CourseService.check_course_completion(
            session,
            user.id,
            lesson_id
        )
        
        for course_id in newly_completed_course_ids:
            course = Course.get_course_by_id(session, course_id)
            NotificationService.add_notification(
                session,
                title="Congratulations! 🎉",
                body=f"You have completed all lessons in {course.name}. Explore more courses by {course.community.name}.",
                notification_type="course",
                recipient_id=user.id,
                recipient_type='user'
            )

    @staticmethod
    def get_homework_submission(session, user_email, homework_lesson_id):
        """ Get homework submission by a user """
        user = User.get_user_by_email(session, user_email)
        if not user:
            raise LessonServiceError("User not found")
        
        lesson = Lesson.get_lesson_by_id(session, homework_lesson_id)
        if not lesson:
            raise LessonServiceError("Lesson not found")
        
        homework_submission = (
            session.query(HomeworkSubmission)
            .filter(
                HomeworkSubmission.user_id == user.id,
                HomeworkSubmission.homework_lesson_id == homework_lesson_id
            )
            .first()
        )

        return homework_submission if homework_submission else None
        
    @staticmethod
    def submit_homework(session, user_email, lesson_id, homework_submission_file_url):
        """ Submit homework by a user """
        user = User.get_user_by_email(session, user_email)
        if not user:
            raise LessonServiceError("User not found")
        
        lesson = Lesson.get_lesson_by_id(session, lesson_id)
        if not lesson:
            raise LessonServiceError("Lesson not found")
        
        homework_submission = (
            session.query(HomeworkSubmission)
            .filter(
                HomeworkSubmission.user_id == user.id,
                HomeworkSubmission.homework_lesson_id == lesson_id
            )
            .first()
        )
        if homework_submission:
            homework_submission.homework_submission_file_url = homework_submission_file_url
        else:
            homework_submission = HomeworkSubmission(
                user_id=user.id,
                homework_lesson_id=lesson.id,
                homework_submission_file_url=homework_submission_file_url
            )
            session.add(homework_submission)
        session.flush()

        # and also complete the lesson
        LessonService.complete_lesson(session, user_email, lesson_id)
    
