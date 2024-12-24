from sqlalchemy import Enum, Column, Integer, String, DateTime, func
from sqlalchemy.orm import relationship

from database import Base
from enums.status import STATUS
from enums.community import COMMUNITY
from models.channel import Channel
from models.community_course import CommunityCourse
from models.community_instructor import CommunityInstructor

class Community(Base):
    __tablename__ = 'communities'

    id = Column(Integer, primary_key=True)
    community_type = Column(Enum(COMMUNITY, name="community_enum"), nullable=False)
    name = Column(String, unique=True, nullable=False)
    description = Column(String, nullable=True)
    # address = Column(String, nullable=True)
    # contact_person = Column(String, nullable=True)
    # email = Column(String, nullable=True)
    community_logo_url = Column(String, nullable=True)
    website_url = Column(String, nullable=True)
    # bank_name = Column(String, nullable=True)
    # bank_account_name = Column(String, nullable=True)
    # bank_account_number = Column(String, nullable=True)
    created = Column(DateTime(timezone=True), default=func.now(), nullable=False)
    status = Column(Enum(STATUS, name="status_enum"), default=STATUS.ACTIVE, nullable=False)

    # Many-to-many relationship with Channel
    channels = relationship("Channel", secondary="channel_communities", back_populates="communities")

    # Many-to-many relationship with Instructor
    instructors = relationship("Instructor", secondary="community_instructors", back_populates="communities")

    # Many-to-many relationship with Course
    courses = relationship("Course", secondary="community_courses", back_populates="communities")

    @staticmethod
    def get_communities(session):
        return session.query(Community).filter_by(status=STATUS.ACTIVE).all()
    
    @staticmethod
    def get_community_by_id(session, id):
        return session.query(Community).filter_by(id=id, status=STATUS.ACTIVE).first()
    
    @staticmethod
    def admin_get_community_by_id(session, id):
        return session.query(Community).filter_by(id=id).first()
    
    @staticmethod
    def get_community_by_name(session, name):
        return session.query(Community).filter_by(name=name, status=STATUS.ACTIVE).first()
    
    @staticmethod
    def add_community(
        session,
        community_type,
        name,
        description,
        website_url,
        community_logo_url='',
        status=STATUS.ACTIVE
    ):
        if Community.get_community_by_name(session, name):
            raise ValueError("The community name is already in use")

        new_community = Community(
            community_type=community_type,
            name=name,
            description=description,
            website_url=website_url,
            community_logo_url=community_logo_url,
            status=status
        )
        session.add(new_community)
        session.flush()

        return new_community
    
    @staticmethod
    def change_community_type(session, id, new_community_type):
        if new_community_type not in COMMUNITY.values():
            raise ValueError("Invalid community type")

        community = Community.get_community_by_id(session, id)
        if not community:
            raise ValueError("Community not found")

        community.community_type = new_community_type
        # TODO: deattach all courses from the community
        session.flush()

    @staticmethod
    def change_name(session, id, new_name):
        community = Community.get_community_by_id(session, id)
        if not community:
            raise ValueError("Community not found")

        community.name = new_name
        session.flush()
    
    @staticmethod
    def change_description(session, id, new_description):
        community = Community.get_community_by_id(session, id)
        if not community:
            raise ValueError("Community not found")

        community.description = new_description
        session.flush()
    
    @staticmethod
    def change_community_logo_url(session, id, new_community_logo_url):
        community = Community.get_community_by_id(session, id)
        if not community:
            raise ValueError("Community not found")

        community.community_logo_url = new_community_logo_url
        session.flush()
    
    @staticmethod
    def change_website_url(session, id, new_website_url):
        community = Community.get_community_by_id(session, id)
        if not community:
            raise ValueError("Community not found")

        community.website_url = new_website_url
        session.flush()
    
    @staticmethod
    def change_status(session, id, new_status):
        if new_status not in STATUS.values():
            raise ValueError("Invalid status value")

        community = Community.admin_get_community_by_id(session, id)
        if not community:
            raise ValueError("Community not found")

        community.status = new_status
        session.flush()
    
    @staticmethod
    def delete_community(session, id):
        community = Community.get_community_by_id(session, id)
        if not community:
            raise ValueError("Community not found")

        session.delete(community)
        session.flush()
    
    @staticmethod
    def get_channel_communities(session, channel_id):
        channel = Channel.get_channel_by_id(session, channel_id)
        if not channel:
            raise ValueError("Channel not found")
        
        communities = (
            session.query(Community)
            .join(ChannelCommunity)
            .filter(
                ChannelCommunity.channel_id == channel_id,
                Community.status == STATUS.ACTIVE
            )
            .order_by(Community.created.desc())
            .all()
        )

        return communities
    
    @staticmethod
    def attach_channel(session, channel_id, community_id):
        channel = Channel.get_channel_by_id(session, channel_id)
        if not channel:
            raise ValueError("Channel not found")
        
        community = Community.get_community_by_id(session, community_id)
        if not community:
            raise ValueError("Community not found")
        
        channel.communities.append(community)
        session.flush()
    
    @staticmethod
    def detach_channel(session, channel_id, community_id):
        channel = Channel.get_channel_by_id(session, channel_id)
        if not channel:
            raise ValueError("Channel not found")
        
        community = Community.get_community_by_id(session, community_id)
        if not community:
            raise ValueError("Community not found")
        
        channel.communities.remove(community)
        session.flush()

    def __repr__(self):
        return f'<Name: {self.name}>'