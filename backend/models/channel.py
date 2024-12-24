from sqlalchemy import Enum, Column, Integer, String, DateTime, func
from sqlalchemy.orm import relationship

from database import Base
from enums.status import STATUS
from models.user import User
from models.channel_community import ChannelCommunity

class Channel(Base):
    __tablename__ = 'channels'

    id = Column(Integer, primary_key=True)
    name = Column(String, nullable=False)
    description = Column(String, nullable=True)
    invite_code = Column(String, unique=True, nullable=True)
    channel_picture_url = Column(String, nullable=True)
    created = Column(DateTime(timezone=True), default=func.now(), nullable=False)
    status = Column(Enum(STATUS, name="status_enum"), default=STATUS.ACTIVE, nullable=False)

    # Many-to-many relationship with User
    users = relationship("User", secondary="user_channels", back_populates="channels")

    # Many-to-many relationship with Community
    communities = relationship("Community", secondary="channel_communities", back_populates="channels")

    @staticmethod   
    def get_channels(session):
        return session.query(Channel).filter_by(status=STATUS.ACTIVE).all()

    @staticmethod
    def get_channel_by_id(session, id):
        return session.query(Channel).filter_by(id=id, status=STATUS.ACTIVE).first()
    
    @staticmethod
    def admin_get_channel_by_id(session, id):
        return session.query(Channel).filter_by(id=id).first()
    
    @staticmethod
    def get_channel_by_invite_code(session, invite_code):
        return session.query(Channel).filter_by(invite_code=invite_code, status=STATUS.ACTIVE).first()

    @staticmethod
    def add_channel(session, name, description, invite_code, status=STATUS.ACTIVE):
        if Channel.get_channel_by_invite_code(session, invite_code):
            raise ValueError("The channel invite code is already in use")

        new_channel = Channel(
            name=name,
            description=description,
            invite_code=invite_code,
            status=status
        )
        session.add(new_channel)
        session.flush()

        return new_channel
    
    @staticmethod
    def change_name(session, id, new_name):
        channel = Channel.get_channel_by_id(session, id)
        if not channel:
            raise ValueError("Channel not found")

        channel.name = new_name
        session.flush()
    
    @staticmethod
    def change_description(session, id, new_description):
        channel = Channel.get_channel_by_id(session, id)
        if not channel:
            raise ValueError("Channel not found")

        channel.description = new_description
        session.flush()

    @staticmethod
    def change_invite_code(session, id, new_invite_code):
        """ All users previously invited to the channel will need to be re-invited """
        channel = Channel.get_channel_by_id(session, id)
        if not channel:
            raise ValueError("Channel not found")

        channel.invite_code = new_invite_code
        channel.users = []
        session.flush()
    
    @staticmethod
    def change_channel_picture_url(session, id, new_channel_picture_url):
        channel = Channel.get_channel_by_id(session, id)
        if not channel:
            raise ValueError("Channel not found")

        channel.channel_picture_url = new_channel_picture_url
        session.flush()

    @staticmethod
    def change_status(session, id, new_status):
        if new_status not in STATUS.values():
            raise ValueError("Invalid status value")
        
        channel = Channel.admin_get_channel_by_id(session, id)
        if not channel:
            raise ValueError("Channel not found")
        
        channel.status = new_status
        session.flush()
    
    @staticmethod
    def delete_channel(session, id):
        channel = Channel.get_channel_by_id(session, id)
        if not channel:
            raise ValueError("Channel not found")
        
        session.delete(channel)
        session.flush()

    @staticmethod
    def get_user_channels(session, user_email):
        user = User.get_user_by_email(session, user_email)
        if not user:
            raise ValueError("User not found")
        
        channels = (
            session.query(Channel)
            .join(UserChannel)
            .filter(
                UserChannel.user_id == user.id,
                Channel.status == STATUS.ACTIVE
            )
            .order_by(Channel.created.desc())
            .all()
        )

        return channels

    @staticmethod
    def invite_user(session, invite_code, user_email):
        channel = Channel.get_channel_by_invite_code(session, invite_code)
        if not channel:
            raise ValueError("Channel not found")
        
        user = User.get_user_by_email(session, user_email)
        if not user:
            raise ValueError("User not found")
        
        if session.query(UserChannel).filter_by(user_id=user.id, channel_id=channel.id).first():
            raise ValueError("User is already in the channel")
        
        user.channels.append(channel)
        session.flush()

        return channel.id
    
    @staticmethod
    def remove_user(session, id, user_email):
        channel = Channel.get_channel_by_id(session, id)
        if not channel:
            raise ValueError("Channel not found")
        
        user = User.get_user_by_email(session, user_email)
        if not user:
            raise ValueError("User not found")
        
        user_channel = session.query(UserChannel).filter_by(user_id=user.id, channel_id=channel.id).first()
        if not user_channel:
            raise ValueError("User is not in the channel")
        
        user.channels.remove(user_channel)
        session.flush()

    def __repr__(self):
        return f'<ID: {self.id}>, Channel: {self.name}, Invite_code: {self.invite_code}'