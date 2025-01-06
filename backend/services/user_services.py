from sqlalchemy import func, not_, or_

from models.user import User, STATUS as USER_STATUS
from models.channel import Channel, STATUS as CHANNEL_STATUS
from models.community import Community
from models.channel_community import ChannelCommunity
from models.course import Course, STATUS as COURSE_STATUS
from models.user_channel import UserChannel
from models.enrollment import Enrollment
from models.review import Review
from models.favourite import Favourite

class UserServiceError(Exception):
    pass

class UserService:
    @staticmethod
    def search_users(session, searcher_email, search_term, page, per_page):
        """ Search for users """
        searcher = User.get_user_by_email(session, searcher_email)
        if not searcher:
            raise ValueError("User not found")
        
        offset = (page - 1) * per_page

        users = (
            session.query(User)
            .filter(
                User.id != searcher.id,
                User.status == USER_STATUS.ACTIVE,
            )
        )

        if (search_term):
            search_filters = [
                User.email.ilike(f'%{search_term}%'),
                User.name.ilike(f'%{search_term}%'),
            ]

            users = users.filter(or_(*search_filters))
        
        paginated_users = (
            users
            .order_by(User.name.asc())
            .offset(offset)
            .limit(per_page)
            .all()
        )
        
        return paginated_users

    @staticmethod
    def get_user_channels(session, user_email):
        """ Get all active channels that a user has been invited to """
        user = User.get_user_by_email(session, user_email)
        if not user:
            raise ValueError("User not found")
        
        channels = (
            session.query(Channel)
            .join(UserChannel)
            .filter(
                UserChannel.user_id == user.id,
                Channel.status == CHANNEL_STATUS.ACTIVE
            )
            .order_by(Channel.created.desc())
            .all()
        )

        return channels
    
    @staticmethod
    def get_user_enrolled_courses(session, user_email, channel_id, page, per_page):
        """ Get all courses that a user is enrolled in """
        user = User.get_user_by_email(session, user_email)
        if not user:
            raise ValueError("User not found")
        
        channel = Channel.get_channel_by_id(session, channel_id)
        if not channel:
            raise ValueError("Channel not found")
        
        offset = (page - 1) * per_page
        
        courses = (
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

        paginated_courses = (
            courses
            .order_by(Enrollment.enrolled.desc())
            .offset(offset)
            .limit(per_page)
            .all()
        )
        
        return paginated_courses
    
    @staticmethod
    def get_top_enrolled_courses(session, user_email, channel_id, page, per_page):
        """ Get top enrolled courses """
        user = User.get_user_by_email(session, user_email)
        if not user:
            raise ValueError("User not found")
        
        channel = Channel.get_channel_by_id(session, channel_id)
        if not channel:
            raise ValueError("Channel not found")
        
        offset = (page - 1) * per_page
        
        courses = (
            session.query(Course)
            .join(Enrollment)
            .join(User)
            .join(UserChannel)
            .join(Channel)
            .filter(
                Enrollment.user_id != user.id,
                Channel.id == channel_id,
                Course.status == COURSE_STATUS.ACTIVE
            )
        )

        paginated_courses = (
            courses
            .group_by(Course.id)
            .order_by(func.count(Enrollment.user_id).desc())
            .offset(offset)
            .limit(per_page)
            .all()
        )

        # Fallback to top rated courses if there are not enough enrollment data
        if len(paginated_courses) < 5:
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
                .all()
            )

            fallback_courses = (
                session.query(Course)
                .join(Community)
                .join(ChannelCommunity)
                .join(Channel)
                .filter(
                    Channel.id == channel_id,
                    not_(Course.id.in_([course.id for course in user_enrolled_courses])),
                    Course.status == COURSE_STATUS.ACTIVE,
                )
                .order_by(Course.rating.desc(), Course.id)
                .offset(offset)
                .limit(per_page)
                .all()
            )
            paginated_courses = fallback_courses
        
        return paginated_courses
    
    @staticmethod
    def enroll_user(session, user_email, course_id):
        """ Enroll a user in a course """
        user = User.get_user_by_email(session, user_email)
        if not user:
            raise ValueError("User not found")
        
        course = Course.get_course_by_id(session, course_id)
        if not course:
            raise ValueError("Course not found")
        
        if course in user.course_enrollments:
            raise ValueError("User is already enrolled in the course")
        
        enrollment = Enrollment(
            course_id=course.id,
            user_id=user.id
        )
        session.add(enrollment)
        session.flush()
        
        return enrollment
    
    @staticmethod
    def withdraw_user(session, user_email, course_id):
        """ Withdraw a user from a course """
        user = User.get_user_by_email(session, user_email)
        if not user:
            raise ValueError("User not found")
        
        course = Course.get_course_by_id(session, course_id)
        if not course:
            raise ValueError("Course not found")
        
        enrollment = (
            session.query(Enrollment)
            .filter_by(course_id=course.id, user_id=user.id)
            .first()
        )
        
        if not enrollment:
            raise ValueError("User is not enrolled in the course")
        
        try:
            UserService.delete_review(session, user_email, course_id)
        except ValueError:
            pass
        
        session.delete(enrollment)
        session.flush()
    
    @staticmethod
    def get_user_course_review(session, user_email, course_id):
        """ Get the review of the course made by a user """
        user = User.get_user_by_email(session, user_email)
        if not user:
            raise ValueError("User not found")
        
        course = Course.get_course_by_id(session, course_id)
        if not course:
            raise ValueError("Course not found")
        
        review = (
            session.query(Review)
            .filter_by(user_id=user.id, course_id=course.id)
            .first()
        )
        
        return review if review else None
    
    @staticmethod
    def create_review(
        session,
        user_email,
        course_id,
        rating,
        review_text
    ):
        """ Create a review """
        user = User.get_user_by_email(session, user_email)
        if not user:
            raise ValueError("User not found")
        
        course = Course.get_course_by_id(session, course_id)
        if not course:
            raise ValueError("Course not found")
        
        if course not in user.course_enrollments:
            raise ValueError("User is not enrolled in the course")
        
        review = Review(
            course_id=course.id,
            user_id=user.id,
            rating=rating,
            review_text=review_text
        )
        session.add(review)
        session.flush()
        
        return review
    
    @staticmethod
    def edit_review(
        session,
        user_email,
        course_id,
        new_rating,
        new_review_text
    ):
        """ Edit a review """
        user = User.get_user_by_email(session, user_email)
        if not user:
            raise ValueError("User not found")

        course = Course.get_course_by_id(session, course_id)
        if not course:
            raise ValueError("Course not found")
        
        review = (
            session.query(Review)
            .filter_by(user_id=user.id, course_id=course.id)
            .first()
        )
        if not review:
            raise ValueError("Review not found")
        
        review.rating = new_rating
        review.review_text = new_review_text
        session.flush()
        
        return review
    
    @staticmethod
    def delete_review(session, user_email, course_id):
        """ Delete a review """
        user = User.get_user_by_email(session, user_email)
        if not user:
            raise ValueError("User not found")
        
        course = Course.get_course_by_id(session, course_id)
        if not course:
            raise ValueError("Course not found")
        
        review = (
            session.query(Review)
            .filter_by(user_id=user.id, course_id=course.id)
            .first()
        )
        if not review:
            raise ValueError("Review not found")
        
        session.delete(review)
        session.flush()
    
    @staticmethod
    def get_user_favourite_courses(session, user_email, channel_id, page, per_page):
        """ Get all favourite courses of a user """
        user = User.get_user_by_email(session, user_email)
        if not user:
            raise ValueError("User not found")
        
        channel = Channel.get_channel_by_id(session, channel_id)
        if not channel:
            raise ValueError("Channel not found")
        
        offset = (page - 1) * per_page
        
        courses = (
            session.query(Course)
            .join(Favourite)
            .join(User)
            .join(UserChannel)
            .join(Channel)
            .filter(
                User.id == user.id,
                Channel.id == channel_id,
                Course.status == COURSE_STATUS.ACTIVE
            )
        )

        paginated_courses = (
            courses
            .order_by(Favourite.created.desc())
            .offset(offset)
            .limit(per_page)
            .all()
        )
        
        return paginated_courses
    
    @staticmethod
    def add_favourite_course(session, user_email, course_id):
        """ Add a course to the user's favourite courses """
        user = User.get_user_by_email(session, user_email)
        if not user:
            raise ValueError("User not found")
        
        course = Course.get_course_by_id(session, course_id)
        if not course:
            raise ValueError("Course not found")
        
        if course in user.course_favourites:
            raise ValueError("Course is already in the user's favourite courses")
        
        user.course_favourites.append(course)
        session.flush()
    
    @staticmethod
    def remove_favourite_course(session, user_email, course_id):
        """ Remove a course from the user's favourite courses """
        user = User.get_user_by_email(session, user_email)
        if not user:
            raise ValueError("User not found")
        
        course = Course.get_course_by_id(session, course_id)
        if not course:
            raise ValueError("Course not found")
        
        if course not in user.course_favourites:
            raise ValueError("Course is not in the user's favourite courses")
        
        user.course_favourites.remove(course)
        session.flush()