from models.community import Community
from models.instructor import Instructor, STATUS as INSTRUCTOR_STATUS
from models.community_instructor import CommunityInstructor

class CommunityServiceError(Exception):
    pass

class CommunityService:
    @staticmethod
    def get_community_instructors(session, community_id):
        """ Get instructors attached to a community """
        community = Community.get_community_by_id(session, community_id)
        if not community:
            raise ValueError("Community not found")
        
        instructors = (
            session.query(Instructor)
            .join(CommunityInstructor)
            .filter(
                CommunityInstructor.community_id == community_id,
                Instructor.status == INSTRUCTOR_STATUS.ACTIVE
            )
            .order_by(Instructor.created.desc())
            .all()
        )
        
        return instructors

    @staticmethod
    def attach_instructor(session, community_id, instructor_id):
        """ Attach an instructor to a community """
        community = Community.get_community_by_id(session, community_id)
        if not community:
            raise ValueError("Community not found")

        instructor = Instructor.get_instructor_by_id(session, instructor_id)
        if not instructor:
            raise ValueError("Instructor not found")

        if session.query(CommunityInstructor).filter_by(instructor_id=instructor.id, community_id=community.id).first():
            raise ValueError("Instructor is already attached to the community")

        community.instructors.append(instructor)
        session.flush()

        return community.id
    
    @staticmethod
    def detach_instructor(session, community_id, instructor_id):
        """ Detach an instructor from a community """
        community = Community.get_community_by_id(session, community_id)
        if not community:
            raise ValueError("Community not found")
        
        instructor = Instructor.get_instructor_by_id(session, instructor_id)
        if not instructor:
            raise ValueError("Instructor not found")
        
        community_instructor = session.query(CommunityInstructor).filter_by(instructor_id=instructor.id, community_id=community.id).first()
        if not community_instructor:
            raise ValueError("Instructor is not attached to the community")
        
        session.delete(community_instructor)
        session.flush()

        return community.id