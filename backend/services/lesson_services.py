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
        pass
    
    @staticmethod
    def get_homework_submission(session, user_email, course_id, lesson_id):
        """ Get homework submission by a user """
        pass
    
    @staticmethod
    def submit_homework(session, user_email, course_id, lesson_id, homework_submission_file_url):
        """ Submit homework by a user """
        pass
    
