from sqlalchemy import Column, Integer, String, DateTime, func

from database import Base

class TokenBlocklist(Base):
    __tablename__ = 'tokens'
    
    id = Column(Integer, primary_key=True)
    jti = Column(String, nullable=False, index=True)
    token_type = Column(String, nullable=False) # 'access' or 'refresh'
    created_at = Column(DateTime, nullable=False, default=func.now())

    @staticmethod
    def add_token(session, jti, token_type):
        token = TokenBlocklist(jti=jti, token_type=token_type)
        session.add(token)
        session.flush()

    def __repr__(self):
        return f'<Token: {self.jti}>'