from sqlalchemy import Column, Integer, String, DateTime, event
from sqlalchemy.orm import relationship, Session
from sqlalchemy.ext.associationproxy import association_proxy

from database import db

class Group(db.Model):
    __tablename__ = 'groups'

    id = Column(Integer, primary_key=True)
    name = Column(String, nullable=False)
    created = Column(DateTime, server_default=db.func.now(tz="UTC"), nullable=False)
    updated = Column(DateTime, server_default=db.func.now(tz="UTC"), nullable=False)
    
    # Many-to-many relationship with User
    user_associations = relationship("UserGroup", back_populates="group", cascade="all, delete-orphan")
    users = association_proxy('user_associations', 'user')
    messages = relationship("Message", back_populates="group", cascade="all, delete-orphan")

    def __repr__(self):
        return f'<Group {self.name}>'

@event.listens_for(Session, "after_flush")
def delete_empty_groups(session, context):
    groups = session.query(Group).all()
    for group in groups:
        if len(group.users) == 0:
            session.delete(group)

# Create a new group
# new_group = Group(name="Python Study Group")
# session.add(new_group)

# # Add users to the group
# user1 = session.query(User).get(1)
# user2 = session.query(User).get(2)
# new_group.users.extend([user1, user2])

# # Create a message in the group
# message = Message(content="Hello everyone!", user=user1, group=new_group)
# session.add(message)

# session.commit()

# # Remove a user from the group
# new_group.users.remove(user2)
# session.commit()