from sqlalchemy import Column, Integer, String, DateTime

from database import db

class TokenBlocklist(db.Model):
    __tablename__ = 'tokens'
    
    id = Column(Integer, primary_key=True)
    jti = Column(String, nullable=False, index=True)
    created_at = Column(DateTime, nullable=False)

    @staticmethod
    def add_token(session, jti):
        token = TokenBlocklist(jti=jti)
        session.add(token)

    def __repr__(self):
        return f'<Token: {self.jti}>'