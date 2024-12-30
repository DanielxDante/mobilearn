from models.course import Course
from models.instructor import Instructor, STATUS as INSTRUCTOR_STATUS
from models.offer import Offer

class CourseServiceError(Exception):
    pass

class CourseService:
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
    
    # @staticmethod
