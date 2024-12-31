from exponent_server_sdk import PushClient
from exponent_server_sdk import PushMessage
from sqlalchemy import Column, BigInteger, String, DateTime, ForeignKey, Text, Boolean
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from database import Base

# First, install the package:
# pip install exponent_server_sdk

class UserDevice(Base):
    __tablename__ = 'user_devices'
    
    id = Column(BigInteger, primary_key=True)
    user_id = Column(BigInteger, ForeignKey('users.id'), nullable=False)
    push_token = Column(String(255), nullable=False)
    device_type = Column(String(50))  # ios/android
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    
    user = relationship("User", back_populates="devices")

class Notification(Base):
    __tablename__ = 'notifications'
    
    id = Column(BigInteger, primary_key=True)
    user_id = Column(BigInteger, ForeignKey('users.id'), nullable=False)
    title = Column(String(255), nullable=False)
    body = Column(Text, nullable=False)
    data = Column(Text)  # JSON data for deep linking
    read = Column(Boolean, default=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    
    user = relationship("User", back_populates="notifications")

def send_push_notification(push_token, title, body, data=None):
    try:
        client = PushClient()
        response = client.publish(
            PushMessage(
                to=push_token,
                title=title,
                body=body,
                data=data or {}
            )
        )
        return response
    except Exception as e:
        print(f"Error sending push notification: {e}")
        return None

# Example usage in your Course Enrollment
def send_welcome_notification(enrollment):
    # Get user's device tokens
    user_devices = enrollment.user.devices
    course = enrollment.course
    
    title = f"Welcome to {course.title}!"
    body = f"Get ready to start learning. Your first chapter: {course.chapters[0].title}"
    data = {
        "type": "course_enrollment",
        "courseId": course.id,
        "chapterId": course.chapters[0].id
    }
    
    # Store notification in database
    notification = Notification(
        user_id=enrollment.user_id,
        title=title,
        body=body,
        data=str(data)
    )
    
    # Send to all user's devices
    for device in user_devices:
        if device.is_active:
            send_push_notification(device.push_token, title, body, data)
    
    return notification