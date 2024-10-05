from sqlalchemy import Column, Integer, String, Text, ForeignKey, Boolean, DateTime
from sqlalchemy.orm import relationship
from sqlalchemy.ext.associationproxy import association_proxy

from database import db

class Message(db.Model):
    __tablename__ = 'messages'

    id = Column(Integer, primary_key=True)
    content = Column(Text, nullable=False)
    sender_id = Column(Integer, ForeignKey('users.id'), nullable=False)
    recipient_id = Column(Integer, ForeignKey('users.id'))
    group_id = Column(Integer, ForeignKey('groups.id'))
    is_group_message = Column(Boolean, nullable=False, default=False)
    created = Column(DateTime, server_default=db.func.now(tz="UTC"), nullable=False)
    updated = Column(DateTime, server_default=db.func.now(tz="UTC"), nullable=False)
    
    # Many-to-one relationship with User and Group
    sender = relationship("User", foreign_keys=[sender_id], back_populates="sent_messages")
    recipient = relationship("User", foreign_keys=[recipient_id], back_populates="received_messages")
    group = relationship("Group", back_populates="messages")

    def __repr__(self):
        return f'<User: {self.user_id}, Group: {self.group_id}>'
    
# group_message = Message(
#     content="Hello group!",
#     sender_id=user1.id,
#     group_id=group1.id,
#     is_group_message=True
# )

# # Direct message
# direct_message = Message(
#     content="Hey, how are you?",
#     sender_id=user1.id,
#     recipient_id=user2.id,
#     is_group_message=False
# )

# session.add(group_message)
# session.add(direct_message)
# session.commit()

# # Querying messages
# # For a group
# group_messages = session.query(Message).filter(
#     Message.group_id == group1.id
# ).order_by(Message.created_on).all()

# # For a direct conversation between two users
# direct_messages = session.query(Message).filter(
#     ((Message.sender_id == user1.id) & (Message.recipient_id == user2.id)) |
#     ((Message.sender_id == user2.id) & (Message.recipient_id == user1.id))
# ).order_by(Message.created_on).all()