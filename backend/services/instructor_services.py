from sqlalchemy import func, not_

from models.instructor import Instructor
from models.course import Course, STATUS as COURSE_STATUS
from models.offer import Offer
from models.enrollment import Enrollment

class InstructorServiceError(Exception):
    pass

class InstructorService:
    @staticmethod
    def get_instructor_courses(session, instructor_email):
        """ Get courses attached to an instructor """
        instructor = Instructor.get_instructor_by_email(session, instructor_email)
        if not instructor:
            raise ValueError("Instructor not found")
        
        courses = (
            session.query(Course)
            .join(Offer)
            .filter(
                Offer.instructor_id == instructor.id,
                Course.status != COURSE_STATUS.DISABLED
            )
            .order_by(Course.created.desc())
            .all()
        )
        
        return courses
    
    @staticmethod
    def get_top_enrolled_courses(session, instructor_email, page, per_page):
        """ Get top enrolled courses for instructors """
        instructor = Instructor.get_instructor_by_email(session, instructor_email)
        if not instructor:
            raise ValueError("Instructor not found")

        offset = (page - 1) * per_page
        
        courses = (
            session.query(Course)
            .join(Enrollment)
            .filter(
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
            instructor_courses = (
                session.query(Course)
                .join(Offer)
                .filter(
                    Offer.instructor_id == instructor.id,
                    Course.status != COURSE_STATUS.DISABLED
                )
            )

            fallback_courses = (
                session.query(Course)
                .filter(
                    not_(Course.id.in_([course.id for course in instructor_courses])),
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
    def attach_course(session, instructor_id, course_id):
        """ Attach a course to an instructor """
        instructor = Instructor.get_instructor_by_id(session, instructor_id)
        if not instructor:
            raise ValueError("Instructor not found")
        
        course = Course.get_course_by_id(session, course_id)
        if not course:
            raise ValueError("Course not found")
        
        if session.query(Offer).filter_by(instructor_id=instructor.id, course_id=course.id).first():
            raise ValueError("Course is already attached to the instructor")
        
        instructor.courses.append(course)
        session.flush()

        return instructor.id
        