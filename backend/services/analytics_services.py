from sqlalchemy import or_, and_, not_, func, union_all, text

from models.user import User
from models.instructor import Instructor
from models.course import Course, STATUS as COURSE_STATUS
from models.chapter import Chapter
from models.chapter_lesson import ChapterLesson
from models.lesson import Lesson
from models.lesson_completion import LessonCompletion
from models.offer import Offer
from models.enrollment import Enrollment
from models.review import Review
from utils.datetime_utils import check_valid_time_range

class AnalyticsServiceError(Exception):
    pass

class AnalyticsService:
    @staticmethod
    def get_instructor_total_lessons(session, instructor_email):
        """ Get total number of lessons taught by an instructor """
        instructor = Instructor.get_instructor_by_email(session, instructor_email)
        if not instructor:
            raise ValueError("Instructor with the email does not exist.")

        total_lessons = (
            session.query(func.count(Lesson.id))
            .join(ChapterLesson)
            .join(Chapter)
            .join(Course)
            .join(Offer)
            .join(Instructor)
            .filter(
                Instructor.email == instructor_email,
                Course.status == COURSE_STATUS.ACTIVE
            )
            .scalar()
        ) or 0
        return total_lessons
    
    @staticmethod
    def get_instructor_total_enrollments(session, instructor_email, time_range="month"):
        """ Get total number of enrollments in courses taught by an instructor """
        instructor = Instructor.get_instructor_by_email(session, instructor_email)
        if not instructor:
            raise ValueError("Instructor with the email does not exist.")
        
        if not check_valid_time_range(time_range):
            raise ValueError("Invalid time range.")
        
        total_enrollments = (
            session.query(func.count(func.distinct(Enrollment.user_id, Enrollment.course_id)))
            .join(Course)
            .join(Offer)
            .join(Instructor)
            .filter(
                Instructor.email == instructor_email,
                Course.status == COURSE_STATUS.ACTIVE
            )
            .scalar()
        ) or 0

        enrollments_in_time_range = (
            session.query(func.count(func.distinct(Enrollment.user_id, Enrollment.course_id)))
            .join(Course)
            .join(Offer)
            .join(Instructor)
            .filter(
                Instructor.email == instructor_email,
                Course.status == COURSE_STATUS.ACTIVE,
                Enrollment.enrolled >= func.now() - text(f"interval '1 {time_range}'")
            )
            .scalar()
        )

        percentage_change = round((enrollments_in_time_range / total_enrollments * 100 if total_enrollments else 0), 2)

        return (total_enrollments, percentage_change)
    
    @staticmethod
    def get_instructor_total_reviews(session, instructor_email, time_range="month"):
        """ Get total number of reviews in courses taught by an instructor """
        instructor = Instructor.get_instructor_by_email(session, instructor_email)
        if not instructor:
            raise ValueError("Instructor with the email does not exist.")
        
        if not check_valid_time_range(time_range):
            raise ValueError("Invalid time range.")
        
        total_reviews = (
            session.query(func.count(func.distinct(Review.user_id, Review.course_id)))
            .join(Course)
            .join(Offer)
            .join(Instructor)
            .filter(
                Instructor.email == instructor_email,
                Course.status == COURSE_STATUS.ACTIVE
            )
            .scalar()
        ) or 0

        reviews_in_time_range = (
            session.query(func.count(func.distinct(Review.user_id, Review.course_id)))
            .join(Course)
            .join(Offer)
            .join(Instructor)
            .filter(
                Instructor.email == instructor_email,
                Course.status == COURSE_STATUS.ACTIVE,
                Review.created >= func.now() - text(f"interval '1 {time_range}'")
            )
            .scalar()
        )

        percentage_change = round((reviews_in_time_range / total_reviews * 100 if total_reviews else 0), 2)

        return (total_reviews, percentage_change)
    
    @staticmethod
    def get_instructor_average_course_progress(session, instructor_email, time_range="month"):
        """ Get average course completion rate in courses taught by an instructor """
        instructor = Instructor.get_instructor_by_email(session, instructor_email)
        if not instructor:
            raise ValueError("Instructor with the email does not exist.")
        
        if not check_valid_time_range(time_range):
            raise ValueError("Invalid time range.")
        
        instructor_enrollments = (
            session.query(Enrollment)
            .join(Course)
            .join(Offer)
            .join(Instructor)
            .filter(
                Instructor.email == instructor_email,
                Course.status == COURSE_STATUS.ACTIVE
            )
            .all()
        )

        total_progress = 0
        added_progress_in_time_range = 0
        for enrollment in instructor_enrollments:
            total_lessons = (
                session.query(func.count(Lesson.id))
                .join(ChapterLesson)
                .join(Chapter)
                .join(Course)
                .filter(
                    Course.id == enrollment.course_id
                )
                .scalar()
            ) or 0

            completed_lessons = (
                session.query(func.count(func.distinct(LessonCompletion.user_id, LessonCompletion.lesson_id)))
                .join(Lesson)
                .join(ChapterLesson)
                .join(Chapter)
                .join(Course)
                .filter(
                    Course.id == enrollment.course_id,
                    LessonCompletion.user_id == enrollment.user_id
                )
                .scalar()
            ) or 0

            completed_lessons_in_time_range = (
                session.query(func.count(func.distinct(LessonCompletion.user_id, LessonCompletion.lesson_id)))
                .join(Lesson)
                .join(ChapterLesson)
                .join(Chapter)
                .join(Course)
                .filter(
                    Course.id == enrollment.course_id,
                    LessonCompletion.user_id == enrollment.user_id,
                    LessonCompletion.completed >= func.now() - text(f"interval '1 {time_range}'")
                )
                .scalar()
            ) or 0

            total_progress += round((completed_lessons / total_lessons * 100 if total_lessons else 0), 2)
            added_progress_in_time_range += round((completed_lessons_in_time_range / total_lessons * 100 if total_lessons else 0), 2)

        average_total_progress = round((total_progress / len(instructor_enrollments) if len(instructor_enrollments) else 0), 2)
        average_added_progress_in_time_range = round((added_progress_in_time_range / len(instructor_enrollments) if len(instructor_enrollments) else 0), 2)

        percentage_change = round((average_added_progress_in_time_range / average_total_progress * 100 if average_total_progress else 0), 2)

        return (average_total_progress, percentage_change)