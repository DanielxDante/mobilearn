from sqlalchemy import or_, not_, func

from models.user import User
from models.course import Course
from models.enrollment import Enrollment
from models.lesson import Lesson
from models.lesson_completion import LessonCompletion
from models.homework_submission import HomeworkSubmission

class LessonServiceError(Exception):
    pass

class LessonService:
    @staticmethod
    def complete_lesson(session, user_email, course_id, lesson_id):
        """ Add a lesson completion record by a user """
        user = User.get_user_by_email(session, user_email)
        if not user:
            raise ValueError("User not found")
        
        course = Course.get_course_by_id(session, course_id)
        if not course:
            raise ValueError("Course not found")

        lesson = Lesson.get_lesson_by_id(session, lesson_id)
        if not lesson:
            raise ValueError("Lesson not found")

        enrollment = Enrollment.get_enrollment_by_user_and_course(session, user.id, course_id)
        if not enrollment:
            raise ValueError("User not enrolled in course")

        lesson_completion = LessonCompletion(
            enrollment_id=enrollment.id,
            lesson_id=lesson_id
        )
        session.add(lesson_completion)
        session.flush()

        return lesson_completion
    
    @staticmethod
    def get_homework_submission(session, user_email, course_id, lesson_id):
        """ Get homework submission by a user """
        user = User.get_user_by_email(session, user_email)
        if not user:
            raise ValueError("User not found")
        
        course = Course.get_course_by_id(session, course_id)
        if not course:
            raise ValueError("Course not found")

        lesson = Lesson.get_lesson_by_id(session, lesson_id)
        if not lesson:
            raise ValueError("Lesson not found")

        enrollment = Enrollment.get_enrollment_by_user_and_course(session, user.id, course_id)
        if not enrollment:
            raise ValueError("User not enrolled in course")
        
        homework_submission = (
            session.query(HomeworkSubmission)
            .filter(
                HomeworkSubmission.enrollment_id == enrollment.id,
                HomeworkSubmission.homework_lesson_id == lesson_id
            )
            .first()
        )

        return homework_submission 
    
    @staticmethod
    def submit_homework(session, user_email, course_id, lesson_id, homework_submission_file_url):
        """ Submit homework by a user """
        user = User.get_user_by_email(session, user_email)
        if not user:
            raise ValueError("User not found")
        
        course = Course.get_course_by_id(session, course_id)
        if not course:
            raise ValueError("Course not found")

        lesson = Lesson.get_lesson_by_id(session, lesson_id)
        if not lesson:
            raise ValueError("Lesson not found")

        enrollment = Enrollment.get_enrollment_by_user_and_course(session, user.id, course_id)
        if not enrollment:
            raise ValueError("User not enrolled in course")
        
        homework_submission = (
            session.query(HomeworkSubmission)
            .filter(
                HomeworkSubmission.enrollment_id == enrollment.id,
                HomeworkSubmission.homework_lesson_id == lesson_id
            )
            .first()
        )

        if homework_submission:
            # Update the existing homework submission
            homework_submission.homework_submission_file_url = homework_submission_file_url
            session.flush()
        else:
            # Create a new homework submission
            new_homework_submission = HomeworkSubmission(
                enrollment_id=enrollment.id,
                homework_lesson_id=lesson_id,
                homework_submission_file_url=homework_submission_file_url
            )
            session.add(new_homework_submission)
            session.flush()

            # Mark the lesson as completed once homework is submitted
            LessonService.complete_lesson(session, user_email, course_id, lesson_id)

        return homework_submission
    
