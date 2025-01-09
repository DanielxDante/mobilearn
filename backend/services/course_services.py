from sqlalchemy import or_, not_, func

from models.course import Course, STATUS as COURSE_STATUS
from models.channel import Channel
from models.community import Community
from models.channel_community import ChannelCommunity
from models.user import User
from models.user_channel import UserChannel
from models.enrollment import Enrollment
from models.instructor import Instructor, STATUS as INSTRUCTOR_STATUS
from models.offer import Offer
from models.chapter import Chapter
from models.lesson import Lesson
from models.chapter_lesson import ChapterLesson
from models.lesson_completion import LessonCompletion

class CourseServiceError(Exception):
    pass

class CourseService:
    @staticmethod
    def get_channel_courses(session, channel_id, search_term, page, per_page):
        """ Get courses that are in the channel """
        channel = Channel.get_channel_by_id(session, channel_id)
        if not channel:
            raise ValueError("Channel not found")

        offset = (page - 1) * per_page

        courses = (
            session.query(Course)
            .join(Community)
            .join(ChannelCommunity)
            .join(Channel)
            .join(Offer)
            .join(Instructor)
            .filter(
                Channel.id == channel_id,
                Course.status == COURSE_STATUS.ACTIVE
            )
            .distinct()
        )

        if (search_term):
            search_filters = [
                Course.name.ilike(f'%{search_term}%'),
                Community.name.ilike(f'%{search_term}%'),
                Instructor.name.ilike(f'%{search_term}%'),
            ]

            courses = courses.filter(or_(*search_filters))
        
        paginated_courses = (
            courses
            .order_by(Course.created.desc())
            .offset(offset)
            .limit(per_page)
            .all()
        )
        
        return paginated_courses

    @staticmethod
    def get_course_instructors(session, course_id):
        """ Get instructors that are offering the course """
        course = Course.get_course_by_id(session, course_id)
        if not course:
            raise ValueError("Course not found")
        
        instructors = (
            session.query(Instructor)
            .join(Offer)
            .filter(
                Offer.course_id == course_id,
                Instructor.status == INSTRUCTOR_STATUS.ACTIVE
            )
            .order_by(Instructor.created.desc())
            .all()
        )
        
        return instructors
    
    @staticmethod
    def get_recommended_courses(session, user_email, channel_id, page, per_page):
        """ Get recommended courses for the user """
        # TODO: Implement a proper recommendation model and infer from it
        user = User.get_user_by_email(session, user_email)
        if not user:
            raise ValueError("User not found")
        
        channel = Channel.get_channel_by_id(session, channel_id)
        if not channel:
            raise ValueError("Channel not found")
        
        offset = (page - 1) * per_page

        user_enrolled_courses = (
            session.query(Course)
            .join(Enrollment)
            .join(User)
            .join(UserChannel)
            .join(Channel)
            .filter(
                Enrollment.user_id == user.id,
                Channel.id == channel_id,
                Course.status == COURSE_STATUS.ACTIVE
            )
        )

        courses = (
            session.query(Course)
            .join(Community)
            .join(ChannelCommunity)
            .join(Channel)
            .filter(
                Channel.id == channel_id,
                not_(Course.id.in_([course.id for course in user_enrolled_courses])),
                Course.status == COURSE_STATUS.ACTIVE,
            )
        )
        
        paginated_courses = (
            courses
            .order_by(func.random())
            .offset(offset)
            .limit(per_page)
            .all()
        )
        
        return paginated_courses

    # @staticmethod
    # def attach_instructor

    # @staticmethod
    # def detach_instructor

    @staticmethod
    def calculate_course_progress(session, user_email, course_id):
        """ Calculate course progress for the user """
        user = User.get_user_by_email(session, user_email)
        if not user:
            raise ValueError("User not found")
        
        course = Course.get_course_by_id(session, course_id)
        if not course:
            raise ValueError("Course not found")

        total_lessons = (
            session.query(
                Course.id.label('course_id'),
                func.count(Lesson.id).label('total_lessons')
            )
            .join(Chapter)
            .join(ChapterLesson)
            .join(Lesson)
            .group_by(Course.id)
            .subquery()
        )

        # Get completed lessons per course for the user
        completed_lessons = (
            session.query(
                Course.id.label('course_id'),
                func.count(LessonCompletion.lesson_id).label('completed_lessons')
            )
            .join(Chapter)
            .join(ChapterLesson)
            .join(Lesson)
            .join(LessonCompletion, 
                (LessonCompletion.lesson_id == Lesson.id) & 
                (LessonCompletion.user_id == user.id))
            .group_by(Course.id)
            .subquery()
        )

        # Calculate progress percentage
        progress_query = (
            session.query(
                Course.id,
                Course.name,
                func.coalesce(completed_lessons.c.completed_lessons, 0).label('completed'),
                total_lessons.c.total_lessons.label('total'),
                (func.coalesce(completed_lessons.c.completed_lessons, 0) * 100.0 / 
                total_lessons.c.total_lessons).label('progress')
            )
            .join(Enrollment, 
                (Enrollment.course_id == Course.id) & 
                (Enrollment.user_id == user.id))
            .join(total_lessons, total_lessons.c.course_id == Course.id)
            .outerjoin(completed_lessons, completed_lessons.c.course_id == Course.id)
            .filter(
                Course.status == COURSE_STATUS.ACTIVE,
                Course.id == course_id
            )
            .first()
        )

        return progress_query.progress if progress_query else 0.0
    