from sqlalchemy import func

from models.user import User, STATUS as USER_STATUS
from models.channel import Channel
from models.user_channel import UserChannel
from models.community import Community, STATUS as COMMUNITY_STATUS
from models.channel_community import ChannelCommunity

class ChannelServiceError(Exception):
    pass

class ChannelService:
    @staticmethod
    def get_channel_users(session, channel_id):
        """ Get all users in a channel """
        channel = Channel.get_channel_by_id(session, channel_id)
        if not channel:
            raise ValueError("Channel not found")
        
        users = (
            session.query(User)
            .join(UserChannel)
            .filter(
                UserChannel.channel_id == channel_id,
                User.status == USER_STATUS.ACTIVE
            )
            .order_by(User.created.desc())
            .all()
        )
        
        return users

    @staticmethod
    def invite_user(session, invite_code, user_email):
        """ Invite a user to a channel """
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
        """ Remove a user from a channel """
        channel = Channel.get_channel_by_id(session, id)
        if not channel:
            raise ValueError("Channel not found")
        
        user = User.get_user_by_email(session, user_email)
        if not user:
            raise ValueError("User not found")
        
        user_channel = session.query(UserChannel).filter_by(user_id=user.id, channel_id=channel.id).first()
        if not user_channel:
            raise ValueError("User is not in the channel")
        
        session.delete(user_channel)
        session.flush()
    
    @staticmethod
    def get_channel_communities(session, channel_id):
        """ Get communities attached to a channel """
        channel = Channel.get_channel_by_id(session, channel_id)
        if not channel:
            raise ValueError("Channel not found")
        
        communities = (
            session.query(Community)
            .join(ChannelCommunity)
            .filter(
                ChannelCommunity.channel_id == channel_id,
                Community.status == COMMUNITY_STATUS.ACTIVE
            )
            .order_by(Community.created.desc())
            .all()
        )

        return communities
    
    @staticmethod
    def attach_community(session, channel_id, community_id):
        """ Attach a community to a channel """
        channel = Channel.get_channel_by_id(session, channel_id)
        if not channel:
            raise ValueError("Channel not found")
        
        community = Community.get_community_by_id(session, community_id)
        if not community:
            raise ValueError("Community not found")
        
        if session.query(ChannelCommunity).filter_by(channel_id=channel_id, community_id=community_id).first():
            raise ValueError("Community is already attached to the channel")
        
        channel.communities.append(community)
        session.flush()
    
    @staticmethod
    def detach_community(session, channel_id, community_id):
        """ Detach a community from a channel """
        channel = Channel.get_channel_by_id(session, channel_id)
        if not channel:
            raise ValueError("Channel not found")
        
        community = Community.get_community_by_id(session, community_id)
        if not community:
            raise ValueError("Community not found")
        
        channel_community = session.query(ChannelCommunity).filter_by(channel_id=channel_id, community_id=community_id).first()
        if not channel_community:
            raise ValueError("Community is not attached to the channel")
        
        session.delete(channel_community)
        session.flush()