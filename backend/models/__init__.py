from sqlalchemy.orm import DeclarativeBase
from sqlalchemy import event

from .user import User

STATUSES = ('active', 'disabled')

class ModelBase(DeclarativeBase):
    pass