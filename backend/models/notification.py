from sqlalchemy import Enum, Column, Integer, Text, Boolean, DateTime, func

from database import Base
from enums.notification import NOTIFICATION
from enums.recipient import RECIPIENT
from models.user import User
from models.instructor import Instructor

class Notification(Base):
    __tablename__ = 'notifications'

    id = Column(Integer, primary_key=True)
    title = Column(Text, nullable=False)
    body = Column(Text, nullable=False)
    notification_type = Column(Enum(NOTIFICATION, name="notification_enum"), nullable=False)
    read = Column(Boolean, nullable=False, default=False)
    timestamp = Column(DateTime(timezone=True), nullable=False, default=func.now())
    
    recipient_id = Column(Integer, nullable=False)
    recipient_type = Column(Enum(RECIPIENT, name="recipient_enum"), nullable=False)

    @property
    def recipient(self):
        if self.recipient_type == RECIPIENT.USER:
            return User.get_user_by_id(self.recipient_id)
        elif self.recipient_type == RECIPIENT.INSTRUCTOR:
            return Instructor.get_instructor_by_id(self.recipient_id)
        return None

    @staticmethod
    def get_notifications(session):
        return session.query(Notification).all()

    @staticmethod
    def get_notification_by_id(session, id):
        return session.query(Notification).filter_by(id=id).first()

    @staticmethod
    def add_notification(session, title, body, notification_type, recipient_id, recipient_type):
        if notification_type not in NOTIFICATION.values():
            raise ValueError("Invalid notification type")
        
        if recipient_type not in RECIPIENT.values():
            raise ValueError("Invalid recipient type")
        if recipient_type == RECIPIENT.user:
            if not User.get_user_by_id(session, recipient_id):
                raise ValueError("User not found")
        elif recipient_type == RECIPIENT.instructor:
            if not Instructor.get_instructor_by_id(session, recipient_id):
                raise ValueError("Instructor not found")
        
        notification = Notification(
            title=title,
            body=body,
            notification_type=notification_type,
            recipient_id=recipient_id,
            recipient_type=recipient_type
        )

        session.add(notification)
        session.flush()

        return notification

    @staticmethod
    def mark_as_read(session, id):
        notification = Notification.get_notification_by_id(session, id)
        if not notification:
            raise ValueError("Notification not found")

        notification.read = True
        session.flush()

        return notification
    
    def __repr__(self):
        return f'<Notification: {self.id}>'