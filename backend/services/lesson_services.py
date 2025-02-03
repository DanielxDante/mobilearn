from sqlalchemy import or_, not_, func

from models.user import User
from models.lesson import Lesson
from models.homework_submission import HomeworkSubmission

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

        # TODO: check if all lessons in the course are completed
        # send notification if it is
    
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
    
