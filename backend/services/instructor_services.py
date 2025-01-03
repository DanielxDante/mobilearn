from models.instructor import Instructor
from models.course import Course, STATUS as COURSE_STATUS
from models.offer import Offer
from models.community import Community

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
        