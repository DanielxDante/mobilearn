from sqlalchemy import Column, ForeignKey, Integer, Boolean, DateTime, func, UniqueConstraint, Enum
from sqlalchemy.orm import relationship, object_session
from database import Base

class ChatParticipant(Base):
    __tablename__ = 'chat_participants'

    id = Column(Integer, primary_key=True)
    chat_id = Column(Integer, ForeignKey('chats.id'), nullable=False)
    participant_id = Column(Integer, nullable=False)
    participant_type = Column(Enum("user", "instructor", name="participant_type_enum"), nullable=False)
    is_admin = Column(Boolean, nullable=False, default=False)
    joined = Column(DateTime(timezone=True), default=func.now(), nullable=False)
    last_read = Column(DateTime(timezone=True), default=func.now(), nullable=False)

    __table_args__ = (UniqueConstraint('chat_id', 'participant_id', 'participant_type'),)

    # Many-to-one relationship with Chat
    chat = relationship("Chat", back_populates="participants")

    # Many-to-one relationship with Message
    sent_messages = relationship("Message", back_populates="sender", cascade="all, delete-orphan")

    @property
    def underlying_user(self):
        session = object_session(self)
        if not session:
            raise RuntimeError('No session')
        
        if self.participant_type == 'user':
            from models.user import User
            return User.get_user_by_id(session, self.participant_id)
        elif self.participant_type == 'instructor':
            from models.instructor import Instructor
            return Instructor.get_instructor_by_id(session, self.participant_id)

    @staticmethod
    def get_chat_participant_by_id(session, id):
        return session.query(ChatParticipant).filter_by(id=id).first()

    def __repr__(self):
        return f'<(ChatParticipant) Chat: {self.chat_id}, Participant: {self.participant_id}>, Participant Type: {self.participant_type}'
    