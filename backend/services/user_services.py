from models.user import User
from models.channel import Channel, STATUS as CHANNEL_STATUS
from models.course import Course, STATUS as COURSE_STATUS
from models.user_channel import UserChannel
from models.enrollment import Enrollment
from models.review import Review

class UserServiceError(Exception):
    pass

class UserService:
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
            .filter(
                Enrollment.user_id == user.id,
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