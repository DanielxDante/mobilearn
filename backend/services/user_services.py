from models.user import User
from models.channel import Channel, STATUS as CHANNEL_STATUS
from models.user_channel import UserChannel

class UserServiceError(Exception):
    pass

class UserService:
    @staticmethod
    def get_user_channels(session, user_email):
        """ Get all active channels that a user has been invited to """
        user = User.get_user_by_email(session, user_email)
        if not user:
            raise ValueError("User not found")
        
        channels = (
            session.query(Channel)
            .join(UserChannel)
            .filter(
                UserChannel.user_id == user.id,
                Channel.status == CHANNEL_STATUS.ACTIVE
            )
            .order_by(Channel.created.desc())
            .all()
        )

        return channels