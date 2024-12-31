from enum import Enum

class LESSON(str, Enum):
    TEXT = 'text'
    VIDEO = 'video'
    HOMEWORK = 'homework'

    def __str__(self):
        return self.value

    @classmethod
    def values(cls):
        return [member.value for member in cls]