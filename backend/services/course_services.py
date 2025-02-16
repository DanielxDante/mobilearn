from flask import current_app
from sqlalchemy import or_, not_, func

from models.course import Course, STATUS as COURSE_STATUS
from models.channel import Channel
from models.community import Community
from models.channel_community import ChannelCommunity
from models.user import User, STATUS as USER_STATUS
from models.user_channel import UserChannel
from models.enrollment import Enrollment
from models.instructor import Instructor, STATUS as INSTRUCTOR_STATUS
from models.offer import Offer
from models.chapter import Chapter
from models.lesson import Lesson
from models.chapter_lesson import ChapterLesson
from models.lesson_completion import LessonCompletion
from models.review import Review
from utils.recommender_system import get_course_recommender

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
    def get_recommended_courses(session, user_email, channel_id, page, per_page, recommendation_type='random'):
        """ Get recommended courses for the user """
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
            .order_by(Enrollment.enrolled.desc())
            .all()
        )

        if recommendation_type == 'random':
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
        elif recommendation_type == 'content':
            user_latest_enrolled_course_id = user_enrolled_courses[0].id if user_enrolled_courses else None

            if user_latest_enrolled_course_id:
                recommender = get_course_recommender()
                recommended_course_ids = recommender.get_item_to_item_recommendations(
                    user_latest_enrolled_course_id
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
                    .order_by(func.array_position(recommended_course_ids, Course.id))
                )
            else:
                # cold start problem: fallback to random recommendation
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
        elif recommendation_type == 'collaborative':
            recommender = get_course_recommender()
            recommended_course_ids = recommender.get_user_to_item_recommendations(
                user.id
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
                .order_by(func.array_position(recommended_course_ids, Course.id))
            )
        
        paginated_courses = (
            courses
            .order_by(func.random())
            .offset(offset)
            .limit(per_page)
            .all()
        )
        
        return paginated_courses

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
    
    @staticmethod
    def check_course_completion(session, user_id, completed_lesson_id):
        """
        Check if completing this lesson results in completing a course.
        Return all course_ids that the user has completed as a result.
        """
        lesson = Lesson.get_lesson_by_id(session, completed_lesson_id)
        if not lesson:
            raise ValueError("Lesson not found")

        courses = (
            session.query(Course)
            .join(Chapter)
            .join(ChapterLesson)
            .join(Lesson)
            .filter(Lesson.id == completed_lesson_id)
            .all()
        )

        newly_completed_course_ids = []

        for course in courses:
            enrollment = (
                session.query(Enrollment)
                .filter(
                    Enrollment.user_id == user_id,
                    Enrollment.course_id == course.id
                )
                .first()
            )
            if not enrollment:
                continue

            course_lesson_ids = (
                session.query(Lesson.id)
                .join(ChapterLesson)
                .join(Chapter)
                .join(Course)
                .filter(Course.id == course.id)
                .all()
            )
            course_lesson_ids = [lid[0] for lid in course_lesson_ids if lid]

            completed_lesson_ids = (
                session.query(LessonCompletion.lesson_id)
                .filter(
                    LessonCompletion.user_id == user_id,
                    LessonCompletion.lesson_id.in_(course_lesson_ids)
                )
                .all()
            )
            completed_lesson_ids = [lid[0] for lid in completed_lesson_ids if lid]

            if set(course_lesson_ids).issubset(set(completed_lesson_ids)):
                newly_completed_course_ids.append(course.id)
            
        return newly_completed_course_ids
    
    @staticmethod
    def get_course_reviews(session, course_id):
        """ Get course reviews """
        course = Course.get_course_by_id(session, course_id)
        if not course:
            raise ValueError("Course not found")
        
        reviews = (
            session.query(Review)
            .filter(
                Review.course_id == course_id,
                User.status == USER_STATUS.ACTIVE
            )
            .order_by(Review.updated.desc())
            .all()
        )

        return reviews if reviews else []