from models.instructor import Instructor
from models.course import Course, STATUS as COURSE_STATUS
from models.offer import Offer
from models.community import Community

class InstructorServiceError(Exception):
    pass

class InstructorService:
    @staticmethod
    def get_instructor_courses(session, instructor_id):
        """ Get courses attached to an instructor """
        instructor = Instructor.get_instructor_by_id(session, instructor_id)
        if not instructor:
            raise ValueError("Instructor not found")
        
        courses = (
            session.query(Course)
            .join(Offer)
            .filter(
                Offer.instructor_id == instructor_id,
                Course.status == COURSE_STATUS.ACTIVE
            )
            .order_by(Course.created.desc())
            .all()
        )
        
        return courses
    
    # @staticmethod
    # def create_course(session, instructor_id, title, description, price, discount):
    #     """ Create a new course """
    #     instructor = Instructor.get_instructor_by_id(session, instructor_id)
    #     if not instructor:
    #         raise ValueError("Instructor not found")
        
    #     community = instructor.company
    #     if not Community.get_community_by_name(session, community):
    #         raise ValueError("The community is not found")
        

        
    #     course = Course(
    #         title=title,
    #         description=description,
    #         price=price,
    #         discount=discount,
    #         instructor_id=instructor_id
    #     )
    #     session.add(course)
    #     session.flush()
        
    #     return course.id