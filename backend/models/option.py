# TO BE DEPRECATED

from sqlalchemy import Column, Integer, String, Boolean, ForeignKey, DateTime
from sqlalchemy.orm import relationship
from sqlalchemy.ext.associationproxy import association_proxy

from database import db

class Option(db.Model):
    __tablename__ = 'options'

    id = Column(Integer, primary_key=True)
    question_id = Column(Integer, ForeignKey('questions.id'))
    option_text = Column(String, nullable=False)
    is_correct = Column(Boolean, default=False)
    created = Column(DateTime, server_default=db.func.now(tz="UTC"), nullable=False)
    updated = Column(DateTime, server_default=db.func.now(tz="UTC"), nullable=False)

    question = relationship("MCQQuestion", back_populates="options")
