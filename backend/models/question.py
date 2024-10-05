from sqlalchemy import Enum, Column, Integer, Text, ForeignKey, DateTime
from sqlalchemy.orm import relationship

from database import db

QUESTION_TYPES = ("multiple_choice", "open_ended")

class Question(db.Model):
    __tablename__ = 'questions'

    id = Column(Integer, primary_key=True)
    quiz_id = Column(Integer, ForeignKey('lessons.id'))
    type = Column(Enum(*QUESTION_TYPES), nullable=False)
    question_text = Column(Text, nullable=False)
    created = Column(DateTime, server_default=db.func.now(tz="UTC"), nullable=False)
    updated = Column(DateTime, server_default=db.func.now(tz="UTC"), nullable=False)
    
    quiz = relationship("QuizLesson", back_populates="questions")

    __mapper_args__ = {
        'polymorphic_on': type,
        'polymorphic_identity': 'question'
    }

    def __repr__(self):
        return f'<Question: {self.question_text}>'

class MCQQuestion(Question):
    option_count = Column(Integer, nullable=False)

    __mapper_args__ = {
        'polymorphic_identity': QUESTION_TYPES[0]
    }

class OpenEndedQuestion(Question):
    model_answer = Column(Text, nullable=False)

    __mapper_args__ = {
        'polymorphic_identity': QUESTION_TYPES[1]
    }
