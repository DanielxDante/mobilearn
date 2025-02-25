from sqlalchemy import or_, not_, func

from models.notification import Notification, NOTIFICATION, RECIPIENT
from models.user import User
from models.instructor import Instructor
from utils.expo_push_notifications import send_push_notification
class NotificationServiceError(Exception):
    pass

class NotificationService:
    @staticmethod
    def get_unread_notifications(session, recipient_email, recipient_type):
        """
        Get unread notifications for a user
        Also mark the notifications as read
        """
        if recipient_type == RECIPIENT.USER:
            recipient = User.get_user_by_email(session, recipient_email)
        elif recipient_type == RECIPIENT.INSTRUCTOR:
            recipient = Instructor.get_instructor_by_email(session, recipient_email)
        else:
            raise ValueError("Invalid recipient type")
        
        notifications = (
            session.query(Notification)
            .filter(
                Notification.recipient_id == recipient.id,
                Notification.recipient_type == recipient_type,
                Notification.read == False
            )
            .order_by(Notification.timestamp.desc())
            .all()
        )

        for notification in notifications:
            Notification.mark_as_read(session, notification.id)

        return notifications
    
    @staticmethod
    def add_notification(session, title, body, notification_type, recipient_id, recipient_type):
        """
        Add a new notification to the database
        Send a push notification to the recipient
        """
        if notification_type not in NOTIFICATION.values():
            raise ValueError("Invalid notification type")
        
        if recipient_type not in RECIPIENT.values():
            raise ValueError("Invalid recipient type")

        notification = Notification.add_notification(
            session,
            title=title,
            body=body,
            notification_type=notification_type,
            recipient_id=recipient_id,
            recipient_type=recipient_type
        )

        if recipient_type == RECIPIENT.USER:
            recipient = User.get_user_by_id(session, recipient_id)
        elif recipient_type == RECIPIENT.INSTRUCTOR:
            recipient = Instructor.get_instructor_by_id(session, recipient_id)
        if recipient.device_token:
            send_push_notification(
                expo_token=recipient.device_token,
                title=title,
                body=body
            )
        else:
            print("Recipient device token not registered. Skipping push notification.")

        return notification